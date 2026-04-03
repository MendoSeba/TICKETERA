import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../FOOTER/Footer';
import './404.css';

function NotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">🔍</div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Página no encontrada</h2>
        <p className="error-message">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="error-actions">
          <Link to="/" className="boton-gradiente error-button">
            Volver al inicio
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;
