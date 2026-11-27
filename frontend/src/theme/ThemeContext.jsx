import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const ThemeContext = createContext(null);

function getThemeKey(user) {
  const identity = user?._id || user?.id || user?.email || 'guest';
  return `buuqueen.theme.${identity}`;
}

function readTheme(key) {
  try {
    return window.localStorage.getItem(key) === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('No se pudo leer la preferencia de tema.', error);
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const themeKey = getThemeKey(user);
  const [theme, setThemeState] = useState(() => readTheme(themeKey));

  useEffect(() => {
    setThemeState(readTheme(themeKey));
  }, [themeKey]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    if (nextTheme !== 'light' && nextTheme !== 'dark') {
      throw new Error('El tema debe ser claro u oscuro.');
    }

    try {
      window.localStorage.setItem(themeKey, nextTheme);
    } catch (error) {
      console.error('No se pudo guardar la preferencia de tema.', error);
    }
    setThemeState(nextTheme);
  }, [themeKey]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider.');
  }
  return context;
}
