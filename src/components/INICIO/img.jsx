import React, { useEffect, useState } from 'react';
import './img.css'; 
import img1 from '../IMG/img1.jpg.png';
import img2 from '../IMG/img2.jpg.png';
import img3 from '../IMG/img3.jpg.png';
import img4 from '../IMG/img4.jpg.png';
import img5 from '../IMG/img5.jpg.png';
import img6 from '../IMG/img6.jpg.png';



const ImageSlider = () => {
  const imageUrls = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

 
  useEffect(() => {
    // Función para cambiar la imagen cada 20 segundos
    const changeImage = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 20000);

    return () => {
      // Limpiar el intervalo al desmontar el componente
      clearInterval(changeImage);
    };
  }, []);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginWithEmail = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error('Error de inicio de sesión:', error);
      });

  return (
  <div className="slider" style={{ backgroundImage: `url(${imageUrls[currentImageIndex]})` }}>
  <h1 className='h1_2'>
      BIENVENIDOS A TICKETERA
    </h1>
    <p className='p_2'>WEB APP PARA LLEVAR UN CONTROL DE TUS GASTOS, TUS TICKETS Y TUS COMPRAS</p>
    <form>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={loginWithEmail}>
        Iniciar sesión
      </button>
    </form>
  
    {user && (
      <p>Bienvenido, {user.displayName}</p>
    )}
</div>
);
};
}

export default ImageSlider;