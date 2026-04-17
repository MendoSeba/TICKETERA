import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>Algo salió mal</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {this.state.error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '25px' }}>
              Si el problema persiste, contacta al soporte técnico
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Recargar página
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
