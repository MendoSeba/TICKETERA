import React, { useState } from "react";
import * as firebase from 'firebase/app';
import "firebase/auth";
import logo2 from "../IMG/img23.jpg.jpeg"
import { Link } from 'react-router-dom';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  

  const handleSignup = (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Redirigir al usuario a la página principal
      })
      .catch((error) => {
        setError(error.message);
      });
  };


  return (
    <div>
      <header className='header_home'>
      <a className='container2'><img className='logo3' src={logo2}></img></a>
      <h1 className="titulo">TICKETERA</h1>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal" >
            <Link className="l1" to="/">INICIO</Link>
            </ul>
          </nav>
        </header>
      <div className="body2">
        <form className="form2" onSubmit={handleSignup}>
          <label className="label2">
            Ingresa tu Email:
            <input className="input2"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="label2">
            Ingresa tu Contraseña:
            <input className="input2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="label2">
            Confirma tu Contraseña:
            <input className="input2"
              type="password" 
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
          </label>
          {error && <p>{error}</p>}
          <button className='boton-form2' type="submit">CREAR USUARIO</button>
        </form>
      </div>
      <footer className='section-footer'>
          <p>Número de contacto: +54 637-62-89-25</p>
          <a href="https://github.com/MendoSeba" target="_blank" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZdJREFUSEu1lYExBVEMRe+vABWgAlSAClABKkAFqAAdUMGnAlSADuiACpgzk+zkZ7L735rZzOzs7puXe5P7kryZJrbZxPhqITiUdCBp2x5ierfnRdLDUJBDBADfSNpYkuWnpAtJj9W+PoIrSZcj5bs1ogW3iuA/4A56J+k8MmSCPUnPtuFJEmQnks5s7cPeW/ZG/3vbc2xrR1GuTICe67bx2gj4XZX0nSSLazFrMDZ9byTgUOcBhOiIvsWyrKeW2UKZkqqnCei+JMqwxSjhtyq4mAFgu0FrnMZY9KdPdnCOBGi8YoivkjjwMRYJOuxI8BvQJiGIEZDN2pjwrcpcgS+fADGDfMi0P93ZYjQXY8Wtq8C+Mv2x86D86M7cAw5EL1B5OZCyTHGiSUiTEiUqL1u6mp5wIoDJmKrjO1onT64i/n1UAESZOUjsagfLkvr6Qv9Uw871LKdjCLUaikuHnfs7CQ1DNj7UohSZoMpy8EZDLmRg+FXOToDmnE85VlquTIjIgmyiMUq47cqbzDe2ELT0Qe+eyQn+AIklVhnz1DvpAAAAAElFTkSuQmCC"/></a>
          
          <a href="https://www.linkedin.com/in/sebastian-stallocca-10b40690/" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAOdJREFUSEvllWENwjAQhb8pAAk4AAeAA1AAEnCCBXAACgAHSEACKIC85Eqabg0s1y0h3K82ub5vd++6VnQcVcf69A44A1NnVdKYB420gqdTvKabAzyAg2UvgEFL8Fs3B9gDaxPdAaufA9yTFg1LVyAPriY6MQ8uth8BAsqjGyCPxskHfPRAYjM7FEY3HJI3EleVITbANtq7ALluCRimzQVQe06AWreMvIovqQug1gmgOJoHWncCaPJKsGIV/DFAIxdfNE2OTFRorQlSNOV95UHLP0MtPWtyiQcnNr7/J9Pbmnyviiub4As/E0wZX0UvUwAAAABJRU5ErkJggg=="/></a>
          
          <a href="http://ssdesarrolloweb.000webhostapp.com/" target="_blank">Sitio web de SS Desarrollo Web</a>
        </footer>
    </div>
  );
};

export default Login;
