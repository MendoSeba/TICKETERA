import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import './Perfil.css';

const Perfil = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [sugerencia, setSugerencia] = useState('');
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          if (isMounted.current) {
            setDisplayName(user.displayName || profile.displayName || '');
            setPhone(profile.phone || '');
            setSugerencia(profile.sugerencia || '');
          }
        } catch (e) {
          console.error('Error loading profile:', e);
          if (isMounted.current) {
            setDisplayName(user.displayName || '');
          }
        }
      } else {
        if (isMounted.current) {
          setDisplayName(user.displayName || '');
        }
      }
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    try {
      const profileData = {
        displayName,
        phone,
        email: user.email,
        lastUpdated: Date.now()
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      const event = new CustomEvent('profileUpdated', { detail: { displayName, phone } });
      window.dispatchEvent(event);
      
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

  if (loading) {
    return <div className="perfil-page"></div>;
  }

  return (
    <div className="perfil-page">
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
              className="btn-primary"
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
              className="btn-primary"
              onClick={handleEnviarSugerencia}
            >
              📤 Enviar Sugerencia
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
