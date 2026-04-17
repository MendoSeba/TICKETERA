import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export const useToast = () => {
  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showInfo = (message) => toast.info(message);
  const showWarning = (message) => toast.warning(message);

  return { showSuccess, showError, showInfo, showWarning };
};

export default ToastProvider;