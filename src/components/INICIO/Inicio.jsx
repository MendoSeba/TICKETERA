import './style.css';
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
import logo from "../IMG/img23.jpg.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';

const Inicio = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, [user, navigate]);

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#FF9800',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  const loginWithEmail = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No existe una cuenta con este correo electr├│nico');
          break;
        case 'auth/wrong-password':
          setError('Contrase├▒a incorrecta');
          break;
        case 'auth/invalid-email':
          setError('El correo electr├│nico no es v├ílido');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos fallidos. Intenta m├ís tarde');
          break;
        case 'auth/invalid-credential':
          setError('Credenciales inv├ílidas. Verifica tu correo y contrase├▒a');
          break;
        default:
          setError('Error al iniciar sesi├│n: ' + error.message);
      }
    }
  };

  const handleProtectedLink = (e) => {
    if (!user) {
      e.preventDefault();
      setError('Debes iniciar sesión para acceder a esta sección');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      loginWithEmail();
    }
  };

  return (
    <div>
      <section className='section-header'>
        <header className='header_home'>
          <img className='logo' src={logo} alt="Logo" />
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal">
<<<<<<< HEAD
              <li className="titulo2">TICKETERA</li>
              <li><Link className='l-inicial' to="/home" onClick={handleProtectedLink}>HOME</Link></li>
              <li><Link className='l-inicial' to="/precio" onClick={handleProtectedLink}>PRECIO</Link></li>
              <li><Link className='l-inicial' to="/tickets" onClick={handleProtectedLink}>TICKETS</Link></li>
              <li><Link className='l-inicial' to="/lista" onClick={handleProtectedLink}>LISTA</Link></li>
              <li><Link className='l-inicial' to="/perfil" onClick={handleProtectedLink}>PERFIL</Link></li>
            </ul>
            <div className="responsive-menu">
              <ul>
                <li><Link to="/home" onClick={handleProtectedLink}>HOME</Link></li>
                <li><Link to="/precio" onClick={handleProtectedLink}>PRECIO</Link></li>
                <li><Link to="/tickets" onClick={handleProtectedLink}>TICKETS</Link></li>
                <li><Link to="/lista" onClick={handleProtectedLink}>LISTA</Link></li>
                <li><Link to="/perfil" onClick={handleProtectedLink}>PERFIL</Link></li>
=======
              <h2 className='titulo2'> TICKETERA</h2>
              <Link className='l-inicial' to="/home">HOME</Link>
              <Link className='l-inicial' to="/precio">PRECIO</Link>
              <Link className='l-inicial' to="/tickets">TICKETS</Link>
              <Link className='l-inicial' to="/lista">LISTA</Link>
            </ul>
            <div className="responsive-menu">
              <ul>
                <li><Link to="/home">HOME</Link></li>
                <li><Link to="/precio">PRECIO</Link></li>
                <li><Link to="/tickets">TICKETS</Link></li>
                <li><Link to="/lista">LISTA</Link></li>
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
              </ul>
            </div>
          </nav>
        </header>
      </section>

      <section className='section-body' >
        <div className='part1'>
          <h1 className='h1_2'>
            BIENVENIDOS A TICKETERA
          </h1>
          <p className='p_2'>WEB APP PARA LLEVAR UN CONTROL DE TUS GASTOS, TUS TICKETS Y TUS COMPRAS</p>
          <form className='form1' onKeyDown={handleKeyDown}>
            <input className='input-form1'
              type="email"
<<<<<<< HEAD
              placeholder="Correo electrónico"
              autoComplete="email"
=======
              placeholder="Correo electr├│nico"
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <input className='input-form1'
              type="password"
<<<<<<< HEAD
              placeholder="Contraseña"
              autoComplete="current-password"
=======
              placeholder="Contrase├▒a"
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            {error && (
              <div className="error-message" style={{
                color: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            <button className='boton-form1' type="button" onClick={loginWithEmail} disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'INICIAR SESION'}
            </button>
            <p className="crear-cuenta">┬┐No tienes una cuenta? <Link to="/registro">Crea una</Link></p>
            <p className="olvide-contrasena"><Link to="/recuperar-contrasena">┬┐Olvidaste tu contrase├▒a?</Link></p>
          </form>
          {user && !checkingAuth && (
            <p>Bienvenido, {user.displayName || user.email?.split('@')[0]}</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Inicio;
