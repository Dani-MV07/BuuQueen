import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { resolveAssetUrl } from '../../services/apiService';
import BookingHeader from '../../models/booking/components/BookingHeader';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { user, profile, isAdmin, refreshMyProfile } = useAuth();
  const categorySectionActive = pathname === '/categories' || /^\/categories\/[^/]+\/edit$/.test(pathname);
  const displayName = user?.name || user?.email || 'Cuenta activa';

  useEffect(() => {
    refreshMyProfile().catch(() => undefined);
  }, [refreshMyProfile]);

  return (
    <div className="admin-application">
      <BookingHeader />
      <div className="admin-shell">
        <aside className="sidebar">
          <NavLink to="/accommodations" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <img className="brand-icon" src="/buuqueen-icon.png" alt="" />
            </span>
            <span className="brand-copy">
              <span className="brand-kicker">BUUQUEEN</span>
              <span className="brand-name">Admin Dashboard</span>
            </span>
          </NavLink>
          <div className="sidebar-section-label">GESTIÓN</div>
          <nav className="sidebar-nav" aria-label="Navegación de administración">
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <span aria-hidden="true">♙</span> Mi perfil
            </NavLink>
            <NavLink to="/profiles" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <span aria-hidden="true">♙</span> Perfiles
            </NavLink>
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
            <div className="profile-avatar" aria-hidden="true">
              {profile?.avatar && <img src={resolveAssetUrl(profile.avatar)} alt="" onError={event => { event.currentTarget.hidden = true; }} />}
              <span>{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="sidebar-user-copy">
              <strong title={displayName}>{displayName}</strong>
              <span>{user?.role_id?.name || user?.role_id?.slug || 'Sesión activa'}</span>
            </div>
          </div>
        </aside>
        <main className="admin-main">
          <div className="mobile-brand">BUUQUEEN <span>· Administración</span></div>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
