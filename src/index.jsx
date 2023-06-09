import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ruta from "./routes/Routes.jsx";  
import "bootstrap/dist/css/bootstrap.min.css";


const App = () => {
  return (
    <div>
      <Ruta />
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);



