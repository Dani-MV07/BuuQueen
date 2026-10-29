import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <NavLink to="/accommodations" className="brand">
          <span className="brand-kicker">BUUQUEEN</span>
          <span className="brand-name">Admin Dashboard</span>
        </NavLink>
        <div className="sidebar-section-label">GESTIÓN</div>
        <nav className="sidebar-nav" aria-label="Navegación principal">
          <NavLink to="/accommodations" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">▦</span> Alojamientos
          </NavLink>
          <NavLink to="/accommodations/new" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">＋</span> Crear alojamiento
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="profile-avatar" aria-hidden="true">B</div>
          <div>
            <strong>Administración</strong>
            <span>Gestión de alojamientos</span>
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