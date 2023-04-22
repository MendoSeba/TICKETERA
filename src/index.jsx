import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import Ruta from "./routes/Routes.jsx"
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div>
      <Ruta/>
    </div>
  );
};

// Usar createRoot desde react-dom/client para renderizar la aplicación en un elemento del DOM
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

