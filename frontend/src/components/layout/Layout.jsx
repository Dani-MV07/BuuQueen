import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { resolveAssetUrl } from '../../services/apiService';

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, logout, refreshMyProfile } = useAuth();
  const categorySectionActive = pathname === '/categories' || /^\/categories\/[^/]+\/edit$/.test(pathname);
  const displayName = user?.name || user?.email || 'Cuenta activa';

  useEffect(() => {
    refreshMyProfile().catch(() => undefined);
  }, [refreshMyProfile]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <NavLink to={isAdmin ? '/accommodations' : '/profile'} className="brand">
          <span className="brand-kicker">BUUQUEEN</span>
          <span className="brand-name">{isAdmin ? 'Admin Dashboard' : 'Mi cuenta'}</span>
        </NavLink>
        <div className="sidebar-section-label">{isAdmin ? 'GESTIÓN' : 'CUENTA'}</div>
        <nav className="sidebar-nav" aria-label="Navegación principal">
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♙</span> Mi perfil
          </NavLink>
          {isAdmin && <NavLink to="/profiles" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♙</span> Perfiles
          </NavLink>}
          {isAdmin && <NavLink to="/accommodations" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">▦</span> Alojamientos
          </NavLink>}
          {isAdmin && <NavLink to="/categories" className={`sidebar-link${categorySectionActive || pathname === '/categories/new' ? ' active' : ''}`}>
            <span aria-hidden="true">◇</span> Categorías
          </NavLink>}
          {isAdmin && <NavLink to="/hosts" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♙</span> Anfitriones
          </NavLink>}
          {isAdmin && <NavLink to="/locations" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">⌖</span> Ubicaciones
          </NavLink>}
          {isAdmin && <NavLink to="/roles" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♧</span> Roles
          </NavLink>}
          {isAdmin && <NavLink to="/users" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">♧</span> Usuarios
          </NavLink>}
          {isAdmin && <NavLink to="/variants" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">◇</span> Variantes
          </NavLink>}
        </nav>
        <div className="sidebar-footer">
          <div className="profile-avatar" aria-hidden="true">
            {profile?.avatar && <img src={resolveAssetUrl(profile.avatar)} alt="" onError={event => { event.currentTarget.hidden = true; }} />}
            <span>{displayName.charAt(0).toUpperCase()}</span>
          </div>
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
