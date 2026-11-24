# Fixlective

Inteligencia colectiva para el diagnóstico de fallas técnicas. Históricamente conocido como **Failure Library**, Fixlective propone ser un **“Waze de fallas de celulares”**.

Está dirigido a técnicos independientes y talleres pequeños que diagnostican placas. El objetivo del producto es ayudarles a encontrar causas probables y mediciones útiles en menos de 10 segundos.

## Estado actual

Backend Express con PostgreSQL y Prisma 7, y frontend React para registrar y consultar casos de falla por modelo de celular.

Los [seis prompts del programa adaptados a Fixlective](frontend/docs/PROMPTS-CLASES-10-11.md) documentan las equivalencias con CuidAR, el orden de ejecución, las restricciones y las tareas asincrónicas.

- **Casos de falla** (`/casos`): listado, búsqueda por texto, filtro por modelo, creación y edición. Archivar/restaurar con confirmación y pestañas Activos / Archivados / Todos.
- **Modelos de celulares** (`/modelos`): listado, creación, edición y eliminación con confirmación. Un modelo con casos asociados no se puede eliminar.
- Ambas listas manejan carga, error con reintento y lista vacía. El feedback de éxito dura tres segundos.

El seed carga ejemplos ficticios para la práctica. Diagnóstico y solución son opcionales. El estado archivado indica que el caso sale del listado activo.

La [guía de la clase 12](docs/verification/CLASE-12.md) cubre la migración a Supabase, la colección de Postman y la configuración de Render. La autenticación y el despliegue del frontend corresponden a la clase 13.

## Stack

- Node.js con ES Modules (`type: module`).
- Express.
- CORS y dotenv.
- PostgreSQL y Prisma 7. Supabase aloja la base de práctica.
- Organización MVC en el backend.
- Vite + React + React Router en `frontend/`.
- Axios exclusivamente en `frontend/src/services/`.
- Tailwind con los tokens del diseño de Stitch.

## Inicio local

Usá Node.js 24, npm y un proyecto de práctica en Supabase. Copiá `backend/.env.example` a `backend/.env` y completá `DATABASE_URL` con el Transaction pooler (6543) y `DIRECT_URL` con el Session pooler (5432). Ambas cadenas se obtienen en **Connect** del proyecto.

Desde la raíz del repositorio:

```sh
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run db:check
npm run dev
```

En otra terminal, desde la raíz:

```sh
cd frontend
npm ci
npm run dev
```

Abrí **http://127.0.0.1:5173/**. Vite redirige `/api` al backend en `http://127.0.0.1:3000`. Si cambiás `PORT`, ajustá también el proxy en `frontend/vite.config.js`. Usá `Ctrl+C` para detener el servidor y `npm start` para iniciarlo sin observar archivos.

Git ignora `.env`, `node_modules/`, el cliente Prisma generado y `frontend/dist/`. Las variables requeridas están en `backend/.env.example`.

## API

```http
GET http://localhost:3000/api/health
```

Con la base disponible, responde **HTTP 200**.

```json
{ "status": "ok", "db": "ok" }
```

Si la conexión falla, responde **HTTP 503** con `status: 'error'` y `db: 'unreachable'`.

| Recurso | Operaciones |
| --- | --- |
| `/api/device-models` | `GET`, `POST` |
| `/api/device-models/:id` | `GET`, `PATCH`, `DELETE` |
| `/api/failure-cases` | `GET`, `POST` |
| `/api/failure-cases/:id` | `GET`, `PATCH`, `DELETE` |
| `/api/failure-cases?deviceModelId=...` | Casos de un modelo |

Los recursos responden `{ status: 'ok', data: ... }`. Los errores usan `{ status: 'error', data: { message } }`. Crear devuelve 201; validaciones 400, inexistentes 404 y conflictos 409.

Un modelo contiene `id`, `brand`, `name`. Un caso contiene `id`, `device_model_id`, `symptom`, `diagnosis`, `solution`, `status`. PostgreSQL asigna el ID nuevo y el estado inicial `active`. `PATCH` permite editar campos y alternar `active` / `archived`. La UI de casos usa archivado; el DELETE permanece disponible en la API.

## Despliegue del backend

El [Blueprint de Render](render.yaml) configura un Web Service con raíz `backend`, build `npm ci --include=dev && npx prisma generate`, arranque `npm start` y chequeo en `/api/health`. Cargá `DATABASE_URL` y `DIRECT_URL` en el panel de Render. Aplicá la migración y el seed en Supabase antes del primer despliegue.

Para comprobar la URL pública, ejecutá la [colección de Postman](postman/Fixlective-C12.postman_collection.json) con `baseUrl` apuntando a Render. La [guía de la clase 12](docs/verification/CLASE-12.md) detalla el recorrido de verificación.

## Estructura

```text
backend/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── index.js                 # Entorno y arranque del servidor
├── prisma7.config.ts        # Configuración de la CLI de Prisma
├── prisma/                  # Esquema, migración inicial y seed
├── scripts/                 # Chequeo de conexión
└── src/
    ├── app.js               # Express, middlewares y montaje de rutas
    ├── config/              # Configuraciones futuras
    ├── controllers/         # Validaciones y manejo de solicitudes
    ├── lib/                 # Cliente Prisma compartido
    ├── middlewares/         # Validación de solicitudes
    ├── models/              # Consultas y operaciones con Prisma
    ├── routes/
    │   └── index.routes.js  # Salud y CRUD de las dos entidades
    └── services/            # Lógica de negocio futura
```

Las carpetas todavía vacías conservan sus `.gitkeep`.

```text
frontend/
├── vite.config.js           # Proxy /api → backend :3000
├── docs/
│   ├── PROMPTS-CLASES-10-11.md
│   └── design/              # DESIGN.md, HTML y capturas originales de Stitch
└── src/
    ├── main.jsx             # BrowserRouter envuelve a App
    ├── App.jsx              # Layout, NavLink y rutas
    ├── pages/               # List + Form y refreshTrigger
    ├── components/          # Listados, formularios y feedback
    ├── services/            # Única capa HTTP; devuelve res.data.data
    ├── assets/fonts/        # Inter y JetBrains Mono locales, licencias OFL
    └── index.css            # Tailwind y tokens de Stitch
```

Cada List consulta su service y se actualiza con `refreshTrigger`. El select del formulario de casos obtiene los modelos desde su service, muestra marca + modelo y envía el ID. Una `key` reinicia el formulario al cambiar de registro y al guardar.

## Diseño y verificación

El recorrido de las clases 10 y 11 se verificó en Chrome con la API de práctica. La [matriz de requisitos y capturas](frontend/docs/verification/CLASES-10-11.md) detalla lo comprobado, incluidos los estados de carga/error/vacío y la revisión de móvil y escritorio.

Se usa el export de Stitch aportado para Fixlective: **Field Technician Modular Spec**, variante clara con paneles rectos y acento ámbar. Los tokens del front-matter de `frontend/docs/design/DESIGN.md` se trasladaron al `@theme`. Las fuentes se sirven localmente bajo sus licencias OFL.

Los HTML conservados en `docs/design/screens/` son referencias; sus CDN y datos ficticios no forman parte del runtime. El export no contiene una pantalla de administración de modelos: se reutiliza el sistema visual. Mediciones, porcentajes de verificación y microcontribuciones quedan fuera de esta fase.

Comprobaciones automatizadas:

```sh
cd backend
npm test
```

La prueba HTTP usa un puerto efímero. Con `TEST_DATABASE_URL` apuntando a una base PostgreSQL de pruebas, migrada y con el seed aplicado, verifica CRUD relacionado, filtros, archivado y validaciones. Sin esa variable, verifica la respuesta de salud con la base inaccesible y omite el CRUD.

```sh
cd frontend
npm run build
```

Antes de entregar, verificar en navegador:

1. Crear un modelo → elegirlo en el select → registrar un caso → verlo sin recargar.
2. Editar dos casos distintos: el formulario muestra el elegido; cancelar no guarda.
3. Guardar una edición → archivar con confirmación → verlo en Archivados → restaurarlo.
4. Editar/eliminar un modelo sin casos; comprobar el rechazo con casos asociados.
5. Comprobar listas vacías y error con reintento al detener/reiniciar el backend; observar la carga.
6. Revisar un ancho móvil y las requests en DevTools. Una compilación exitosa no reemplaza esta prueba visual.

El frontend actual requiere el proxy de desarrollo: publicar `dist/` por sí solo no conecta una API en producción.

Al instalar las dependencias, `npm audit` reportó cinco avisos de severidad alta en la cadena de herramientas de desarrollo de Vite por `picomatch`. El [aviso oficial GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) no publica una versión corregida al 17/11/2026. `npm audit --omit=dev` reportó cero vulnerabilidades en las dependencias del frontend que no son de desarrollo. No se forzó un downgrade de Vite.

## Principios de producto

- **FailureCase** es la entidad central de esta práctica.
- Priorizar datos estructurados y microcontribuciones de baja fricción, como “Confirmo solución” o “También me pasó”.
- Separar visual y conceptualmente la evidencia humana de las inferencias de IA. Una hipótesis nunca debe presentarse como evidencia.
- Evitar convertir el producto en un foro tradicional o un wrapper genérico de ChatGPT.
- Mantener Failure Fingerprint y los comparadores de similitud avanzados como direcciones futuras.

Antes de incorporar una funcionalidad, definir el usuario y problema específico, si corresponde al MVP de cursada, al MVP de producto o al futuro, los datos estructurados que genera, su aporte al efecto red, sus riesgos y la alternativa más simple.
