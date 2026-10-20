# Fixlective

Inteligencia colectiva para el diagnóstico de fallas técnicas. Históricamente conocido como **Failure Library**, Fixlective propone ser un **“Waze de fallas de celulares”**.

Está dirigido a técnicos independientes y talleres pequeños que diagnostican placas. El objetivo del producto es ayudarles a encontrar causas probables y mediciones útiles en menos de 10 segundos.

## Estado actual

Este repositorio contiene únicamente el esqueleto inicial del backend: configuración, servidor Express y un endpoint de salud. Las carpetas de arquitectura están preparadas, pero todavía no contienen lógica de negocio.

No incluye modelos, controllers implementados, base de datos, autenticación, integraciones de IA ni frontend. El objetivo de diagnóstico en menos de 10 segundos es una meta del producto, todavía no implementada ni validada.

## Stack

- Node.js con ES Modules (`type: module`).
- Express.
- CORS y dotenv.
- Organización preparada para MVC en una API, sin capa de vistas por ahora.

## Inicio local

Requisitos: Node.js y npm. La base fue verificada con Node.js 24.

Desde la raíz del repositorio:

```sh
cd backend
npm ci
npm start
```

El servidor escucha en el puerto **3000** por defecto. Para detenerlo, presioná `Ctrl+C`.

Opcionalmente, creá `backend/.env` copiando el contenido de `backend/.env.example`:

```dotenv
PORT=3000
```

`PORT` permite cambiar el puerto. Los archivos `.env` y `node_modules/` están excluidos de Git; `.env.example` está versionado.

## Endpoint disponible

```http
GET http://localhost:3000/api/health
```

Respuesta: **HTTP 200**.

```json
{ "status": "ok" }
```

Este endpoint confirma que el servidor responde; todavía no hay servicios externos ni base de datos que verificar.

## Estructura

```text
backend/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── index.js                 # Entorno y arranque del servidor
└── src/
    ├── app.js               # Express, middlewares y montaje de rutas
    ├── config/              # Configuraciones futuras
    ├── controllers/         # Manejo futuro de solicitudes
    ├── middlewares/         # Middlewares propios futuros
    ├── models/              # Modelos futuros
    ├── routes/
    │   └── index.routes.js  # Endpoint de salud
    └── services/            # Lógica de negocio futura
```

Las carpetas vacías se conservan mediante archivos `.gitkeep`. La configuración actual de CORS permite cualquier origen para esta base inicial.

## Principios de producto

- **FailureCase** será la entidad central; todavía no está implementada.
- Priorizar datos estructurados y microcontribuciones de baja fricción, como “Confirmo solución” o “También me pasó”.
- Separar visual y conceptualmente la evidencia humana de las inferencias de IA. Una hipótesis nunca debe presentarse como evidencia.
- Evitar convertir el producto en un foro tradicional o un wrapper genérico de ChatGPT.
- Mantener Failure Fingerprint y los comparadores de similitud avanzados como direcciones futuras.

Antes de incorporar una funcionalidad, definir el usuario y problema específico, si corresponde al MVP de cursada, al MVP de producto o al futuro, los datos estructurados que genera, su aporte al efecto red, sus riesgos y la alternativa más simple.
