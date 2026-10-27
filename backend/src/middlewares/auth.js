const config = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Configurar SUPABASE_URL y SUPABASE_ANON_KEY');
  return { url, key };
};
export async function requireAuth(req, res, next) {
  try {
    const token = /^Bearer (.+)$/i.exec(req.headers.authorization || '')?.[1];
    if (!token) return res.status(401).json({ error: 'Bearer token requerido' });
    const { url, key } = config();
    const response = await fetch(url + '/auth/v1/user', {
      headers: { apikey: key, Authorization: 'Bearer ' + token },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(401).json({ error: 'Sesión inválida o vencida' });
    const user = await response.json();
    if (!user.id) return res.status(401).json({ error: 'Usuario inválido' });
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) { next(error); }
}
