import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
const router = Router();
const settings = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) throw new Error('Falta configuración Supabase Auth');
  return { url: process.env.SUPABASE_URL.replace(/\/$/, ''), key: process.env.SUPABASE_ANON_KEY };
};
async function authRequest(req, res, path) {
  try {
    const { url, key } = settings();
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const response = await fetch(url + path, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), signal: AbortSignal.timeout(8000) });
    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (error) { return res.status(503).json({ error: 'No se pudo contactar Supabase Auth' }); }
}
router.post('/auth/signup', (req,res) => authRequest(req,res,'/auth/v1/signup'));
router.post('/auth/login', (req,res) => authRequest(req,res,'/auth/v1/token?grant_type=password'));
router.get('/auth/me', requireAuth, (req,res) => res.json(req.user));
export default router;
