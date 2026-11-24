import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as cases from '../services/failure-cases.service.js';
import * as deviceModels from '../services/device-models.service.js';

export default function FailureCaseForm({ editing, onCreated, onUpdated, onCancel }) {
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState('');
  const [retry, setRetry] = useState(0);
  const [form, setForm] = useState(() => ({
    device_model_id: editing?.device_model_id ?? '',
    symptom: editing?.symptom ?? '',
    diagnosis: editing?.diagnosis ?? '',
    solution: editing?.solution ?? '',
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const canCreate = !modelsLoading && !modelsError && models.length > 0;

  useEffect(() => {
    const controller = new AbortController();
    async function loadModels() {
      setModelsLoading(true);
      setModelsError('');
      try {
        const data = await deviceModels.getAll(controller.signal);
        if (!controller.signal.aborted) setModels(data);
      } catch (err) {
        if (!controller.signal.aborted) setModelsError(err.response?.data?.data?.message ?? 'No se pudieron cargar los modelos.');
      } finally {
        if (!controller.signal.aborted) setModelsLoading(false);
      }
    }
    loadModels();
    return () => controller.abort();
  }, [retry]);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editing) await cases.update(editing.id, form);
      else await cases.create(form);
      if (editing) onUpdated('Caso actualizado.');
      else onCreated('Caso registrado.');
    } catch (err) {
      setError(err.response?.data?.data?.message ?? 'No se pudo guardar el caso. Intentá de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="case-form" className="panel scroll-mt-6" aria-labelledby="case-form-title">
      <div className="panel-heading">
        <span className="module-number">02</span>
        <h2 id="case-form-title">{editing ? 'Editar caso' : 'Registrar caso'}</h2>
      </div>
      <form onSubmit={submit} className="p-5">
        <p className="mb-5 text-sm text-on-surface-variant">El síntoma es lo observado. Completá el diagnóstico y la solución cuando los tengas.</p>
        {modelsLoading ? <p className="mb-4 text-sm" role="status">Cargando modelos de celulares…</p> : null}
        {modelsError ? <div className="form-error mb-4" role="alert"><p>{modelsError}</p><button type="button" className="button-secondary mt-3" onClick={() => setRetry((value) => value + 1)}>Reintentar modelos</button></div> : null}
        {!modelsLoading && !modelsError && !models.length ? <p className="mb-4 text-sm">Primero <Link className="underline" to="/modelos">agregá un modelo de celular</Link>.</p> : null}
        <fieldset disabled={busy || !canCreate} className="space-y-5">
          <div>
            <label htmlFor="device_model_id">Modelo de celular <span aria-hidden="true">*</span></label>
            <select id="device_model_id" name="device_model_id" value={form.device_model_id} onChange={change} required>
              <option value="">Seleccionar modelo</option>
              {models.map((model) => <option key={model.id} value={model.id}>{model.brand} {model.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="symptom">Síntoma observado <span aria-hidden="true">*</span></label>
            <textarea id="symptom" name="symptom" value={form.symptom} onChange={change} required maxLength={500}
              rows={3} placeholder="Ej.: no reconoce el cargador." />
          </div>
          <div>
            <label htmlFor="diagnosis">Diagnóstico <span className="optional">Opcional</span></label>
            <textarea id="diagnosis" name="diagnosis" value={form.diagnosis} onChange={change} maxLength={2000}
              rows={2} placeholder="Causa encontrada en este caso." />
          </div>
          <div>
            <label htmlFor="solution">Solución <span className="optional">Opcional</span></label>
            <textarea id="solution" name="solution" value={form.solution} onChange={change} maxLength={2000}
              rows={2} placeholder="Trabajo realizado y resultado." />
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button type="submit" className="button-primary w-full">{busy ? 'Guardando…' : editing ? 'Guardar cambios' : '+ Registrar caso'}</button>
        </fieldset>
        {editing ? <button type="button" className="button-secondary mt-3 w-full" disabled={busy} onClick={onCancel}>Cancelar edición</button> : null}
        <p className="label mt-4 text-on-surface-variant">* Campos obligatorios</p>
      </form>
    </section>
  );
}
