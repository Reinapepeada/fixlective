import { useCallback, useState } from 'react';
import DeviceModelForm from '../components/DeviceModelForm.jsx';
import DeviceModelList from '../components/DeviceModelList.jsx';
import Feedback from '../components/Feedback.jsx';

export default function DeviceModelsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editing, setEditing] = useState(null);
  const [formVersion, setFormVersion] = useState(0);
  const [notice, setNotice] = useState(null);
  const dismissNotice = useCallback(() => setNotice(null), []);

  function changed(message) {
    setNotice({ type: 'success', message });
    setRefreshTrigger((value) => value + 1);
    setEditing(null);
    setFormVersion((value) => value + 1);
  }

  function edit(item) {
    setEditing(item);
    requestAnimationFrame(() => document.getElementById('brand')?.focus());
  }

  return (
    <>
      <div className="page-heading">
        <div><p className="label mb-3 text-on-surface-variant">Catálogo de equipos / 02</p><h1>Modelos de celulares<span className="text-secondary">.</span></h1><p className="mt-3 text-on-surface-variant">La referencia común para organizar cada caso de falla.</p></div>
        <a className="button-primary" href="#model-form">+ Agregar modelo</a>
      </div>
      <Feedback notice={notice} onDismiss={dismissNotice} />
      <div className="workspace-grid">
        <section className="min-w-0" aria-labelledby="model-list-title">
          <DeviceModelList refreshTrigger={refreshTrigger} onEdit={edit} onChanged={changed} />
        </section>
        <aside className="min-w-0">
          <DeviceModelForm key={`${editing?.id ?? 'new'}-${formVersion}`} editing={editing} onSaved={changed} onCancel={() => setEditing(null)} />
          <div className="aside-note"><span className="label block mb-2">Casos relacionados</span><p>Podés corregir el nombre de un modelo sin perder sus casos. Los modelos con casos asociados se conservan.</p></div>
        </aside>
      </div>
    </>
  );
}
