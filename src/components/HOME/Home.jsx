import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo3 from "../IMG/img23.jpg.jpeg";
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  return (
    <div className="home-page">
      <section className='section-header'>
        <header className='header_home'>
          <a className='container'><img className='logo3' src={logo3} alt="Logo" /></a>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal" >
              <Link className={isActive('/home')} to="/home">HOME</Link>
              <Link className={isActive('/precio')} to="/precio">PRECIO</Link>
              <Link className={isActive('/tickets')} to="/tickets">TICKETS</Link>
              <Link className={isActive('/lista')} to="/lista">LISTA</Link>
            </ul>
          </nav>
          <div className="user-menu">
            <span className="user-name">Bienvenido, <strong>{user?.displayName || user?.email?.split('@')[0]}</strong></span>
            <button className="boton-gradiente logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </header>
      </section>
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
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
