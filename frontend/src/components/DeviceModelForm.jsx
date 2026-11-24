import { useState } from 'react';
import * as models from '../services/device-models.service.js';

export default function DeviceModelForm({ editing, onSaved, onCancel }) {
  const [form, setForm] = useState(() => ({ brand: editing?.brand ?? '', name: editing?.name ?? '' }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editing) await models.update(editing.id, form);
      else await models.create(form);
      onSaved(editing ? 'Modelo actualizado.' : 'Modelo agregado. Ya podés elegirlo al registrar un caso.');
    } catch (err) {
      setError(err.response?.data?.data?.message ?? 'No se pudo guardar el modelo. Intentá de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="model-form" className="panel scroll-mt-6" aria-labelledby="model-form-title">
      <div className="panel-heading"><span className="module-number">02</span><h2 id="model-form-title">{editing ? 'Editar modelo' : 'Agregar modelo'}</h2></div>
      <form className="p-5" onSubmit={submit}>
        <p className="mb-5 text-sm text-on-surface-variant">Un mismo modelo puede reunir distintos casos de falla.</p>
        <fieldset disabled={busy} className="space-y-5">
          <div>
            <label htmlFor="brand">Marca *</label>
            <input id="brand" name="brand" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })}
              required maxLength={80} placeholder="Ej.: Samsung" />
          </div>
          <div>
            <label htmlFor="model-name">Modelo *</label>
            <input id="model-name" name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}
              required maxLength={80} placeholder="Ej.: Galaxy A52" />
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button type="submit" className="button-primary w-full">{busy ? 'Guardando…' : editing ? 'Guardar cambios' : '+ Agregar modelo'}</button>
        </fieldset>
        {editing ? <button type="button" className="button-secondary mt-3 w-full" disabled={busy} onClick={onCancel}>Cancelar edición</button> : null}
        <p className="label mt-4 text-on-surface-variant">* Campos obligatorios</p>
      </form>
    </section>
  );
}
