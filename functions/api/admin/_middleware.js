import { configured, isAuthed, json } from '../../../lib/auth.js';

export async function onRequest({ request, env, next }) {
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  const path = new URL(request.url).pathname;
  if (path === '/api/admin/login') return next();
  if (!(await isAuthed(request, env))) return json({ error: 'unauthorized' }, 401);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // Same-origin check on top of SameSite=Strict cookies.
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) return json({ error: 'bad_origin' }, 403);
  }
  return next();
}
