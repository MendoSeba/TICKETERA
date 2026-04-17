import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo3 from '../IMG/img23.jpg.jpeg';
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';
import '../ADMOB/AdMob.css';

const Layout = ({ children }) => {
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

  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  return (
    <div className="layout-page">
      <section className='section-header'>
        <header className='header_home'>
          <img className='logo3' src={logo3} alt="Logo" />
          <nav id="nav" className="">
            <ul id="links" className='links-horizontal' >
              <li className="titulo2">TICKETERA</li>
              <li><Link className={isActive('/home')} to="/home">HOME</Link></li>
              <li><Link className={isActive('/precio')} to="/precio">PRECIO</Link></li>
              <li><Link className={isActive('/tickets')} to="/tickets">TICKETS</Link></li>
              <li><Link className={isActive('/lista')} to="/lista">LISTA</Link></li>
              <li><Link className={isActive('/perfil')} to="/perfil">PERFIL</Link></li>
            </ul>
            <div className="responsive-menu">
              <ul>
                <li><Link to="/home">HOME</Link></li>
                <li><Link to="/precio">PRECIO</Link></li>
                <li><Link to="/tickets">TICKETS</Link></li>
                <li><Link to="/lista">LISTA</Link></li>
                <li><Link to="/perfil">PERFIL</Link></li>
              </ul>
            </div>
          </nav>
          <div className="user-menu">
            <span className="user-name">Bienvenido, <strong>{userDisplayName || user?.email?.split('@')[0] || 'Usuario'}</strong></span>
            <button className="boton-gradiente logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </header>
      </section>
      <section className='layout-section'>
        {children}
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
      
      <Footer />
    </div>
  );
};

export default Layout;
