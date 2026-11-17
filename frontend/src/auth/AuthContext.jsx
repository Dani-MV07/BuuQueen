import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/api';
import { clearAuthSession, readAuthSession, saveAuthSession } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(readAuthSession);

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