import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import logo3 from '../IMG/img23.jpg.jpeg';
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';
import '../ADMOB/AdMob.css';

const Layout = () => {
  const { logout, user, userDisplayName } = useAuth();
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

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const isTabActive = (path) => location.pathname === path ? 'tab-item active' : 'tab-item';

  const isApp = !!window.Capacitor?.platform;

  return (
    <div className={`layout-page ${isApp ? 'is-app' : ''}`}>
      <section className='section-header'>
        <header className='header_home'>
          <div className="header-left">
            <img className='logo3' src={logo3} alt="Logo" />
            <span className="titulo2">TICKETERA</span>
          </div>

          <nav id="nav">
            <ul id="links" className='links-horizontal'>
              <li><Link className={isActive('/home')} to="/home">HOME</Link></li>
              <li><Link className={isActive('/precio')} to="/precio">PRECIO</Link></li>
              <li><Link className={isActive('/tickets')} to="/tickets">TICKETS</Link></li>
              <li><Link className={isActive('/lista')} to="/lista">LISTA</Link></li>
              <li><Link className={isActive('/stats')} to="/stats">ESTADÍSTICAS</Link></li>
              <li><Link className={isActive('/perfil')} to="/perfil">PERFIL</Link></li>
            </ul>
          </nav>

          <div className="user-menu">
            <div className="user-info-header">
              <span className="user-welcome">Hola,</span>
              <span className="user-name-text">{userDisplayName || user?.displayName || user?.email?.split('@')[0] || 'Usuario'}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>Salir</button>
          </div>
        </header>
      </section>

      {isApp && (
        <div className="app-tab-bar">
          <Link to="/home" className={isTabActive('/home')}>🏠<span>Home</span></Link>
          <Link to="/precio" className={isTabActive('/precio')}>💰<span>Precio</span></Link>
          <Link to="/tickets" className={isTabActive('/tickets')}>🎫<span>Tickets</span></Link>
          <Link to="/lista" className={isTabActive('/lista')}>🛒<span>Lista</span></Link>
          <Link to="/stats" className={isTabActive('/stats')}>📊<span>Stats</span></Link>
          <Link to="/perfil" className={isTabActive('/perfil')}>👤<span>Perfil</span></Link>
        </div>
      )}

      <section className='layout-section'>
        <Outlet />
      </section>
      
      {/* AdMob Banner */}
      <div className='admob-banner admob-bottom'>
        <ins
          className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client='ca-pub-7509915300679259'
          data-ad-slot='DIRECT'
          data-ad-format='horizontal'
          data-full-width-responsive='true'
        />
      </div>
      
      {!isApp && <Footer />}
    </div>
  );
};

export default Layout;
