import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "../IMG/img23.jpg.jpeg";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";
import Footer from "../FOOTER/Footer";

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('Por favor, ingresa tu nombre de usuario');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, nombre.trim());
      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este correo electrónico ya está registrado');
          break;
        case 'auth/invalid-email':
          setError('El correo electrónico no es válido');
          break;
        case 'auth/weak-password':
          setError('La contraseña es muy débil');
          break;
        default:
          setError('Error al crear la cuenta: ' + err.message);
      }
    }
  };

  return (
    <div>
      <header className='header-login'>
        <img className='logo-grande' src={logo2} alt="Logo" />
        <h1 className="titulo-grande">TICKETERA</h1>
      </header>
      <div className="body2">
        {success ? (
          <div className="registro-container">
            <div className="success-container">
              <div className="success-checkmark">
                <svg viewBox="0 0 100 100">
                  <circle className="checkmark-circle" cx="50" cy="50" r="46" fill="none" stroke="#4CAF50" strokeWidth="4"/>
                  <path className="checkmark-check" fill="none" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M30 50 L45 65 L70 35"/>
                </svg>
              </div>
              <h2 className="success-title">¡Cuenta creada exitosamente!</h2>
              <p className="success-message">Redirigiendo a tu perfil...</p>
              <div className="success-loader">
                <div className="loader-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="registro-container">
            <h2 className="titulo-registro">CREAR CUENTA</h2>
            <form className="form-registro" onSubmit={handleRegister}>
              <div className="campo-form">
                <label htmlFor="nombre">Nombre de usuario</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError('');
                  }}
                  placeholder="Tu nombre"
                  disabled={loading}
                />
              </div>

              <div className="campo-form">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="correo@ejemplo.com"
                  disabled={loading}
                />
              </div>

              <div className="campo-form">
                <label htmlFor="password">Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
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
              </div>

              <div className="campo-form">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Repite la contraseña"
                    disabled={loading}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button type="submit" className="boton-registro" disabled={loading}>
                {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
              </button>

              <p className="ya-tengo-cuenta">
                ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
              </p>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
