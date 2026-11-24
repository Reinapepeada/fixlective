import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as cases from '../services/failure-cases.service.js';
import * as deviceModels from '../services/device-models.service.js';
import ListState from './ListState.jsx';

export default function FailureCaseList({ refreshTrigger, onEdit, onChanged }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceModelId = searchParams.get('modelo') ?? '';
  const [items, setItems] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [tab, setTab] = useState('active');
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [nextItems, nextModels] = await Promise.all([
          cases.getAll(deviceModelId, controller.signal),
          deviceModels.getAll(controller.signal),
        ]);
        if (!controller.signal.aborted) {
          setItems(nextItems);
          setModels(nextModels);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err.response?.data?.data?.message ?? 'Intentá de nuevo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [refreshTrigger, deviceModelId, retry]);

  const normalizedQuery = query.trim().toLocaleLowerCase('es');
  const visibleItems = items.filter((item) => {
    const model = models.find((entry) => entry.id === item.device_model_id);
    const text = `${model?.brand ?? ''} ${model?.name ?? ''} ${item.symptom} ${item.diagnosis} ${item.solution}`;
    return (tab === 'all' || item.status === tab) && text.toLocaleLowerCase('es').includes(normalizedQuery);
  });

  async function toggle(item) {
    setBusyId(item.id);
    setActionError('');
    try {
      const status = item.status === 'active' ? 'archived' : 'active';
      await cases.update(item.id, { status });
      setConfirmId(null);
      onChanged(status === 'archived' ? 'Caso archivado. Podés verlo en Archivados.' : 'Caso restaurado.');
    } catch (err) {
      setActionError(err.response?.data?.data?.message ?? 'No se pudo cambiar el estado. Intentá de nuevo.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="panel-heading mb-4"><span className="module-number">01</span><h2 id="case-list-title">Biblioteca de casos</h2><span className="label ml-auto">{loading || error ? '—' : String(visibleItems.length).padStart(2, '0')}</span></div>
      <div className="filter-panel">
        <div><label htmlFor="case-search">Buscar en la biblioteca</label><input id="case-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Modelo, síntoma o diagnóstico…" /></div>
        <div><label htmlFor="model-filter">Modelo</label><select id="model-filter" value={deviceModelId} onChange={(event) => setSearchParams(event.target.value ? { modelo: event.target.value } : {})}>
          <option value="">Todos los modelos</option>
          {deviceModelId && !models.some((item) => item.id === deviceModelId) ? <option value={deviceModelId}>Modelo no disponible</option> : null}
          {models.map((model) => <option key={model.id} value={model.id}>{model.brand} {model.name}</option>)}
        </select></div>
      </div>
      <div className="status-tabs" role="group" aria-label="Filtrar casos por estado">
        {[['active', 'Activos'], ['archived', 'Archivados'], ['all', 'Todos']].map(([value, label]) => (
          <button type="button" key={value} aria-pressed={tab === value} className={tab === value ? 'selected' : ''} onClick={() => setTab(value)}>{label}</button>
        ))}
      </div>
      {actionError ? <p className="form-error mb-4" role="alert">{actionError}</p> : null}
      <ListState loading={loading} error={error} empty={!visibleItems.length} onRetry={() => setRetry((value) => value + 1)} noun="casos de falla">
        <div className="space-y-4">
          {visibleItems.map((item, index) => {
            const model = models.find((entry) => entry.id === item.device_model_id);
            const locked = busyId !== null;
            const archived = item.status === 'archived';
            return (
              <article key={item.id} className="case-card" aria-label={`Caso: ${item.symptom}`}>
                <header className="card-topline">
                  <span className="label">CASO / {String(index + 1).padStart(2, '0')}</span>
                  <span className={`status-chip ${archived ? '' : 'status-active'}`}>{archived ? 'Archivado' : 'Activo'}</span>
                </header>
                <div className="p-5">
                  <p className="label mb-3 text-on-surface-variant">{model ? `${model.brand} / ${model.name}` : 'Modelo no disponible'}</p>
                  <h3 className="text-xl leading-snug font-medium break-words">{item.symptom}</h3>
                  <dl className="case-details">
                    <div><dt>Diagnóstico</dt><dd>{item.diagnosis || 'Pendiente de diagnóstico.'}</dd></div>
                    {item.solution ? <div><dt>Solución registrada</dt><dd>{item.solution}</dd></div> : null}
                  </dl>
                </div>
                <footer className="card-actions">
                  <button type="button" className="button-secondary" disabled={locked} onClick={() => onEdit(item)}>Editar caso ↗</button>
                  <button type="button" className="button-quiet" disabled={locked} onClick={() => { setConfirmId(item.id); setActionError(''); }}>
                    {archived ? 'Restaurar' : 'Archivar'}
                  </button>
                </footer>
                {confirmId === item.id ? (
                  <div className="confirmation" role="group" aria-label="Confirmar cambio de estado">
                    <p>¿{archived ? 'Restaurar' : 'Archivar'} este caso? {archived ? 'Volverá a Activos.' : 'Se conservará en Archivados.'}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="button-primary" disabled={locked} onClick={() => toggle(item)}>
                        {busyId === item.id ? 'Guardando…' : archived ? 'Confirmar restauración' : 'Confirmar archivo'}
                      </button>
                      <button type="button" className="button-secondary" disabled={locked} onClick={() => setConfirmId(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </ListState>
    </>
  );
}
