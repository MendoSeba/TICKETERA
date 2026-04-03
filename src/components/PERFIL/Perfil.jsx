import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import { addSugerencia, getUserProfile, saveUserProfile } from '../../service/firestoreService';
import './Perfil.css';
import Layout from '../Layout/Layout';

const Perfil = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [sugerencia, setSugerencia] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setDisplayName(profile.displayName || user.displayName || '');
          setPhone(profile.phone || '');
        } else {
          setDisplayName(user.displayName || '');
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        setDisplayName(user.displayName || '');
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const profileData = {
        displayName,
        phone,
        email: user.email,
      };
      await saveUserProfile(user.uid, profileData);
      showSuccess('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error guardando perfil:', error);
      showError('Error al guardar el perfil');
    }
  };

  const handleEnviarSugerencia = async () => {
    if (!sugerencia.trim()) {
      showError('Escribe algo en el campo de sugerencias');
      return;
    }

    setEnviando(true);

    try {
      await addSugerencia({
        nombre: displayName || user?.email || 'Usuario',
        email: user?.email || '',
        telefono: phone || '',
        mensaje: sugerencia,
        userId: user?.uid
      });
      showSuccess('Sugerencia enviada correctamente');
      setSugerencia('');
    } catch (error) {
      console.error('Error enviando sugerencia:', error);
      showError('Error al enviar la sugerencia');
      setSugerencia('');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="perfil-container">
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : '📤 Enviar Sugerencia'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
