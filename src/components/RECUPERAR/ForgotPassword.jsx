import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import logo2 from "../IMG/img23.jpg.jpeg";
import { auth } from "../../service/fireservice";
import "../LOGIN/Login.css";
import Footer from "../FOOTER/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No existe una cuenta con este correo electrónico");
      } else if (err.code === "auth/invalid-email") {
        setError("El correo electrónico no es válido");
      } else {
        setError("Error al enviar el correo de recuperación");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header_home">
        <a className="container2">
          <img className="logo3" src={logo2} alt="Logo" />
        </a>
        <h1 className="titulo">TICKETERA</h1>
        <nav id="nav" className="">
          <ul id="links" className="links-horizontal">
            <Link className="l1" to="/">
              INICIO
            </Link>
          </ul>
          <div className="responsive-menu">
            <ul>
              <li>
                <Link to="/">INICIO</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <div className="body2">
        <div className="registro-container">
          <h2 className="titulo-registro">RECUPERAR CONTRASEÑA</h2>

          {success ? (
            <div className="success-message">
              <p style={{ fontSize: "24px", marginBottom: "10px" }}>✉️</p>
              <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                ¡Correo enviado!
              </p>
              <p style={{ marginTop: "15px", color: "#666" }}>
                Revisa tu bandeja de entrada en:<br />
                <strong>{email}</strong>
              </p>
              <p style={{ marginTop: "15px", color: "#888", fontSize: "14px" }}>
                Revisa también la carpeta de spam.
              </p>
              <Link to="/" className="boton-volver" style={{ marginTop: "20px" }}>
                VOLVER AL LOGIN
              </Link>
            </div>
          ) : (
            <form className="form-registro" onSubmit={handleResetPassword}>
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#666",
                }}
              >
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </p>

              <div className="campo-form">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="correo@ejemplo.com"
                  disabled={loading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="boton-registro"
                disabled={loading}
              >
                {loading ? "ENVIANDO..." : "ENVIAR ENLACE"}
              </button>

              <p className="ya-tengo-cuenta">
                ¿Recordaste tu contraseña? <Link to="/">Inicia sesión</Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
