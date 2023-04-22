import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      // Validar que se haya ingresado un correo electrónico y una contraseña
      if (!email || !password) {
        setError('Por favor ingrese un correo electrónico y una contraseña');
        return;
      }

      // Iniciar sesión con Firebase
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      {error && <p>{error}</p>}
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
