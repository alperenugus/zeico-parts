export const LOW_STOCK = 5; // qty at or below this shows "Limited stock"
const LOG_MAX = 500;

export const getInventory = async (env) => (await env.KV.get('inventory', 'json')) || {};
export const putInventory = (env, inv) => env.KV.put('inventory', JSON.stringify(inv));

export function status(qty) {
  if (qty == null) return null;
  if (qty <= 0) return 'order';
  return qty <= LOW_STOCK ? 'low' : 'in';
}

export async function appendLog(env, entries) {
  if (!entries.length) return;
  const log = (await env.KV.get('log', 'json')) || [];
  await env.KV.put('log', JSON.stringify(entries.concat(log).slice(0, LOG_MAX)));
}

export const validId = (id) => typeof id === 'string' && /^[a-z0-9-]{1,64}$/.test(id);
export const validImageUrl = (u) => typeof u === 'string' && /^\/(api\/img|assets\/img)\/[\w.\-]+$/.test(u);
export const isUpload = (u) => u.startsWith('/api/img/');
