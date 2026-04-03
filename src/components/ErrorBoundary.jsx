import React from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo);
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="alert alert-danger m-3">
        <h4>Algo salió mal</h4>
        <p>{error?.message || 'Error desconocido'}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Recargar página
        </button>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;