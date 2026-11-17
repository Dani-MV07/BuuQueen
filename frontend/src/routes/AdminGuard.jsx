import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!isAdmin) {
        return (
            <main className="login-page">
                <section className="login-panel" aria-labelledby="access-denied-title">
                    <h1 id="access-denied-title">Acceso restringido</h1>
                    <p className="login-subtitle">Esta sección está disponible solo para administradores.</p>
                    <button className="button" type="button" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </section>
            </main>
        );
    }

    return <Outlet />;
}
