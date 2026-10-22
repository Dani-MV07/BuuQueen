import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ExperiencesProvider } from './context/ExperiencesContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ExperiencesProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ExperiencesProvider>
    </BrowserRouter>
  </React.StrictMode>
);