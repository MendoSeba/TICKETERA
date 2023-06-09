import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from '../components/INICIO/Inicio';
import Login from '../components/LOGIN/Login'; 
import Home from "../components/HOME/Home"
import Lista from "../components/LISTA/Lista"
import Precio from "../components/PRECIO/Precio"
import Tickets from "../components/TICKETS/Tickets"
import Error from "../components/404/404"

export function Ruta() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Inicio />} />
        <Route path="/registro" element={<Login />} /> 
        {/*<Route path="/home" element={<Home />} />*/}
        <Route path="/lista" element={<Lista />} />
        <Route path="/precio" element={<Precio />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/404" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default Ruta;

