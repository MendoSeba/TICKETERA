import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from '../components/INICIO/Inicio';
import Login from '../components/LOGIN/Login';
import Home from '../components/HOME/Home';
import Lista from '../components/LISTA/Lista';
import Precio from '../components/PRECIO/Precio';
import Tickets from '../components/TICKETS/Tickets';
import Perfil from '../components/PERFIL/Perfil';
import Stats from '../components/STATS/Stats';
import Layout from '../components/Layout/Layout';
import Error from '../components/404/404';
import ProtectedRoute from '../components/ProtectedRoute';
import ForgotPassword from '../components/RECUPERAR/ForgotPassword';

export function Ruta() {
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />

        {/* LAYOUT PERSISTENTE: Envuelve todas las rutas protegidas */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/home" element={<Home />} />
          <Route path="/lista" element={<Lista />} />
          <Route path="/precio" element={<Precio />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/stats" element={<Stats />} />
        </Route>

        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default Ruta;
