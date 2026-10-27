# API MVP Fixlective

## Configuración
1. Desde Supabase SQL Editor (o psql), ejecutar `backend/migrations/001_mvp.sql`.
2. Copiar `backend/.env.example` a `backend/.env` y configurar `DATABASE_URL`. Para Supabase usar SSL (`DB_SSL=true`). Nunca subir credenciales.
3. Ejecutar `cd backend && npm install && npm start`. `npm install` actualiza el lockfile para incluir postgres; confirmar ese cambio en el repositorio.
4. Importar `postman/Fixlective-MVP.postman_collection.json` en Postman.
5. Ejecutar los Create en orden: failure-cases, causes, measurements, confirmations. Las variables de ID se guardan automáticamente. Para eliminar, usar el orden inverso.

## Rutas
Para cada recurso: `GET /api/{recurso}`, `GET /api/{recurso}/:id`, `POST /api/{recurso}`, `PATCH /api/{recurso}/:id`, `DELETE /api/{recurso}/:id`.

Recursos: `failure-cases`, `causes`, `measurements`, `confirmations`.
Listado: `?limit=20&offset=0` (máximo 100); `?case_id=UUID` para causas/confirmaciones; `?cause_id=UUID` para mediciones; `?q=texto` para búsqueda de casos por modelo o síntoma.

Respuestas: 201 creación, 200 lectura/actualización, 204 eliminación, 400 validación, 404 no encontrado, 422 FK inexistente. El contador `confirmations_count` es de solo lectura y se mantiene con un trigger en PostgreSQL, incluyendo eliminaciones y cambios de caso.

## Límites actuales
No hay autenticación ni políticas de autorización: usar únicamente en desarrollo o tras incorporar autenticación y controles de acceso. Las rutas DELETE eliminan datos; borrar un caso elimina sus causas, mediciones y confirmaciones. No hay protección contra confirmaciones repetidas del mismo usuario; decidir esa política antes de producción. No se ejecutaron pruebas de integración contra una base Supabase real.
