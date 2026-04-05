import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo3 from "../IMG/img23.jpg.jpeg";
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../service/firestoreService';
import './Home.css';

const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDisplayName, setUserDisplayName] = useState('');
  const profileLoaded = useRef(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user && !profileLoaded.current) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile && profile.displayName) {
            setUserDisplayName(profile.displayName);
          } else {
            setUserDisplayName(user.displayName || user?.email?.split('@')[0] || 'Usuario');
          }
          profileLoaded.current = true;
        } catch (e) {
          console.error('Error loading profile:', e);
          setUserDisplayName(user.displayName || user?.email?.split('@')[0] || 'Usuario');
          profileLoaded.current = true;
        }
      }
    };

    loadProfile();
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
    <div className="home-page">
      <section className='section-header'>
        <header className='header_home'>
          <img className='logo3' src={logo3} alt="Logo" />
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal" >
<<<<<<< HEAD
              <li className="titulo2">TICKETERA</li>
              <li><Link className={isActive('/home')} to="/home">HOME</Link></li>
              <li><Link className={isActive('/precio')} to="/precio">PRECIO</Link></li>
              <li><Link className={isActive('/tickets')} to="/tickets">TICKETS</Link></li>
              <li><Link className={isActive('/lista')} to="/lista">LISTA</Link></li>
              <li><Link className={isActive('/perfil')} to="/perfil">PERFIL</Link></li>
=======
              <h2 className='titulo2'> TICKETERA</h2>
              <Link className={isActive('/home')} to="/home">HOME</Link>
              <Link className={isActive('/precio')} to="/precio">PRECIO</Link>
              <Link className={isActive('/tickets')} to="/tickets">TICKETS</Link>
              <Link className={isActive('/lista')} to="/lista">LISTA</Link>
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
            </ul>
          </nav>
          <div className="user-menu">
            <span className="user-name">Bienvenido, <strong>{userDisplayName || user?.email?.split('@')[0] || 'Usuario'}</strong></span>
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
<<<<<<< HEAD
              <Link to="/perfil" className="home-card">
                <div className="card-icon">👤</div>
                <h3>PERFIL</h3>
                <p>Gestiona tu perfil y sugerencias</p>
              </Link>
=======
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
