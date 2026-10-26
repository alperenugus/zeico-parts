import { checkPassword, sessionCookie, tooManyFails, recordFail, json } from '../../../lib/auth.js';

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  if (await tooManyFails(env, ip)) return json({ error: 'locked' }, 429);
  let body = {};
  try { body = await request.json(); } catch (e) {}
  if (!body.password || !(await checkPassword(env, body.password))) {
    await recordFail(env, ip);
    return json({ error: 'invalid' }, 401);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie(env) });
}
