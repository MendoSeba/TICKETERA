import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import logo3 from '../IMG/img23.jpg.jpeg';
import './Perfil.css';
import Footer from '../FOOTER/Footer';

const Perfil = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [sugerencia, setSugerencia] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        try {
          const profile = JSON.parse(stored);
          setPhone(profile.phone || '');
          setSugerencia(profile.sugerencia || '');
        } catch (e) {
          console.error('Error loading profile:', e);
        }
      }
      setLoading(false);
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    try {
      const profileData = {
        displayName,
        phone,
        email: user.email,
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      showSuccess('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error guardando perfil:', error);
      showError('Error al guardar el perfil');
    }
  };

  const handleEnviarSugerencia = () => {
    if (!sugerencia.trim()) {
      showError('Escribe algo en el campo de sugerencias');
      return;
    }
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
    const subject = encodeURIComponent('Sugerencia/Queja TICKETERA');
    const body = encodeURIComponent(sugerencia + '\n\nEnviado desde TICKETERA App');
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    showSuccess('Abriendo tu cliente de correo...');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <section className='section-header'>
          <header className='header_home'>
            <a className='container'><img className='logo3' src={logo3} alt="Logo" /></a>
            <nav id="nav" className="">
              <ul id="links" className="links-horizontal">
                <h2 className='titulo2'> TICKETERA</h2>
                <Link className={isActive('/home')} to="/home">HOME</Link>
                <Link className={isActive('/precio')} to="/precio">PRECIO</Link>
                <Link className={isActive('/tickets')} to="/tickets">TICKETS</Link>
                <Link className={isActive('/lista')} to="/lista">LISTA</Link>
                <Link className={isActive('/perfil')} to="/perfil">PERFIL</Link>
              </ul>
            </nav>
          </header>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <section className='section-header'>
        <header className='header_home'>
          <a className='container'><img className='logo3' src={logo3} alt="Logo" /></a>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal">
              <h2 className='titulo2'> TICKETERA</h2>
              <Link className={isActive('/home')} to="/home">HOME</Link>
              <Link className={isActive('/precio')} to="/precio">PRECIO</Link>
              <Link className={isActive('/tickets')} to="/tickets">TICKETS</Link>
              <Link className={isActive('/lista')} to="/lista">LISTA</Link>
              <Link className={isActive('/perfil')} to="/perfil">PERFIL</Link>
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
            <span className="user-name">Bienvenido, <strong>{user?.displayName || user?.email?.split('@')[0]}</strong></span>
            <button className="boton-gradiente logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </header>
      </section>
      <section className="perfil-section">
        <div className="perfil-container">
          <div className="perfil-header">
            <div className="perfil-avatar">
              <span>{(displayName || user?.email || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <div className="perfil-title">
              <h2>Mi Perfil</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="perfil-form">
            <div className="form-group">
              <label htmlFor="displayName">Nombre:</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
              />
            </div>

            <button
              className="boton-tickets save-profile-btn"
              onClick={handleSave}
            >
              💾 Guardar
            </button>

            <div className="form-group sugerencia-group">
              <label htmlFor="sugerencia">💡 Sugerencias o Quejas:</label>
              <textarea
                id="sugerencia"
                value={sugerencia}
                onChange={(e) => setSugerencia(e.target.value)}
                placeholder="¿Tienes alguna sugerencia o queja? Cuéntanos..."
                rows={3}
              />
            </div>

            <button
              className="boton-tickets enviar-sugerencia-btn"
              onClick={handleEnviarSugerencia}
            >
              📤 Enviar Sugerencia
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Perfil;
