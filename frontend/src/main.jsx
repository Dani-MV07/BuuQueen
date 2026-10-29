import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { AccommodationsProvider } from './context/AccommodationsContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccommodationsProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AccommodationsProvider>
    </BrowserRouter>
  </React.StrictMode>
);