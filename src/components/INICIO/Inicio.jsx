import './style.css';
import React, { useState } from 'react';
import logo from "../IMG/img23.jpg.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';

const Inicio = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/home', { replace: true });
    return null;
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
          setError('No existe una cuenta con este correo electrónico');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta');
          break;
        case 'auth/invalid-email':
          setError('El correo electrónico no es válido');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos fallidos. Intenta más tarde');
          break;
        case 'auth/invalid-credential':
          setError('Credenciales inválidas. Verifica tu correo y contraseña');
          break;
        default:
          setError('Error al iniciar sesión: ' + error.message);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginWithEmail();
    }
  };

  return (
    <div>
      <section className='section-header'>
        <header className='header_home'>
          <a className='container'><img className='logo' src={logo} alt="Logo" /></a>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal">
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
          <form className='form1' onKeyPress={handleKeyPress}>
            <input className='input-form1'
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <input className='input-form1'
              type="password"
              placeholder="Contraseña"
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
              {loading ? 'CARGANDO...' : 'INICIAR SESION'}
            </button>
            <p className="crear-cuenta">¿No tienes una cuenta? <Link to="/registro">Crea una</Link></p>
            <p className="olvide-contrasena"><Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link></p>
          </form>
          {user && (
            <p>Bienvenido, {user.displayName}</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Inicio;
