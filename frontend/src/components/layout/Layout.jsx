import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { pathname } = useLocation();
  const categorySectionActive = pathname === '/categories' || /^\/categories\/[^/]+\/edit$/.test(pathname);

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
          <NavLink to="/categories" end className={`sidebar-link${categorySectionActive ? ' active' : ''}`}>
            <span aria-hidden="true">◇</span> Categorías
          </NavLink>
          <NavLink to="/categories/new" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">＋</span> Crear categoría
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="profile-avatar" aria-hidden="true">B</div>
          <div>
            <strong>Administración</strong>
            <span>Gestión del catálogo</span>
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