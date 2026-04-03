import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo3 from '../IMG/img23.jpg.jpeg';
import listaImg from '../IMG/lista.jpeg';
import './Lista.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2canvas from 'html2canvas';
import Footer from '../FOOTER/Footer';

const Lista = ({ guardarLista }) => {
  const [lista, setLista] = useState([]);
  const [listasGuardadas, setListasGuardadas] = useState([]);
  const productoRef = useRef(null);
  const cantidadRef = useRef(null);
  const opcionesRef = useRef(null);
  const listaImageRef = useRef(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  const limpiarCampos = () => {
    if (productoRef.current) productoRef.current.value = '';
    if (cantidadRef.current) cantidadRef.current.value = '';
    if (opcionesRef.current) opcionesRef.current.selectedIndex = 0;
  };

  const guardarListaEnLocalStorage = () => {
    if (lista.length === 0) {
      alert("No hay productos en la lista para guardar");
      return;
    }
    const listaGuardada = {
      lista: lista,
      fecha: new Date().toLocaleDateString()
    };
    const nuevasListasGuardadas = [...listasGuardadas, listaGuardada];
    localStorage.setItem("listasGuardadas", JSON.stringify(nuevasListasGuardadas));
    setListasGuardadas(nuevasListasGuardadas);
    setLista([]);
    limpiarCampos();
    if (guardarLista) guardarLista();
  };

  const eliminarListaGuardada = (index) => {
    const nuevasListasGuardadas = [...listasGuardadas];
    nuevasListasGuardadas.splice(index, 1);
    localStorage.setItem("listasGuardadas", JSON.stringify(nuevasListasGuardadas));
    setListasGuardadas(nuevasListasGuardadas);
  };

  const eliminarChecks = (index) => {
    const ticketCard = document.querySelector(`[data-index="${index}"]`);
    if (ticketCard) {
      const checkboxes = ticketCard.querySelectorAll('.check');
      checkboxes.forEach(cb => cb.checked = false);
    }
  };

  const agregarProducto = () => {
    const producto = productoRef.current?.value || '';
    const cantidad = cantidadRef.current?.value || '';
    const opciones = opcionesRef.current?.value || '';

    if (producto.trim() === "" || cantidad.trim() === "" || opciones === "") {
      alert("Por favor, rellene todos los campos");
    } else {
      const nuevoProducto = { id: lista.length + 1, producto, cantidad, opciones };
      setLista([...lista, nuevoProducto]);
      limpiarCampos();
    }
  };

  const compartirLista = (listaACompartir) => {
    if (navigator.share) {
      const texto = listaACompartir.map(p => `${p.producto.toUpperCase()} - ${p.cantidad} - ${p.opciones}`).join('\n');
      navigator.share({
        title: 'Mi Lista de Compras',
        text: texto,
      })
        .then(() => console.log('Compartido correctamente.'))
        .catch((error) => console.log('Error al compartir:', error));
    } else {
      console.log('La API Web Share no est├í disponible en este dispositivo.');
    }
  };

  const descargarListaImagen = async () => {
    if (lista.length === 0) {
      alert("No hay productos en la lista para descargar");
      return;
    }

    const element = listaImageRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `lista-compras-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      alert('Error al descargar la imagen');
    }
  };

  useEffect(() => {
    const listasGuardadasJson = localStorage.getItem("listasGuardadas");
    if (listasGuardadasJson) {
      setListasGuardadas(JSON.parse(listasGuardadasJson));
    }
  }, []);

  return (
    <div className="lista-page">
      <section className="section-header">
        <header className="header_home">
          <a className="container">
            <img className="logo3" src={logo3} alt="Logo" />
          </a>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal">
              <h2 className='titulo2'> TICKETERA</h2>
              <Link className={isActive('/home')} to="/home">HOME</Link>
              <Link className={isActive('/precio')} to="/precio">PRECIO</Link>
              <Link className={isActive('/tickets')} to="/tickets">TICKETS</Link>
              <Link className={isActive('/lista')} to="/lista">LISTA</Link>
            </ul>
            <div className="responsive-menu">
              <ul>
                <li><Link to="/home">HOME</Link></li>
                <li><Link to="/precio">PRECIO</Link></li>
                <li><Link to="/tickets">TICKETS</Link></li>
                <li><Link to="/lista">LISTA</Link></li>
              </ul>
            </div>
          </nav>
        </header>
      </section>
      <section className="lista-section">
        <div className='caja-list'>
          <form className='botones-lista'>
            <label htmlFor="producto">PRODUCTO:</label>
            <input ref={productoRef} type="text" id="producto" name="producto" style={{textTransform: 'uppercase'}} />

            <label htmlFor="cantidad">CANTIDAD:</label>
            <input ref={cantidadRef} type="number" id="cantidad" name="cantidad" min="0" max="99" onKeyPress={(event) => {
              const charCode = event.which ? event.which : event.keyCode;
              if (charCode < 48 || charCode > 57) {
                event.preventDefault();
              }
            }} pattern="[0-9]*" />

            <label htmlFor="opciones">OPCIONES:</label>
              <select ref={opcionesRef} id="opciones" name="opciones">
              <option value="" disabled selected>Supermercado</option>
              <option value="Mercadona">Mercadona</option>
              <option value="Carrefour">Carrefour</option>
              <option value="Lidl">Lidl</option>
              <option value="Aldi">Aldi</option>
              <option value="Dia">Dia</option>
              <option value="Consum">Consum</option>
              <option value="Eroski">Eroski</option>
              <option value="Otro">Otro</option>
            </select>

            <button type="button" className="eliminar" onClick={agregarProducto}>AGREGAR PRODUCTOS A LA LISTA</button>
          </form>
          
          <div className="nueva-lista">
            <div className="lista-header">
              <h2 className="titulo-mi-lista">MI LISTA DE COMPRAS:</h2>
              <div className="lista-header-buttons">
                {lista.length > 0 && (
                  <>
                    <button className="boton-descargar" onClick={descargarListaImagen}>
                      DESCARGAR LISTA
                    </button>
                    <button className="eliminar" onClick={guardarListaEnLocalStorage}>GUARDAR</button>
                  </>
                )}
              </div>
            </div>
            
            <div ref={listaImageRef} className="lista-imagen">
              <div className="imagen-header">
                <img src={listaImg} alt="Lista" className="imagen-logo" />
                <div className="imagen-titulo">
                  <h1>MI LISTA DE COMPRAS</h1>
                  <p>Fecha: {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
              <div className="imagen-productos">
                <div className="producto-titulo">
                  <span>PRODUCTO</span>
                  <span>CANT.</span>
                  <span>CATEGOR├ìA</span>
                </div>
                {lista.map((producto, index) => (
                  <div key={producto.id} className={`producto-fila ${index % 2 === 0 ? 'fila-par' : 'fila-impar'}`}>
                    <span className="producto-nombre">{producto.producto.toUpperCase()}</span>
                    <span className="producto-cantidad">{producto.cantidad}</span>
                    <span className="producto-categoria">{producto.opciones}</span>
                  </div>
                ))}
                <div className="producto-total">
                  <span>TOTAL:</span>
                  <span>{lista.length} art├¡culos</span>
                </div>
              </div>
              <div className="imagen-footer">
                <p>Generado por TICKETERA App</p>
              </div>
            </div>

            {lista.map((producto) => (
              <div className="tabla" key={producto.id}>
                <div className="producto">{producto.producto.toUpperCase()}</div>
                <div className="cantidad">{producto.cantidad}</div>
                <div className="precio">{producto.opciones}</div>
                <button
                  className="eliminar"
                  onClick={() => {
                    const nuevaLista = lista.filter((p) => p.id !== producto.id);
                    setLista(nuevaLista);
                  }}
                >
                  ELIMINAR
                </button>
              </div>
            ))}
          </div>

          <div className='mis-listas'>
            <h2 className='titulo-mi-lista'>MIS LISTAS GUARDADAS:</h2>
            {listasGuardadas.map((listaGuardada, index) => (
              <div className='ticket-card' key={index} data-index={index}>
                <div className="ticket-header">
                  <img src={logo3} alt="Logo" className="ticket-logo" />
                  <div className="ticket-info">
                    <span className="ticket-date">­ƒùô´©Å {listaGuardada.fecha}</span>
                    <span className="ticket-items">­ƒôª {listaGuardada.lista.length} art├¡culos</span>
                  </div>
                </div>
                <div className="ticket-body">
                  {listaGuardada.lista.map((producto) => (
                    <div className="ticket-row" key={producto.id}>
                      <input type="checkbox" className="check" id={`check-${index}-${producto.id}`} />
                      <span className="ticket-product">{producto.producto.toUpperCase()}</span>
                      <span className="ticket-qty">x{producto.cantidad}</span>
                      <span className="ticket-store">{producto.opciones}</span>
                    </div>
                  ))}
                </div>
                <div className="ticket-actions">
                  <button className="eliminar3" onClick={() => eliminarChecks(index)}>ELIMINAR CHECKS</button>
                  <button className="eliminar1" onClick={() => {
                    const listaActual = [...lista, ...listaGuardada.lista.map((p, i) => ({...p, id: lista.length + i + 1}))];
                    setLista(listaActual);
                  }}>A├æADIR A ACTUAL</button>
                  <button className='eliminar2' onClick={() => compartirLista(listaGuardada.lista)}>COMPARTIR</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Lista;
