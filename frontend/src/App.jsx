import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import FailureCasesPage from './pages/FailureCasesPage.jsx';
import DeviceModelsPage from './pages/DeviceModelsPage.jsx';
import fixlectiveWordmark from './assets/brand/fixlective-wordmark.png';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Ir al contenido</a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/casos" className="brand" aria-label="Fixlective, inicio">
            <img src={fixlectiveWordmark} alt="Fixlective" width="2172" height="724" />
          </Link>
          <span className="label hidden sm:block text-on-surface-variant">Inteligencia colectiva / Fallas técnicas</span>
          <span className="practice-tag">Datos de práctica</span>
        </div>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/casos"><span className="label">01 /</span> Casos de falla</NavLink>
          <NavLink to="/modelos"><span className="label">02 /</span> Modelos de celulares</NavLink>
        </nav>
      </header>
      <main id="main-content" className="site-main">
        <Routes>
          <Route path="/" element={<Navigate to="/casos" replace />} />
          <Route path="/casos" element={<FailureCasesPage />} />
          <Route path="/modelos" element={<DeviceModelsPage />} />
          <Route path="*" element={<div className="list-state"><h1>Esta página no existe.</h1><Link className="button-primary mt-6" to="/casos">Volver a los casos</Link></div>} />
        </Routes>
      </main>
      <footer className="site-footer"><span className="label">FIXLECTIVE / Biblioteca de fallas</span><p>Entorno de práctica: los datos se reinician al reiniciar el servidor.</p></footer>
    </>
  );
}
