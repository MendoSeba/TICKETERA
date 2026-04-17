import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [showModal, setShowModal] = useState(null);

  const openModal = (type) => setShowModal(type);
  const closeModal = () => setShowModal(null);

  const handleDownloadApp = () => {
    const link = document.createElement('a');
    link.href = '/tiketera.bin';
    link.download = 'tiketera.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <footer className='section-footer'>
        <div className="footer-content">
          <button 
            onClick={handleDownloadApp}
            style={{
              background: 'linear-gradient(135deg, #ff6b00, #ff9800)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)'
            }}
          >
            📥 DESCARGAR APP
          </button>
          
          <p className="footer-contact">Número de contacto: +54 637-62-89-25</p>
          
          <div className="footer-social">
            <a href="https://github.com/MendoSeba" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            
            <a href="https://www.linkedin.com/in/sebastian-stallocca-10b40690/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          <div className="footer-links">
            <button onClick={() => openModal('privacy')} className="footer-link">
              Política de Privacidad
            </button>
            <span className="footer-separator">|</span>
            <button onClick={() => openModal('terms')} className="footer-link">
              Términos y Condiciones
            </button>
            <span className="footer-separator">|</span>
            <button onClick={() => openModal('cookies')} className="footer-link">
              Cookies
            </button>
            <span className="footer-separator">|</span>
            <button onClick={() => openModal('legal')} className="footer-link">
              Aviso Legal
            </button>
          </div>
          
          <p className="footer-copyright">
            © {new Date().getFullYear()} TICKETERA - SS Desarrollo Web. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            
            {showModal === 'privacy' && (
              <>
                <h2>Política de Privacidad</h2>
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <h3>1. Información que recopilamos</h3>
                <p>Recopilamos la siguiente información:</p>
                <ul>
                  <li>Datos de registro (nombre de usuario, correo electrónico)</li>
                  <li>Datos de uso de la aplicación</li>
                  <li>Información almacenada en localStorage del navegador</li>
                </ul>
                <h3>2. Uso de la información</h3>
                <p>Utilizamos la información recopilada para:</p>
                <ul>
                  <li>Proporcionar y mantener nuestros servicios</li>
                  <li>Autenticación de usuarios</li>
                  <li>Mejorar la experiencia del usuario</li>
                </ul>
                <h3>3. Protección de datos</h3>
                <p>Implementamos medidas de seguridad apropiadas para proteger su información personal.</p>
                <h3>4. Sus derechos</h3>
                <p>Usted tiene derecho a acceder, rectificar o eliminar sus datos personales.</p>
              </>
            )}

            {showModal === 'terms' && (
              <>
                <h2>Términos y Condiciones</h2>
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <h3>1. Aceptación de los términos</h3>
                <p>Al utilizar TICKETERA, usted acepta estos términos y condiciones en su totalidad.</p>
                <h3>2. Descripción del servicio</h3>
                <p>TICKETERA es una aplicación web para la gestión de tickets, gastos y listas de compras.</p>
                <h3>3. Uso aceptable</h3>
                <p>Usted se compromete a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos.</p>
                <h3>4. Limitación de responsabilidad</h3>
                <p>No nos hacemos responsables de cualquier pérdida o daño derivado del uso de esta aplicación.</p>
              </>
            )}

            {showModal === 'cookies' && (
              <>
                <h2>Política de Cookies</h2>
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <h3>1. ¿Qué son las cookies?</h3>
                <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.</p>
                <h3>2. Cookies que utilizamos</h3>
                <ul>
                  <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
                  <li><strong>Cookies de autenticación:</strong> Para identificar usuarios registrados</li>
                  <li><strong>Cookies de preferencias:</strong> Para recordar sus configuraciones</li>
                </ul>
                <h3>3. Gestión de cookies</h3>
                <p>Puede configurar su navegador para bloquear cookies, aunque esto puede afectar la funcionalidad del sitio.</p>
              </>
            )}

            {showModal === 'legal' && (
              <>
                <h2>Aviso Legal</h2>
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <h3>1. Información del titular</h3>
                <p><strong>Denominación social:</strong> SS Desarrollo Web</p>
                <p><strong>Contacto:</strong> +54 637-62-89-25</p>
                <p><strong>Web:</strong> ssdesarrolloweb.000webhostapp.com</p>
                <h3>2. Objeto</h3>
                <p>El presente aviso legal regula el uso del sitio web TICKETERA.</p>
                <h3>3. Propiedad intelectual</h3>
                <p>Todos los derechos de propiedad intelectual del contenido de este sitio pertenecen a SS Desarrollo Web.</p>
                <h3>4. Legislación aplicable</h3>
                <p>Este aviso legal se rige por la legislación española vigente.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
