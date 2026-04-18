import React, { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => location.pathname === path ? 'menu-item active' : 'menu-item';

  const menuItems = [
    { path: '/home', label: '🏠 HOME' },
    { path: '/precio', label: '💰 PRECIO' },
    { path: '/tickets', label: '🧾 TICKETS' },
    { path: '/lista', label: '🛒 LISTA' },
    { path: '/perfil', label: '👤 PERFIL' },
  ];

  const currentPage = menuItems.find(item => item.path === location.pathname)?.label || 'MENU';

  return (
    <div className="layout-page">
      {/* Header profesional */}
      <header className='header-app'>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div className="header-brand">
          <img className='logo-mini' src={logo3} alt="Logo" />
          <span className="header-title">TICKETERA</span>
        </div>
        
        <div className="header-user">
          <span className="user-badge">
            {userDisplayName || user?.email?.split('@')[0] || 'U'}
          </span>
        </div>
      </header>

      {/* Menú desplegable estilo app nativa */}
      <div className={`slide-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <img className='menu-logo' src={logo3} alt="Logo" />
          <h3>TICKETERA</h3>
          <p>{user?.email || 'Usuario'}</p>
        </div>
        
        <nav className="menu-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button className="menu-item logout" onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Overlay cuando el menú está abierto */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Contenido principal */}
      <main className='layout-content'>
        <div className="page-indicator">
          <span>{currentPage}</span>
        </div>
        {children}
      </main>
      
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