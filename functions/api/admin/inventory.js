import { json } from '../../../lib/auth.js';
import { getInventory, putInventory, appendLog, validId } from '../../../lib/inventory.js';

const money = (v) => v === null || (typeof v === 'number' && isFinite(v) && v >= 0 && v <= 1e6);
const count = (v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 1e7);
const FIELDS = { price: money, oldPrice: money, qty: count };

export async function onRequestGet({ env }) {
  return json({ inventory: await getInventory(env), log: ((await env.KV.get('log', 'json')) || []).slice(0, 200) });
}

// Body: { changes: { [productId]: { price?, oldPrice?, qty? } } }
export async function onRequestPut({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_json' }, 400); }
  const changes = body && body.changes;
  if (!changes || typeof changes !== 'object') return json({ error: 'bad_request' }, 400);

  const inv = await getInventory(env);
  const now = new Date().toISOString();
  const log = [];
  for (const [id, ch] of Object.entries(changes)) {
    if (!validId(id) || !ch || typeof ch !== 'object') return json({ error: 'bad_item', id }, 400);
    const rec = inv[id] || {};
    for (const [field, value] of Object.entries(ch)) {
      if (!FIELDS[field] || !FIELDS[field](value)) return json({ error: 'bad_value', id, field }, 400);
      if ((rec[field] ?? null) !== value) {
        log.push({ t: now, id, field, from: rec[field] ?? null, to: value });
        rec[field] = value;
      }
    }
    if (rec.oldPrice != null && (rec.price == null || rec.oldPrice <= rec.price)) rec.oldPrice = null;
    rec.updatedAt = now;
    inv[id] = rec;
  }
  await putInventory(env, inv);
  await appendLog(env, log);
  return json({ ok: true, inventory: inv, changed: log.length });
}
