import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const categorySectionActive = pathname === '/categories' || /^\/categories\/[^/]+\/edit$/.test(pathname);
  const displayName = user?.name || user?.email || 'Cuenta activa';

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <NavLink to="/accommodations" className="brand">
          <span className="brand-kicker">BUUQUEEN</span>
          <span className="brand-name">Admin Dashboard</span>
        </NavLink>
        <div className="sidebar-section-label">GESTIÓN</div>
        <nav className="sidebar-nav" aria-label="Navegación principal">
          <NavLink to="/accommodations" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">▦</span> Alojamientos
          </NavLink>
          <NavLink to="/categories" className={`sidebar-link${categorySectionActive || pathname === '/categories/new' ? ' active' : ''}`}>
            <span aria-hidden="true">◇</span> Categorías
          </NavLink>
          <NavLink to="/hosts" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♙</span> Anfitriones
          </NavLink>
          <NavLink to="/locations" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">⌖</span> Ubicaciones
          </NavLink>
          <NavLink to="/roles" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♧</span> Roles
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♧</span> Usuarios
          </NavLink>
          <NavLink to="/variants" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">◇</span> Variantes
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="profile-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-copy">
            <strong title={displayName}>{displayName}</strong>
            <span>{user?.role_id?.name || user?.role_id?.slug || 'Sesión activa'}</span>
          </div>
          <button className="sidebar-logout" type="button" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <span aria-hidden="true">↪</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="mobile-brand">BUUQUEEN <span>· Administración</span></div>
        <Outlet />
      </main>
    </div>
  );
}