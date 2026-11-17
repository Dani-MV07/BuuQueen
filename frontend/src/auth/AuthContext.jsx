import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/apiService';
import { clearAuthSession, readAuthSession, saveAuthSession } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(readAuthSession);
    const role = session?.user?.role_id;
    const roleName = role?.slug || role?.name || session?.user?.role;
    const isAdmin = typeof roleName === 'string' && roleName.toLowerCase() === 'admin';

    async function login(credentials) {
        const nextSession = await authApi.login(credentials);
        saveAuthSession(nextSession);
        setSession(nextSession);
        return nextSession;
    }

    function logout() {
        const token = session?.token;
        clearAuthSession();
        setSession(null);

        if (token) {
            void authApi.logout(token).catch(() => undefined);
        }
    }

    return (
        <AuthContext.Provider value={{
            session,
            user: session?.user ?? null,
            profile: session?.profile ?? null,
            isAuthenticated: Boolean(session?.token),
            isAdmin,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider.');
    }
    return context;
}