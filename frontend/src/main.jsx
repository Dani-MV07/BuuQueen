import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { AccommodationsProvider } from './models/accommodations/context/AccommodationsContext';
import { ThemeProvider } from './theme/ThemeContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AccommodationsProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AccommodationsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);