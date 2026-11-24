# Verificación de las clases 10 y 11 — Fixlective

Fecha: 17/11/2026. Alcance: los [seis prompts adaptados](../PROMPTS-CLASES-10-11.md), los prerrequisitos de API y las tareas asincrónicas de ambas clases.

## Resultado

Los recorridos requeridos funcionan en Chrome contra el frontend de Vite y la API Express real de práctica. No se usó una API simulada en el navegador. Los datos continúan en memoria, como corresponde a C10/C11.

## Correspondencia con los prompts

| Requisito | Implementación | Evidencia comprobada |
| --- | --- | --- |
| C10 · Scaffold React y dos apps | `frontend/package.json`, `index.html`, `vite.config.js`, `src/main.jsx`; backend separado | Frontend en 5173 y backend en 3000. `npm run build` pasó. |
| C10 · Dos services, PATCH y envelope | `src/services/device-models.service.js`, `failure-cases.service.js` | Axios solo en services; ambos devuelven `res.data.data` y editan con `axios.patch`. CRUD probado por HTTP y desde la UI. |
| C10 · Listado conectado | `src/components/FailureCaseList.jsx` | Se muestran los ejemplos de la API; el caso creado apareció sin recargar la página. `refreshTrigger` vuelve a consultar. |
| C10 · Formulario y relación | `src/components/FailureCaseForm.jsx` | Se creó un modelo desde la UI y apareció en el select. Elegir su nombre creó un caso con su ID, corroborado luego en la API. |
| C10 · Segunda entidad | `DeviceModelList.jsx`, `DeviceModelForm.jsx` | Alta y listado de modelos funcionando. El modelo nuevo se usó después para registrar el caso. |
| C11 · Diseño de Stitch | `docs/design/`, `src/index.css`, `src/assets/fonts/` | DESIGN.md y las dos referencias HTML coinciden byte a byte con el ZIP. Los 47 colores del front-matter coinciden con `@theme`. Inter y JetBrains Mono cargaron localmente. Revisión visual de las dos pantallas. |
| C11 · Router y pestañas | `src/main.jsx`, `src/App.jsx`, `src/pages/` | BrowserRouter envuelve App en main. Navegación por ambas pestañas; `/` redirige a `/casos`. |
| C11 · Editar y corregir la key | `FailureCasesPage.jsx`, `DeviceModelsPage.jsx` y los dos Form | Se alternó la edición entre dos casos y dos modelos. Cada formulario mostró el registro elegido. Cancelar descartó el cambio; guardar actualizó la tarjeta y volvió al alta vacía. |
| C11 · Archivar/restaurar | `FailureCaseList.jsx` | Se canceló una confirmación y el caso quedó activo. Se confirmó el archivo, se vio en Archivados, y se restauró a Activos. Se conservó su diagnóstico y solución. |
| C11 · Filtros por estado | `FailureCaseList.jsx` | Activos muestra 2 ejemplos, Archivados 1, Todos 3. También se verificaron búsqueda por texto y filtro por modelo. |
| C11 · Feedback | `Feedback.jsx` | Mensajes de alta, edición y archivo visibles; desaparición automática observada. El temporizador del componente usa 3000 ms y se limpia al desmontar. |
| C11 · Loading | Los dos List y el select | Se observó “Cargando modelos de celulares…” y “Cargando casos de falla…” usando la API real con una envoltura temporal de latencia de 2500 ms. La envoltura se retiró al terminar. |
| C11 · Error y Reintentar | `ListState.jsx` y el formulario de casos | Se apagó la API y ambas listas mostraron error con Reintentar. Al volver la API se recuperaron. También funcionó Reintentar modelos en el select. |
| C11 · Empty | `ListState.jsx` | Se retiraron únicamente los fixtures de una instancia temporal. Ambas listas mostraron vacío, distinto del error. Sin modelos, el formulario de casos quedó deshabilitado y ofreció agregar el primero. |
| C11 · Tarea de modelos: editar/eliminar | `DeviceModelList.jsx`, `DeviceModelForm.jsx` y API | Edición guardada; eliminación con confirmación de un modelo sin casos. Un modelo con un caso archivado devolvió conflicto y permaneció en la lista. |
| Errores de guardado | Ambos Form | Modelo duplicado: mensaje de la API y conservación de marca/modelo. Síntoma compuesto de espacios: rechazo por API y conservación del modelo seleccionado. |
| Móvil y escritorio | `src/index.css` | Revisados 1440 px, 390 px y 320 px. Se corrigió un desbordamiento causado por el ancho mínimo del body y la barra de desplazamiento de Windows. Ambas páginas quedaron sin desbordamiento horizontal en los anchos móviles probados. El enlace Registrar caso lleva al formulario. |

## Pruebas y estado final

- `backend`: `npm test` pasó. Es un test de integración con múltiples comprobaciones sobre CRUD, relación, filtro, edición parcial, validaciones y archivado/restauración.
- `frontend`: `npm run build` pasó después de la corrección móvil.
- Se comprobó la página y ambos recursos a través del proxy de Vite: HTTP 200, tres modelos y tres casos (dos activos y uno archivado).
- Los registros `QA cursada` y sus casos se limpiaron. Los fixtures originales se restauraron al reiniciar la API normal.
- La API normal quedó sin latencia artificial. El viewport de Chrome se devolvió a su configuración original.
- No se observaron errores de React ni 404 de la aplicación en los recorridos normales. Chrome registró dos errores de una extensión de bloqueo de anuncios; su origen era `chrome-extension://`, no Fixlective. No se modificó la extensión. Los errores provocados al apagar la API y las validaciones negativas forman parte de la prueba.
- Las cinco alertas de dependencias de desarrollo por `picomatch` siguen documentadas en el README. No forman parte de una funcionalidad pendiente del programa; no hay parche publicado en la versión auditada. El control sin dependencias de desarrollo dio cero avisos.

## Capturas de la aplicación real

- [Casos en escritorio](casos-desktop.jpg).
- [Modelos en escritorio](modelos-desktop.jpg).
- [Casos a 390 px](casos-mobile-390.jpg).
- [Casos a 320 px](casos-mobile-320.jpg).
- [Modelos a 390 px](modelos-mobile-390.jpg).

Las capturas contienen los datos ficticios iniciales de la práctica. El objetivo de diagnóstico rápido de producto, la autenticación, la IA, Supabase y el despliegue no se incorporaron a este alcance de C10/C11.
