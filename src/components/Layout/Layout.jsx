import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo3 from '../IMG/img23.jpg.jpeg';
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    const loadDisplayName = () => {
      if (user) {
        const storedProfile = localStorage.getItem('userProfile');
        let localName = '';
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile);
            localName = profile.displayName || '';
          } catch (e) {
            console.error('Error parsing profile:', e);
          }
        }
        const newName = user.displayName || localName || '';
        setUserDisplayName(prev => prev !== newName ? newName : prev);
      }
    };

    loadDisplayName();

    const handleProfileUpdate = (e) => {
      const profile = e.detail;
      if (profile && profile.displayName !== undefined) {
        setUserDisplayName(profile.displayName || user?.displayName || '');
      } else {
        loadDisplayName();
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);

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
            <span className="username">{userDisplayName || user?.displayName || ''}</span>
            <button className="btn-danger logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </header>
      </section>
      <section className='layout-section'>
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;
