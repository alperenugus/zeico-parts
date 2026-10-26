import { json } from '../../../lib/auth.js';

// Reaching this handler means the middleware accepted the session.
export const onRequestGet = () => json({ ok: true });
