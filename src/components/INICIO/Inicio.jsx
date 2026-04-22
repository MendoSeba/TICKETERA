import './style.css';
import React, { useState, useEffect } from 'react';
import logo from "../IMG/img23.jpg.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../FOOTER/Footer';
import { useAuth } from '../../context/AuthContext';

const Inicio = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      loginWithEmail();
    }
  };

  return (
    <div>
      <section className='section-header'>
        <header className='header-login'>
          <img className='logo-grande' src={logo} alt="Logo" />
          <h1 className="titulo-grande">TICKETERA</h1>
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
              placeholder="Correo electrónico"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <div style={{ position: 'relative' }}>
              <input className='input-form1'
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                style={{ width: '100%', paddingRight: '45px', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
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
            <p className="crear-cuenta">¿No tienes una cuenta? <Link to="/registro">Crea una</Link></p>
            <p className="olvide-contrasena"><Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link></p>
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
