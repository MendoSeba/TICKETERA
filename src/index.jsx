import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Ruta from './routes/Routes';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Ruta />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('No se encontró elemento root');
}
