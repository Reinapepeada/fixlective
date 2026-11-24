# Clase 12 · Supabase, Prisma y Render

La práctica de Fixlective usa `DeviceModel` y `FailureCase`. Los formularios y rutas existentes conservan `device_model_id`, `symptom`, `diagnosis`, `solution` y los estados `active` y `archived`. PostgreSQL impide borrar un modelo asociado a casos.

[Presentación de la clase 12](https://dh.jmlabs.app/clases/clase-12/clase-12-supabase-deploy.html) · [Prompts de la clase](https://dh.jmlabs.app/prompts.html?clase=12)

## Base y migración

1. Creá un proyecto de práctica en Supabase con la Data API desactivada. En **Connect**, copiá la cadena **Transaction pooler** (puerto 6543) a `DATABASE_URL` y la de **Session pooler** (puerto 5432) a `DIRECT_URL`, en el archivo local `backend/.env`. Completá la contraseña del proyecto en las dos cadenas.
2. Compará [el esquema de Prisma](../../backend/prisma/schema.prisma) con los formularios y revisá el SQL en [las migraciones](../../backend/prisma/migrations/20261124000000_init/migration.sql). El seed conserva los IDs de ejemplo de las clases 10 y 11. PostgreSQL genera UUIDs para nuevos registros.
3. Desde `backend/`, instalá, generá el cliente, aplicá el SQL ya versionado y corré el seed y el chequeo.

```sh
npm ci
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run db:check
npm run dev
```

El seed carga los modelos antes de sus casos y se puede repetir. Git ignora `backend/.env` y el cliente generado. El repositorio conserva el esquema, el SQL, el seed y los nombres de variables en `backend/.env.example`.

### TLS de Supabase

El backend incluye la CA pública de Supabase en `backend/certs/supabase-root-2021.crt`. Agregá estos parámetros a las URLs al trabajar desde `backend/`.

- `DATABASE_URL` usa `sslmode=verify-full&sslrootcert=certs%2Fsupabase-root-2021.crt` además de `pgbouncer=true`.
- `DIRECT_URL` usa `sslmode=require&sslcert=certs%2Fsupabase-root-2021.crt&sslaccept=strict`.

## Verificación local

Importá [Fixlective · Clase 12](../../postman/Fixlective-C12.postman_collection.json) a Postman. Corré la colección completa con `baseUrl` en `http://127.0.0.1:3000`. Cada ejecución crea un modelo con nombre único, crea un caso asociado y al final borra esos dos registros por sus IDs. Los ejemplos del seed se usan para lectura.

```sh
npx --yes newman run postman/Fixlective-C12.postman_collection.json
```

El comando se ejecuta desde la raíz del repo. La colección comprueba:

- `GET /api/health` con HTTP 200 y `db: 'ok'`.
- Los dos listados y su relación con los ejemplos del seed.
- Alta, lectura, edición y borrado de ambas entidades, filtro por modelo y archivado/restauración.
- HTTP 409 ante un duplicado con otra capitalización y ante el borrado de un modelo asociado. HTTP 400 ante un caso con modelo inexistente.

Para verificar persistencia, creá un caso de práctica con `POST /api/failure-cases`, buscá el ID de la respuesta en `failure_cases` desde el **Table Editor**, reiniciá Express y consultá el mismo ID por HTTP. Al terminar, borrá el caso que creaste.

## Render y cierre

1. Creá un **Blueprint** de Render desde el [archivo del repositorio](../../render.yaml). Para configurar el **Web Service** manualmente, seleccioná la rama `main`, con **Root Directory** en `backend`.
2. Configurá **Build Command** en `npm ci --include=dev && npx prisma generate`, **Start Command** en `npm start` y **Health Check Path** en `/api/health`.
3. Cargá `DATABASE_URL` y `DIRECT_URL` en **Environment**. El build genera el cliente y el servicio consulta la base ya migrada.
4. Guardá la URL pública y volvé a correr la colección con `baseUrl` en la URL de Render, sin barra final.

```sh
npx --yes newman run postman/Fixlective-C12.postman_collection.json --env-var "baseUrl=https://tu-servicio.onrender.com"
```

El cierre requiere la migración inicial versionada, el seed aplicado, la colección aprobada en local y en Render y la URL pública del backend para la clase 13.

## Auditoría del modelo y del SQL

La referencia de Fixlective son los modelos, controladores y formularios de las clases 10 y 11.

| Parte | Decisión en la migración |
| --- | --- |
| Modelos de equipo | `brand` y `name` conservan sus límites. El índice único compara ambos en minúsculas. |
| Casos | `device_model_id`, `symptom`, `diagnosis`, `solution` y `status` mantienen las claves de la API. |
| Relación | La clave foránea aplica `ON DELETE RESTRICT`, que conserva el HTTP 409 al intentar borrar un modelo asociado. |
| IDs y orden | Los IDs de ejemplo siguen fijos. PostgreSQL genera UUIDs de texto para los nuevos registros. Una columna interna conserva el orden de los listados anterior. |
| Estados | PostgreSQL valida `active` y `archived` con un enum. Los casos nuevos empiezan en `active`. |

Las consultas de Prisma son asíncronas. Los controladores esperan su resultado y conservan las rutas, los campos y el formato de las respuestas.

## Evidencia local

Se aplicó la migración inicial sobre una base descartable PGlite, con PostgreSQL embebido, y se ejecutó el seed dos veces. Quedaron tres modelos y tres casos. La colección de Postman se ejecutó dos veces con Newman y pasó las 18 solicitudes y 34 aserciones por ejecución.

Un caso de prueba siguió disponible por HTTP después de reiniciar Express con la misma base. Al terminar se borró el caso de prueba.
