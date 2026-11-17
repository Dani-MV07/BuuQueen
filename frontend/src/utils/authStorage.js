const AUTH_SESSION_KEY = 'buuqueen.auth.session';

export function readAuthSession() {
    try {
        const session = JSON.parse(window.localStorage.getItem(AUTH_SESSION_KEY));
        return typeof session?.token === 'string' ? session : null;
    } catch {
        return null;
    }
}

export function getAuthToken() {
    return readAuthSession()?.token || null;
}

export function saveAuthSession(session) {
    try {
        window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    } catch {
        return;
    }
}

export function clearAuthSession() {
    try {
        window.localStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
        return;
    }
}