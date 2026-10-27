# Fixlective

**Inteligencia colectiva para diagnosticar fallas de celulares.** Un “Waze de fallas” para técnicos: buscar síntomas, consultar causas y mediciones, aportar casos y validar soluciones. La meta de encontrar información útil en menos de 10 segundos aún no fue medida.

## Estado del MVP

Backend Node.js (ES Modules), Express 5 y PostgreSQL/Supabase. CRUD de cuatro entidades, búsqueda por modelo o síntoma, paginación, confirmaciones con contador automático y autenticación por email/contraseña mediante **Supabase Auth**. No hay frontend ni funciones de IA.

### Modelo de datos

```text
auth.users (1) ----< failure_cases (1) ----< causes (1) ----< measurements
         |                 |
         |                 +--------------------< confirmations
         +----< aportes (owner_id en cada tabla)
```

- `failure_cases`: dispositivo, síntoma, consumo, estado, autor y total de confirmaciones.
- `causes`: causas verificadas o hipótesis y resultado de la reparación.
- `measurements`: mediciones eléctricas asociadas a una causa.
- `confirmations`: “también me pasó” y “solución confirmada”; una de cada tipo por usuario/caso.

Cada registro nuevo se asocia al usuario autenticado mediante `owner_id` (UUID de Supabase Auth). El backend obtiene la identidad desde el token, no del JSON enviado. Los usuarios autenticados pueden consultar registros comunitarios; **solo el dueño puede editar o borrar sus registros**. Los aportes a casos ajenos están permitidos. La eliminación de casos provoca eliminación en cascada de sus relaciones.

## Instalación local

Requisitos: Node.js 20+ y un proyecto Supabase con base PostgreSQL y Auth habilitado.

1. En el SQL Editor de Supabase, ejecutar `backend/migrations/001_mvp.sql` y luego `backend/migrations/002_auth_ownership.sql`.
2. Copiar `backend/.env.example` a `backend/.env` y configurar `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `DB_SSL=true`.
3. Ejecutar:

```bash
cd backend
npm install
npm start
```

> El `package-lock.json` debe regenerarse con `npm install` para incorporar `postgres` y confirmarse antes de usar `npm ci`. No subir `.env` ni contraseñas. Utilizar la conexión de PostgreSQL **solo desde el servidor**, nunca desde el navegador.

## API

Base: `http://localhost:3000/api`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Estado básico del servidor (público) |
| POST | `/auth/signup` | Registrar usuario por email y contraseña |
| POST | `/auth/login` | Iniciar sesión y obtener `access_token` |
| GET | `/auth/me` | Consultar usuario autenticado |
| GET | `/{recurso}` | Listar |
| GET | `/{recurso}/:id` | Consultar |
| POST | `/{recurso}` | Crear |
| PATCH | `/{recurso}/:id` | Actualizar (dueño) |
| DELETE | `/{recurso}/:id` | Eliminar (dueño) |

Recursos: `failure-cases`, `causes`, `measurements`, `confirmations`. Todos los endpoints CRUD requieren `Authorization: Bearer <access_token>`. Los listados aceptan `limit` (máximo 100) y `offset`; `failure-cases?q=...` busca por modelo/síntoma; causas/confirmaciones aceptan `case_id` y mediciones `cause_id`.

## Postman

Importar `postman/Fixlective-MVP.postman_collection.json`. Configurar `base_url`, `email` y `password`. Ejecutar **Authentication → Sign up**, confirmar el correo si Supabase lo exige, luego **Login** (guarda el token automáticamente). Ejecutar Create en orden: caso → causa → medición → confirmación. Las variables UUID se guardan automáticamente. Para borrar, invertir el orden.

## Seguridad y límites

- La API verifica el token en Supabase Auth y aplica autorización por `owner_id` a actualizaciones y eliminaciones.
- Las tablas tienen RLS habilitado sin políticas de acceso directo para clientes `anon` o `authenticated`; las consultas pasan por el backend con credenciales PostgreSQL privadas.
- Los registros existentes antes de la migración de usuarios quedan sin dueño; necesitan asignación administrativa.
- El login básico no incluye recuperación de contraseña, OAuth, roles ni moderación.
- **Pendiente:** pruebas automatizadas y de integración con Supabase real, validación de despliegue, regeneración de lockfile y revisión de seguridad antes de producción.

Más información: [documentación de API](docs/API_MVP.md).

## Principios de producto

Priorizar datos estructurados y microcontribuciones rápidas. Diferenciar hipótesis de causas confirmadas; la IA nunca debe presentarse como evidencia humana. Evitar un foro tradicional y dejar los comparadores avanzados para futuras iteraciones.
