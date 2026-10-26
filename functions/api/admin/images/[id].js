import { json } from '../../../../lib/auth.js';
import { getInventory, putInventory, appendLog, validId, validImageUrl, isUpload } from '../../../../lib/inventory.js';

const TYPES = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 12;

function record(inv, id) {
  return inv[id] || (inv[id] = {});
}

// Upload one photo (raw body). Query ?base=<url,url> gives the current list when the product
// still uses its built-in photos, so the new photo is appended to them.
export async function onRequestPost({ request, env, params }) {
  const id = params.id;
  if (!validId(id)) return json({ error: 'bad_item' }, 400);
  const type = (request.headers.get('Content-Type') || '').split(';')[0];
  if (!TYPES[type]) return json({ error: 'bad_type' }, 415);
  const buf = await request.arrayBuffer();
  if (!buf.byteLength || buf.byteLength > MAX_BYTES) return json({ error: 'too_large' }, 413);

  const inv = await getInventory(env);
  const rec = record(inv, id);
  const base = (new URL(request.url).searchParams.get('base') || '').split(',').filter(validImageUrl);
  const list = rec.images || base;
  if (list.length >= MAX_IMAGES) return json({ error: 'too_many' }, 400);

  const key = `${id}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${TYPES[type]}`;
  await env.KV.put('img:' + key, buf, { metadata: { type } });
  const url = '/api/img/' + key;
  rec.images = list.concat(url);
  rec.updatedAt = new Date().toISOString();
  await putInventory(env, inv);
  await appendLog(env, [{ t: rec.updatedAt, id, field: 'images', from: list.length, to: rec.images.length }]);
  return json({ ok: true, url, images: rec.images });
}

// Body: { images: [url, ...] } to reorder/remove, or { images: null } to restore the built-in photos.
export async function onRequestPut({ request, env, params }) {
  const id = params.id;
  if (!validId(id)) return json({ error: 'bad_item' }, 400);
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_json' }, 400); }
  const next = body && body.images;
  if (next !== null && (!Array.isArray(next) || !next.length || next.length > MAX_IMAGES || !next.every(validImageUrl))) {
    return json({ error: 'bad_images' }, 400);
  }

  const inv = await getInventory(env);
  const rec = record(inv, id);
  const prev = rec.images || [];
  // Only previously attached uploads may be referenced, and dropped uploads are deleted.
  if (next && next.some((u) => isUpload(u) && !prev.includes(u))) return json({ error: 'unknown_image' }, 400);
  const removed = prev.filter((u) => isUpload(u) && !(next || []).includes(u));
  await Promise.all(removed.map((u) => env.KV.delete('img:' + u.slice('/api/img/'.length))));

  rec.images = next;
  rec.updatedAt = new Date().toISOString();
  await putInventory(env, inv);
  await appendLog(env, [{ t: rec.updatedAt, id, field: 'images', from: prev.length, to: next ? next.length : 'default' }]);
  return json({ ok: true, images: rec.images });
}
