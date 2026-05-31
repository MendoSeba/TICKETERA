import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap global para evitar saltos
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { seedGlobalPrices } from './service/seedPrices';
import Ruta from './routes/Routes';
import './styles/global.css';

const AppRoot = () => {
  useEffect(() => {
    // Poblamos la base de datos con precios reales de referencia al iniciar
    seedGlobalPrices().then(success => {
      if (success) console.log("Base de datos de precios sincronizada.");
    });
  }, []);

  return (
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
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<AppRoot />);
} else {
  console.error('No se encontró elemento root');
}
