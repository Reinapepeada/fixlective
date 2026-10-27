-- Ejecutar después de 001_mvp.sql. Las filas previas quedan sin dueño y requieren migración administrativa.
ALTER TABLE failure_cases ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE causes ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE measurements ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE confirmations ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_failure_cases_owner ON failure_cases(owner_id);
CREATE INDEX IF NOT EXISTS idx_causes_owner ON causes(owner_id);
CREATE INDEX IF NOT EXISTS idx_measurements_owner ON measurements(owner_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_owner ON confirmations(owner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_confirmations_once_per_user_type ON confirmations(case_id, owner_id, type) WHERE owner_id IS NOT NULL;
-- Defense in depth: bloquear acceso directo desde clientes Supabase (la API usa conexión servidor PostgreSQL).
ALTER TABLE failure_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
-- No se crean políticas para anon/authenticated: acceso a tablas únicamente mediante backend.
