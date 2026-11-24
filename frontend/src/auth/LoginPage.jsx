import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const destination = location.state?.from?.pathname || '/accommodations';

    if (isAuthenticated) {
        return <Navigate to={isAdmin ? destination : '/booking'} replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const session = await login({ email, password });
            const role = session?.user?.role_id;
            const roleName = role?.slug || role?.name || session?.user?.role;
            const loggedInAsAdmin = typeof roleName === 'string' && roleName.toLowerCase() === 'admin';
            navigate(loggedInAsAdmin ? destination : '/booking', { replace: true });
        } catch (loginError) {
            setError(loginError.message || 'No se pudo iniciar sesión.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-panel" aria-labelledby="login-title">
                <header className="login-brand">
                    <span className="login-mark" aria-hidden="true">B</span>
                    <span><strong>BUUQUEEN</strong><small>ALOJAMIENTOS Y ESTANCIAS</small></span>
                </header>
                <p className="login-eyebrow">ACCESO DE CUENTA</p>
                <h1 id="login-title">Bienvenido de nuevo</h1>
                <p className="login-subtitle">Inicia sesión para continuar con tu cuenta.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Correo electrónico
                        <input
                            type="email"
                            name="email"
                            autoComplete="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </label>
                    <label>
                        Contraseña
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>
                    {error && <p className="login-error" role="alert">{error}</p>}
                    <button className="button login-submit" type="submit" disabled={submitting}>
                        {submitting ? 'Validando…' : 'Iniciar sesión'}
                        {!submitting && <span aria-hidden="true">→</span>}
                    </button>
                </form>
                <footer className="login-footer">BUUQUEEN <span>·</span> Tu próxima estancia empieza aquí</footer>
            </section>
        </main>
    );
}
