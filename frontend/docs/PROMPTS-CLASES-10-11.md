# Clases 10 y 11: prompts adaptados a Fixlective

Fuentes del programa:

- [Clase 10: Frontend base y el select que necesita la relación](https://dh.jmlabs.app/clases/clase-10/clase-10-frontend-api.html).
- [Clase 11: UI completa, navegación, flujos y estados](https://dh.jmlabs.app/clases/clase-11/clase-11-ui-completa.html).

Estos son los seis prompts de las presentaciones, adaptados al dominio de Fixlective. Se mantienen la secuencia, las herramientas y las restricciones. Las tareas asincrónicas y los prerrequisitos se indican aparte; no son prompts originales de las diapositivas.

## Equivalencias del proyecto

| En las presentaciones | En Fixlective |
| --- | --- |
| CuidAR | Fixlective, biblioteca de casos de falla de celulares para técnicos |
| Medicación | Caso de falla (`FailureCase`) |
| PersonaACargo | Modelo de celular (`DeviceModel`) |
| `persona_id` | `device_model_id` |
| `/api/medications` | `/api/failure-cases` |
| `/api/dependents` | `/api/device-models` |
| `?personaId=` | `?deviceModelId=` |
| `nombre_completo` | `brand` + `name` |
| Discontinuar / Reactivar | Archivar / Restaurar |
| `estado: activa \| discontinuada` | `status: active \| archived` |

**Contrato de cursada:** `DeviceModel` contiene `id`, `brand`, `name`. `FailureCase` contiene `id`, `device_model_id`, `symptom`, `diagnosis`, `solution`, `status`. Modelo y síntoma son obligatorios; diagnóstico y solución pueden estar vacíos. Archivar es una decisión de visibilidad y no significa que la reparación esté resuelta.

## Antes de C10: prerrequisito de la clase 9

El repositorio partía de un esqueleto Express con `/api/health`. Para ejecutar estos prompts primero se necesitan los dos CRUD y la relación, con mocks en memoria. Esto es trabajo previo de backend; **no forma parte del prompt de scaffold**, que dice no tocar `backend/`.

- Verificar ambos CRUD en Postman o mediante solicitudes HTTP.
- Verificar `GET /api/failure-cases?deviceModelId=...`.
- Actualizar con `PATCH`, devolver `{ status, data }` y errores `{ status: 'error', data: { message } }`.
- Impedir modelos inexistentes en un caso y la eliminación de modelos con casos asociados.
- Mantener ambos servidores en paralelo: backend en 3000 y frontend en 5173.

## C10 · Prompt 1: scaffold con los dos services

Adaptación de la diapositiva 10. Se ejecuta sobre el frontend inicial, antes de generar componentes.

```text
Soy dev construyendo Fixlective, una biblioteca de casos de falla de
celulares para técnicos independientes y talleres pequeños.
Es UN proyecto con dos carpetas: backend/ (Node/Express, ya hecho, :3000)
y frontend/ (lo que generamos ahora).
Generá el scaffold DENTRO de frontend/ con Vite + React: package.json
(react, react-dom, axios; devDeps vite y @vitejs/plugin-react), index.html,
vite.config.js con proxy de /api a http://localhost:3000,
src/main.jsx, src/App.jsx mínimo sin router, y DOS services:
  - src/services/failure-cases.service.js → /api/failure-cases (?deviceModelId=)
  - src/services/device-models.service.js → /api/device-models
API: update con PATCH; respuestas en { status, data } → devolvé res.data.data.
No toques backend/. No generes componentes todavía.
```

Verificar que cada service desempaquete `res.data.data` y que `update` use `PATCH`.

## C10 · Prompt 2: listado, formulario y select

Adaptación de la diapositiva 17.

```text
Ya tengo el scaffold con failure-cases.service.js y device-models.service.js.
Necesito dos componentes React:
1. FailureCaseList: consume getAll() de failure-cases.service.js y muestra
   el modelo de celular, symptom, diagnosis, solution y status.
   Para mostrar el nombre del modelo usá brand + name de device-models.service.js.
   Maneja loading y errores.
   Recibe un prop refreshTrigger: cuando cambia, vuelve a pedir la lista.
2. FailureCaseForm: device_model_id, symptom, diagnosis y solution.
   Modelo y síntoma son obligatorios; diagnóstico y solución son opcionales.
   device_model_id sale de un <select> poblado con getAll() de
   device-models.service.js (value = id, label = brand + ' ' + name).
   Al crear, avisá con onCreated() para que App cambie el refreshTrigger.
   Si falla: err.response?.data?.data?.message.
Hooks (useState, useEffect). CSS inline mínimo, sin librerías.
```

El `id` y el estado inicial `active` los asigna el backend. No se pide escribir un ID a mano. Probar que la lista carga, que el select tiene modelos y que crear un caso refresca la lista sin recargar la página.

**Tarea asincrónica de C10, incluida en el alcance de hoy:** agregar `DeviceModelList` y `DeviceModelForm`, reutilizando `device-models.service.js`. Mostrar `brand` y `name`, permitir crear un modelo y refrescar su listado. Ambas entidades deben funcionar antes de C11.

## C11 · Preparar el diseño de C6

El ZIP adjunto tiene varios sistemas y variantes. Se seleccionó `Field Technician Modular Spec` como sistema base, con la variante clara de paneles rectos, negro y ámbar. No se mezclan los tokens de las versiones oscuras.

```text
frontend/docs/design/
├── DESIGN.md                   # Export original: field_technician_modular_spec
└── screens/
    ├── casos.html              # buscador_y_ficha_sint_tica_teenage_engineering_style
    ├── casos.png
    ├── nuevo-caso.html         # nuevo_caso_paso_1_dispositivo_y_s_ntoma
    └── nuevo-caso.png
```

Los HTML originales se conservan como referencia. La aplicación se llama Fixlective, aunque el export use ELECTROFIX. Los campos de la aplicación salen del contrato anterior: las maquetas no autorizan nuevas entidades, telemetría, mediciones, stock, porcentajes de verificación ni microcontribuciones.

El ZIP no incluye una vista específica para administrar modelos. Esa pantalla reutiliza los mismos tokens y patrones de lista/formulario; no se atribuye una maqueta de modelos a Stitch.

## C11 · Prompt 3: puente del diseño a los componentes

Adaptación de la diapositiva 7. Antes: `npm i tailwindcss @tailwindcss/vite` y agregar el plugin a Vite.

```text
Aplicá a Fixlective el diseño de Stitch:
#file:frontend/docs/design/DESIGN.md,
#file:frontend/docs/design/screens/casos.html y
#file:frontend/docs/design/screens/nuevo-caso.html.
1. src/index.css con @import "tailwindcss" y un @theme con los tokens del
   front-matter de DESIGN.md, con los nombres que usa el HTML. Importalo
   en main.jsx; Inter y JetBrains Mono disponibles localmente.
2. Reestilá FailureCaseList (tarjetas) y FailureCaseForm siguiendo las
   referencias. Reutilizá el sistema en DeviceModelList y DeviceModelForm;
   no hay una maqueta específica de modelos en el ZIP.
Reglas:
- El HTML es una maqueta con datos inventados: referencia, no se copia.
- Solo markup y clases. No toques services/, estado, efectos, props ni handlers.
- Cada dato del diseño → un campo de la API. Sin campo (corriente, voltaje,
  mediciones, usuarios, porcentajes de verificación): afuera.
- Mandan los tokens del front-matter. Nada de CDN ni imágenes externas.
- Usá el nombre Fixlective en lugar del nombre ELECTROFIX de la maqueta.
- No construyas microcontribuciones, guardados ni el asistente de tres pasos.
```

Conservar los seis campos del contrato. El formulario de esta fase se resuelve en un único paso.

## C11 · Prompt 4: navegación

Adaptación de la diapositiva 12.

```text
En mi app Fixlective ya tengo FailureCaseList/Form y DeviceModelList/Form
apilados en App.jsx.
Agregá react-router-dom: BrowserRouter en main.jsx envolviendo App,
un layout con el header y las pestañas siguiendo el lenguaje visual de
#file:frontend/docs/design/screens/casos.html:
solo "Casos de falla" (/casos) y "Modelos de celulares" (/modelos).
Guardados y microcontribuciones no van todavía.
NavLink con las clases activas del diseño, rutas en App.jsx.
Redirigí / a /casos. Sin librerías de UI además de Tailwind.
Mantené el refreshTrigger que ya refresca la lista al crear.
```

Cada página contiene su List y su Form. `BrowserRouter` va en `main.jsx`.

## C11 · Prompt 5: editar, archivar y feedback

Adaptación de la diapositiva 15. El archivado es la adaptación de producto de discontinuar: conserva el registro técnico y permite restaurarlo.

```text
En Fixlective ya tengo FailureCaseList y FailureCaseForm con el diseño aplicado.
Agregá, con el lenguaje visual de
#file:frontend/docs/design/screens/casos.html:
1. En cada tarjeta, "Editar" (carga el caso en el form) y "Archivar":
   pide confirmación y llama update(id, { status: 'archived' }).
   Si ya está archivado dice "Restaurar" y manda { status: 'active' }.
2. Pestañas "Activos / Archivados / Todos" que filtran por status en el front.
3. FailureCaseForm detecta edición o alta: update() o create() según el caso.
4. Feedback de éxito con el estilo de badge del diseño, se va a los 3s.
Usá los métodos del service que ya existen. No cambies su firma.
```

Aplicar la corrección de la diapositiva 16 al usar los formularios:

```jsx
<FailureCaseForm key={editing?.id ?? 'nuevo'} editing={editing} />
```

Cambiar de caso debe montar el formulario con sus datos. Al guardar, volver al alta vacía; cancelar edición no guarda. El DELETE permanece en la API de casos, pero la UI principal usa archivar/restaurar.

## C11 · Prompt 6: estados en ambas entidades

Adaptación de la diapositiva 20.

```text
En FailureCaseList necesito manejar tres estados diferenciados:
1. Loading: mientras carga mostrar "Cargando casos de falla…".
2. Error: si la API falla mostrar
   "No se pudieron cargar los casos de falla. Intentá de nuevo."
   con un botón "Reintentar" que vuelve a llamar al service.
3. Empty: si la lista está vacía mostrar
   "No hay casos de falla cargados. Cargá el primero." (distinto del error).
Agregá los mismos tres estados a DeviceModelList, con textos para modelos.
Estilalos con los tokens del diseño (error-container, surface-container-low).
Usá useState para loading y error. Sin librerías externas.
```

**Tarea asincrónica de C11, incluida en el alcance de hoy:** aplicar el mismo diseño a modelos, permitir editar y eliminar con confirmación, feedback y los tres estados. La eliminación de un modelo con casos asociados debe mostrar el rechazo de la API y conservar el modelo.

## Criterio de cierre

En el navegador: crear un modelo → elegirlo en el select → crear un caso → editarlo → archivar con confirmación → verlo en Archivados → restaurarlo. Editar y eliminar un modelo sin casos; verificar que no se elimina uno con casos. Probar loading, error con reintento y listas vacías. Revisar un ancho móvil y que no haya errores en requests normales.

C12 trae Supabase y despliegue. En C10/C11 la persistencia sigue siendo temporal, en memoria.

## Nota sobre el avance

El primer borrador de código comenzó antes de esta adaptación escrita. Este archivo fija la secuencia de referencia para revisar y ajustar ese avance; no afirma que el borrador se haya generado históricamente con estos seis prompts en ese orden.

## Verificación del avance del 17/11/2026

- Pasó `npm test` en backend: recorrido HTTP de ambos CRUD, relación, filtro, validaciones y archivado/restauración.
- Pasó `npm run build` en frontend.
- Se ejecutaron los services reales del frontend contra el proxy de Vite y la API: crear modelo/caso, filtrar, editar, archivar, restaurar y rechazar la eliminación de un modelo con casos. Los registros de esa prueba se eliminaron al terminar.
- `GET /casos` y el proxy de los dos recursos respondieron HTTP 200.
- Se completó después el recorrido en Chrome con la API real: crear, editar, cancelar, archivar/restaurar, confirmaciones, eliminación de modelos, validaciones, loading, error con reintento y ambas listas vacías. Se revisaron escritorio y móvil, y se corrigió un desbordamiento a 320 px.
- La [matriz de verificación y sus capturas](verification/CLASES-10-11.md) relaciona cada requisito con su implementación y evidencia. La limitación inicial de acceso al navegador quedó resuelta.
