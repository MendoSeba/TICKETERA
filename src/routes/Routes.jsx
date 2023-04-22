import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa los componentes de React Router
import Inicio from '../components/INICIO/Inicio'

export function Ruta() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Inicio />} /> {/* Configura la ruta para el componente Home */}
      </Routes>
    </Router>
  );
}
export default Ruta;

