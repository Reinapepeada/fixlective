export default function ListState({ loading, error, empty, onRetry, noun, children }) {
  if (loading) return <div className="list-state" role="status">Cargando {noun}…</div>;
  if (error) return (
    <div className="list-state bg-error-container text-on-error-container" role="alert">
      <h3>No se pudieron cargar los {noun}.</h3>
      <p className="mt-2 mb-4">{error}</p>
      <button type="button" className="button-secondary" onClick={onRetry}>Reintentar</button>
    </div>
  );
  if (empty) return (
    <div className="list-state">
      <span className="label text-on-surface-variant">SIN REGISTROS</span>
      <h3 className="mt-3 text-xl">No hay {noun} para mostrar.</h3>
      <p className="mt-2 text-on-surface-variant">Podés cargar el primero o cambiar los filtros.</p>
    </div>
  );
  return children;
}
