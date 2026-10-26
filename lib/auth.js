const enc = new TextEncoder();
const COOKIE = 'zeico_admin';
const TTL = 12 * 3600; // session length in seconds
const MAX_FAILS = 10;  // failed logins per IP per 15 min

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Signing key depends on the password too, so changing ADMIN_PASSWORD logs everyone out.
async function sign(env, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET + '|' + env.ADMIN_PASSWORD),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export function configured(env) {
  return Boolean(env.ADMIN_PASSWORD && env.SESSION_SECRET && env.KV);
}

export async function checkPassword(env, password) {
  const h = async (s) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(String(s))));
  return safeEqual(await h(password), await h(env.ADMIN_PASSWORD));
}

export async function sessionCookie(env) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  return `${COOKIE}=${exp}.${await sign(env, String(exp))}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL}`;
}

export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function isAuthed(request, env) {
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)zeico_admin=(\d+)\.([\w-]+)/);
  if (!m || +m[1] < Date.now() / 1000) return false;
  return safeEqual(await sign(env, m[1]), m[2]);
}

export async function tooManyFails(env, ip) {
  return (+(await env.KV.get('rl:' + ip)) || 0) >= MAX_FAILS;
}

export async function recordFail(env, ip) {
  const n = (+(await env.KV.get('rl:' + ip)) || 0) + 1;
  await env.KV.put('rl:' + ip, String(n), { expirationTtl: 900 });
}

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });
