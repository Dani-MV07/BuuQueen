import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { AccommodationsProvider } from './models/accommodations/context/AccommodationsContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AccommodationsProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AccommodationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);