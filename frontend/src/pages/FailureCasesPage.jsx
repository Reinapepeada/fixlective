import { useCallback, useState } from 'react';
import FailureCaseForm from '../components/FailureCaseForm.jsx';
import FailureCaseList from '../components/FailureCaseList.jsx';
import Feedback from '../components/Feedback.jsx';

export default function FailureCasesPage() {
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
    requestAnimationFrame(() => document.getElementById('symptom')?.focus());
  }

  return (
    <>
      <div className="page-heading">
        <div><p className="label mb-3 text-on-surface-variant">Biblioteca técnica / 01</p><h1>Casos de falla<span className="text-secondary">.</span></h1><p className="mt-3 text-on-surface-variant">Síntomas, diagnósticos y soluciones, organizados por modelo.</p></div>
        <a className="button-primary" href="#case-form">+ Registrar caso</a>
      </div>
      <Feedback notice={notice} onDismiss={dismissNotice} />
      <div className="workspace-grid">
        <section className="min-w-0" aria-labelledby="case-list-title">
          <FailureCaseList refreshTrigger={refreshTrigger} onEdit={edit} onChanged={changed} />
        </section>
        <aside className="min-w-0">
          {/* Otra key monta el formulario con los datos del caso elegido (C11). */}
          <FailureCaseForm key={`${editing?.id ?? 'new'}-${formVersion}`} editing={editing}
            onCreated={changed} onUpdated={changed} onCancel={() => setEditing(null)} />
          <div className="aside-note"><span className="label block mb-2">Registro técnico</span><p>Registrá lo que observaste en este equipo. Un caso todavía sin diagnóstico también es un punto de partida.</p></div>
        </aside>
      </div>
    </>
  );
}
