import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from '../components/INICIO/Inicio';
import Login from '../components/LOGIN/Login';
import Home from '../components/HOME/Home';
import Lista from '../components/LISTA/Lista';
import Precio from '../components/PRECIO/Precio';
import Tickets from '../components/TICKETS/Tickets';
import Perfil from '../components/PERFIL/Perfil';
import Layout from '../components/Layout/Layout';
import Error from '../components/404/404';
import ProtectedRoute from '../components/ProtectedRoute';
import ForgotPassword from '../components/RECUPERAR/ForgotPassword';

export function Ruta() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Inicio />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout><Home /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/lista" element={
          <ProtectedRoute>
            <Layout><Lista /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/precio" element={
          <ProtectedRoute>
            <Layout><Precio /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/tickets" element={
          <ProtectedRoute>
            <Layout><Tickets /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Layout><Perfil /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default Ruta;
