import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className='home-section'>
        <div className="home-container">
          <div className="home-welcome">
            <h1>¡Bienvenido a TICKETERA!</h1>
            <p className="home-subtitle">Tu aplicación para gestionar gastos, tickets y listas de compras.</p>
            
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
                <p>Gestiona tu perfil</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
