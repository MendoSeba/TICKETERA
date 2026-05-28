import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './AppStatusBanner.css';

const APP_VERSION = "2.0.0"; // Versión actual de esta compilación
const REMOTE_VERSION_URL = "https://raw.githubusercontent.com/tu-usuario/tu-repo/main/version.json"; // Ejemplo

const AppStatusBanner = () => {
  const [status, setStatus] = useState('hidden'); // 'hidden', 'download', 'update'
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) {
      // Estamos en la web, sugerir descarga
      setStatus('download');
    } else {
      // Estamos en la app nativa, verificar actualizaciones
      checkUpdates();
    }
  }, [isNative]);

  const checkUpdates = async () => {
    try {
      // Aquí podrías hacer un fetch a una API o a un documento de Firestore
      // Por ahora simularemos que la versión remota es 2.1.0 para probar
      const latestVersion = "2.1.0";

      if (latestVersion !== APP_VERSION) {
        setStatus('update');
      }
    } catch (e) {
      console.error("Error verificando actualización");
    }
  };

  const handleDownload = () => {
    if (isNative) {
      Haptics.impact({ style: ImpactStyle.Medium });
    }
    const link = document.createElement('a');
    link.href = `/TICKETERA.zip?_v=${Date.now()}`;
    link.download = 'TICKETERA.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'hidden') return null;

  return (
    <div className={`app-status-banner ${status}`}>
      <div className="banner-content">
        <div className="banner-icon">
          {status === 'download' ? '📱' : '🚀'}
        </div>
        <div className="banner-text">
          {status === 'download' ? (
            <>
              <strong>Instala la App Nativa</strong>
              <span>Mejor rendimiento y notificaciones</span>
            </>
          ) : (
            <>
              <strong>¡Nueva versión disponible!</strong>
              <span>Actualiza para nuevas funciones</span>
            </>
          )}
        </div>
        <button className="banner-action-btn" onClick={handleDownload}>
          {status === 'download' ? 'DESCARGAR' : 'ACTUALIZAR'}
        </button>
      </div>
    </div>
  );
};

export default AppStatusBanner;
