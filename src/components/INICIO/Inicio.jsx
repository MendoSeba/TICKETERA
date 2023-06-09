import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './style.css'; 
import React, {  useState } from 'react';
import logo from "../IMG/img23.jpg.jpeg"
import { Link } from 'react-router-dom';



const Inicio = () => {
  const [estado, setEstado] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setEstado('Inicio de sesión exitoso');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setEstado('Error: ' + errorMessage);
      });
  };

  const loginWithEmail = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error('Error de inicio de sesión:', error);
      });
  };

  return (
    
    <div>
  <section className='section-header'>
    <header className='header_home'>
      <a className='container'><img className='logo' src={logo}></img></a>
      <nav id="nav" className="">
        <ul id="links" className="links-horizontal">
          <h2 className='titulo2'> TICKETERA</h2>
          <Link className='l-inicial' to="/precio">PRECIO</Link>
          <Link className='l-inicial' to="/tickets">TICKETS</Link>
          <Link className='l-inicial' to="/lista">LISTA</Link>
        </ul>
        <div className="responsive-menu">
          <ul>
            <li><Link to="/precio">PRECIO</Link></li>
            <li><Link to="/tickets">TICKETS</Link></li>
            <li><Link to="/lista">LISTA</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  </section>

      <section className='section-body' >
        <div className='part1'>
          <h1 className='h1_2'>
            BIENVENIDOS A TICKETERA
          </h1>
          <p className='p_2'>WEB APP PARA LLEVAR UN CONTROL DE TUS GASTOS, TUS TICKETS Y TUS COMPRAS</p>
          <form className='form1'>
            <input className='input-form1'
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input className='input-form1'
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='boton-form1' type="button" onClick={loginWithEmail}>
              INICIAR SESION
            </button>
            <p className="crear-cuenta">¿No tienes una cuenta? <Link to="/registro">Crea una</Link></p>
            <p className="olvide-contrasena"><a href="#">¿Olvidaste tu contraseña?</a></p>
          </form>
          {user && (
            <p>Bienvenido, {user.displayName}</p>
          )}
        </div>
        </section>
      <footer className='section-footer'>
          <p>Número de contacto: +54 637-62-89-25</p>
          <a href="https://github.com/MendoSeba" target="_blank" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZdJREFUSEu1lYExBVEMRe+vABWgAlSAClABKkAFqAAdUMGnAlSADuiACpgzk+zkZ7L735rZzOzs7puXe5P7kryZJrbZxPhqITiUdCBp2x5ierfnRdLDUJBDBADfSNpYkuWnpAtJj9W+PoIrSZcj5bs1ogW3iuA/4A56J+k8MmSCPUnPtuFJEmQnks5s7cPeW/ZG/3vbc2xrR1GuTICe67bx2gj4XZX0nSSLazFrMDZ9byTgUOcBhOiIvsWyrKeW2UKZkqqnCei+JMqwxSjhtyq4mAFgu0FrnMZY9KdPdnCOBGi8YoivkjjwMRYJOuxI8BvQJiGIEZDN2pjwrcpcgS+fADGDfMi0P93ZYjQXY8Wtq8C+Mv2x86D86M7cAw5EL1B5OZCyTHGiSUiTEiUqL1u6mp5wIoDJmKrjO1onT64i/n1UAESZOUjsagfLkvr6Qv9Uw871LKdjCLUaikuHnfs7CQ1DNj7UohSZoMpy8EZDLmRg+FXOToDmnE85VlquTIjIgmyiMUq47cqbzDe2ELT0Qe+eyQn+AIklVhnz1DvpAAAAAElFTkSuQmCC"/></a>
          
          <a href="https://www.linkedin.com/in/sebastian-stallocca-10b40690/" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAOdJREFUSEvllWENwjAQhb8pAAk4AAeAA1AAEnCCBXAACgAHSEACKIC85Eqabg0s1y0h3K82ub5vd++6VnQcVcf69A44A1NnVdKYB420gqdTvKabAzyAg2UvgEFL8Fs3B9gDaxPdAaufA9yTFg1LVyAPriY6MQ8uth8BAsqjGyCPxskHfPRAYjM7FEY3HJI3EleVITbANtq7ALluCRimzQVQe06AWreMvIovqQug1gmgOJoHWncCaPJKsGIV/DFAIxdfNE2OTFRorQlSNOV95UHLP0MtPWtyiQcnNr7/J9Pbmnyviiub4As/E0wZX0UvUwAAAABJRU5ErkJggg=="/></a>
          
          <a href="http://ssdesarrolloweb.000webhostapp.com/" target="_blank">Sitio web de SS Desarrollo Web</a>
        </footer>
    </div>  
    
  );
  
};




export default Inicio;
