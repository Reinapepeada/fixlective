# API MVP — Fixlective

## Configuración
1. Crear proyecto Supabase y habilitar Email/Password en Authentication.
2. Ejecutar `backend/migrations/001_mvp.sql` y después `backend/migrations/002_auth_ownership.sql` en SQL Editor.
3. Configurar `backend/.env` desde `.env.example`: `DATABASE_URL` (conexión privada PostgreSQL), `DB_SSL=true`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
4. `cd backend && npm install && npm start`. Regenerar y confirmar `package-lock.json` antes de utilizar `npm ci`.
5. Importar `postman/Fixlective-MVP.postman_collection.json`; ejecutar Sign up, confirmar email si corresponde, Login y luego las solicitudes CRUD.

## Autenticación
`POST /api/auth/signup` y `POST /api/auth/login` reciben `{"email":"...","password":"..."}`. Login devuelve un `access_token` de Supabase. `GET /api/auth/me` devuelve el usuario actual. Las rutas CRUD requieren `Authorization: Bearer <access_token>`. El backend valida el token contra Supabase Auth en cada solicitud. No se acepta `owner_id` del cliente.

## CRUD
Recursos: `failure-cases`, `causes`, `measurements`, `confirmations`. Para cada uno: `GET /api/{recurso}`, `GET /api/{recurso}/:id`, `POST /api/{recurso}`, `PATCH /api/{recurso}/:id`, `DELETE /api/{recurso}/:id`.

Listas: `?limit=20&offset=0` (máximo 100); `?case_id=UUID` para causas/confirmaciones; `?cause_id=UUID` para mediciones; `?q=texto` para casos.

Cualquier usuario autenticado puede leer y crear aportes. Solo el dueño de un registro puede modificarlo o borrarlo. No se permite modificar las referencias `case_id` o `cause_id` mediante PATCH. El contador de confirmaciones se calcula con un trigger de PostgreSQL y no se edita desde la API. El índice único impide que un mismo usuario registre dos confirmaciones del mismo tipo en el mismo caso.

## Advertencias
La migración 002 requiere el esquema `auth.users` de Supabase. Los registros anteriores quedan con `owner_id=NULL` y no pueden editarse desde la API hasta asignar dueño. La conexión PostgreSQL del backend debe permanecer privada. RLS impide acceso directo desde clientes Supabase sin políticas adicionales. No se han ejecutado pruebas de integración contra un proyecto Supabase real; faltan recuperación de contraseña, rate limiting, moderación y actualización del lockfile.
