import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <NavLink to="/experiences" className="brand">
          <span className="brand-kicker">BUUQUEEN</span>
          <span className="brand-name">Admin Dashboard</span>
        </NavLink>
        <div className="sidebar-section-label">GESTIÓN</div>
        <nav className="sidebar-nav" aria-label="Navegación principal">
          <NavLink to="/experiences" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">▦</span> Viajes
          </NavLink>
          <NavLink to="/experiences/new" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">＋</span> Crear viaje
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="profile-avatar" aria-hidden="true">B</div>
          <div>
            <strong>Administración</strong>
            <span>Gestión de viajes</span>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <div className="mobile-brand">BUUQUEEN <span>· Administración</span></div>
        <Outlet />
      </main>
    </div>
  );
}