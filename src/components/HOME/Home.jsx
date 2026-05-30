import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import './Home.css';

const Home = () => {
  return (
      <div className="home-app">
        <header className="page-header">
          <h1 className="title-app">¡Bienvenido a TICKETERA!</h1>
          <p className="subtitle-app">Tu aplicación para gestionar gastos, tickets y listas de compras</p>
        </header>

        <div className="home-container">
          <div className="home-welcome">
            <div className="home-cards">
              <Link to="/tickets" className="home-card">
                <div className="card-icon">🎫</div>
                <h3>TICKETS</h3>
                <p>Gestiona tus gastos y tickets</p>
              </Link>
              <Link to="/lista" className="home-card">
                <div className="card-icon">🛒</div>
                <h3>LISTA</h3>
                <p>Crea y descarga listas de compras</p>
              </Link>
              <Link to="/precio" className="home-card">
                <div className="card-icon">💰</div>
                <h3>PRECIO</h3>
                <p>Compara precios en supermercados</p>
              </Link>
              <Link to="/perfil" className="home-card">
                <div className="card-icon">👤</div>
                <h3>PERFIL</h3>
                <p>Gestiona tu perfil y sugerencias</p>
              </Link>
              <Link to="/stats" className="home-card">
                <div className="card-icon">📊</div>
                <h3>ESTADÍSTICAS</h3>
                <p>Analiza tus hábitos de gasto</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;
