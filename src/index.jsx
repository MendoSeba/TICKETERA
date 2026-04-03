import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import Ruta from './routes/Routes';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <Ruta />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('No se encontró elemento root');
}


