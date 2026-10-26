import { json } from '../../lib/auth.js';
import { getInventory, status } from '../../lib/inventory.js';

// Public: prices, stock status and photos only — quantities stay private.
export async function onRequestGet({ env }) {
  const inv = env.KV ? await getInventory(env) : {};
  const out = {};
  for (const [id, r] of Object.entries(inv)) {
    const o = { stock: status(r.qty), images: r.images || null };
    if ('price' in r) { o.price = r.price; o.oldPrice = r.oldPrice ?? null; }
    out[id] = o;
  }
  // CORS so the GitHub Pages copy of the storefront can read live data.
  return json(out, 200, { 'Cache-Control': 'public, max-age=15', 'Access-Control-Allow-Origin': '*' });
}
