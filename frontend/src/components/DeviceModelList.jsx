import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as models from '../services/device-models.service.js';
import ListState from './ListState.jsx';

export default function DeviceModelList({ refreshTrigger, onEdit, onChanged }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await models.getAll(controller.signal);
        if (!controller.signal.aborted) setItems(data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err.response?.data?.data?.message ?? 'Intentá de nuevo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [refreshTrigger, retry]);

  async function remove(item) {
    setBusyId(item.id);
    setActionError('');
    try {
      await models.remove(item.id);
      setConfirmId(null);
      onChanged('Modelo eliminado.');
    } catch (err) {
      setActionError(err.response?.data?.data?.message ?? 'No se pudo eliminar el modelo. Intentá de nuevo.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="panel-heading mb-4"><span className="module-number">01</span><h2 id="model-list-title">Catálogo de modelos</h2><span className="label ml-auto">{loading || error ? '—' : String(items.length).padStart(2, '0')}</span></div>
      {actionError ? <p className="form-error mb-4" role="alert">{actionError}</p> : null}
      <ListState loading={loading} error={error} empty={!items.length} onRetry={() => setRetry((value) => value + 1)} noun="modelos de celulares">
        <div className="space-y-3">
          {items.map((item) => (
            <article className="case-card" key={item.id} aria-label={`${item.brand} ${item.name}`}>
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0"><p className="label text-on-surface-variant mb-2 break-words">{item.brand}</p><h3 className="text-xl break-words">{item.name}</h3></div>
                <Link className="button-quiet shrink-0" to={`/casos?modelo=${encodeURIComponent(item.id)}`}>Ver casos ↗</Link>
              </div>
              <footer className="card-actions">
                <button type="button" className="button-secondary" disabled={busyId !== null} onClick={() => onEdit(item)}>Editar modelo ↗</button>
                <button type="button" className="button-quiet" disabled={busyId !== null} onClick={() => { setConfirmId(item.id); setActionError(''); }}>Eliminar</button>
              </footer>
              {confirmId === item.id ? (
                <div className="confirmation" role="group" aria-label="Confirmar eliminación">
                  <p>¿Eliminar {item.brand} {item.name}? Solo se puede eliminar si no tiene casos asociados.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="button-danger" disabled={busyId !== null} onClick={() => remove(item)}>{busyId === item.id ? 'Eliminando…' : 'Confirmar eliminación'}</button>
                    <button type="button" className="button-secondary" disabled={busyId !== null} onClick={() => setConfirmId(null)}>Cancelar</button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </ListState>
    </>
  );
}
