import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';

export default function BookingHeader() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const displayName = user?.name || user?.email || 'Mi cuenta';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="booking-header">
      <NavLink className="booking-brand" to="/booking">
        <img className="booking-brand-icon" src="/buuqueen-icon.png" alt="" />
        <span className="booking-brand-copy">
          <span>BUUQUEEN</span>
          <strong>Estancias</strong>
        </span>
      </NavLink>
      <nav className="booking-nav" aria-label="Navegación principal">
        <NavLink end to="/booking">Inicio</NavLink>
        <NavLink to="/booking/shop">Alojamientos</NavLink>
        <NavLink to="/profile">Mi cuenta</NavLink>
        {isAdmin && <NavLink className="booking-dashboard-link" to="/accommodations">Dashboard admin</NavLink>}
      </nav>
      <div className="booking-account">
        <span className="booking-account-name" title={displayName}>{displayName}</span>
        <button className="booking-logout" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}
