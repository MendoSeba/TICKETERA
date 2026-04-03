import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import { addShoppingList, getShoppingLists, deleteShoppingList } from '../../service/firestoreService';
import logo3 from '../IMG/img23.jpg.jpeg';
import listaImg from '../IMG/lista.jpeg';
import './Lista.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2canvas from 'html2canvas';
import Footer from '../FOOTER/Footer';

const Lista = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [lista, setLista] = useState([]);
  const [listasGuardadas, setListasGuardadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [editProducto, setEditProducto] = useState('');
  const [editCantidad, setEditCantidad] = useState('');
  const [editOpciones, setEditOpciones] = useState('');
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

  useEffect(() => {
    cargarListas();
  }, []);

  const cargarListas = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getShoppingLists(user.uid);
      setListasGuardadas(data);
    } catch (error) {
      console.error('Error cargando listas:', error);
      showError('Error al cargar las listas guardadas');
    } finally {
      setLoading(false);
    }
  };

  const guardarListaEnFirestore = async () => {
    if (lista.length === 0) {
      showError("No hay productos en la lista para guardar");
      return;
    }
    if (!user) return;
    try {
      const listaGuardada = {
        userId: user.uid,
        lista: lista,
        fecha: new Date().toLocaleDateString()
      };
      const added = await addShoppingList(listaGuardada);
      setListasGuardadas(prev => [added, ...prev]);
      setLista([]);
      limpiarCampos();
      showSuccess('Lista guardada correctamente');
    } catch (error) {
      console.error('Error guardando lista:', error);
      showError('Error al guardar la lista');
    }
  };

  const eliminarListaGuardada = async (index, listId) => {
    try {
      if (listId) {
        await deleteShoppingList(listId);
      }
      const nuevasListasGuardadas = [...listasGuardadas];
      nuevasListasGuardadas.splice(index, 1);
      setListasGuardadas(nuevasListasGuardadas);
      showSuccess('Lista eliminada');
    } catch (error) {
      console.error('Error eliminando lista:', error);
      showError('Error al eliminar la lista');
    }
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
      showError("Por favor, rellene todos los campos");
    } else {
      const nuevoProducto = { id: Date.now(), producto, cantidad, opciones };
      setLista([...lista, nuevoProducto]);
      limpiarCampos();
    }
  };

  const eliminarProducto = (id) => {
    const nuevaLista = lista.filter((p) => p.id !== id);
    setLista(nuevaLista);
  };

  const handleEditProducto = (index) => {
    const prod = lista[index];
    setEditandoId(index);
    setEditProducto(prod.producto);
    setEditCantidad(prod.cantidad);
    setEditOpciones(prod.opciones);
  };

  const handleEditProductoSubmit = (index) => {
    const nuevaLista = [...lista];
    nuevaLista[index] = { ...nuevaLista[index], producto: editProducto, cantidad: editCantidad, opciones: editOpciones };
    setLista(nuevaLista);
    setEditandoId(null);
    showSuccess('Producto actualizado');
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
      showError('La API Web Share no está disponible en este dispositivo.');
    }
  };

  const descargarListaImagen = async (listaToDownload, fecha) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '600px';
    tempDiv.style.background = 'white';
    tempDiv.style.padding = '30px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.innerHTML = `
      <div style="display:flex;align-items:center;margin-bottom:25px;padding-bottom:15px;border-bottom:3px solid #FF9800;">
        <div style="font-size:24px;font-weight:bold;color:#FF9800;">TICKETERA</div>
        <div style="margin-left:20px;">
          <h1 style="color:#FF9800;margin:0;font-size:24px;">MI LISTA DE COMPRAS</h1>
          <p style="color:#666;margin:5px 0 0 0;font-size:12px;">Fecha: ${fecha}</p>
        </div>
      </div>
      <div style="border:2px solid #FF9800;border-radius:8px;overflow:hidden;">
        <div style="display:flex;background:linear-gradient(135deg,orange,orangered);color:white;font-weight:bold;padding:12px;font-size:14px;">
          <span style="flex:2;">PRODUCTO</span>
          <span style="flex:0.5;text-align:center;">CANT.</span>
          <span style="flex:1;text-align:center;">CATEGORÍA</span>
        </div>
        ${listaToDownload.map((p, i) => `
          <div style="display:flex;padding:10px 12px;font-size:13px;background:${i % 2 === 0 ? '#fff' : '#f9f9f9'};">
            <span style="flex:2;font-weight:500;">${p.producto.toUpperCase()}</span>
            <span style="flex:0.5;text-align:center;font-weight:bold;color:#FF9800;">${p.cantidad}</span>
            <span style="flex:1;text-align:center;font-size:11px;color:#666;">${p.opciones}</span>
          </div>
        `).join('')}
        <div style="display:flex;justify-content:space-between;background:#333;color:white;padding:12px;font-weight:bold;">
          <span>TOTAL:</span>
          <span>${listaToDownload.length} artículos</span>
        </div>
      </div>
      <div style="text-align:center;margin-top:20px;padding-top:15px;border-top:1px solid #ddd;">
        <p style="color:#999;font-size:11px;margin:0;">Generado por TICKETERA App</p>
      </div>
    `;
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `lista-compras-${fecha.replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showSuccess('Lista descargada como imagen');
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      showError('Error al descargar la imagen');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

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
              <Link className={isActive('/perfil')} to="/perfil">PERFIL</Link>
            </ul>
            <div className="responsive-menu">
              <ul>
                <li><Link to="/home">HOME</Link></li>
                <li><Link to="/precio">PRECIO</Link></li>
                <li><Link to="/tickets">TICKETS</Link></li>
                <li><Link to="/lista">LISTA</Link></li>
                <li><Link to="/perfil">PERFIL</Link></li>
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
                  <button className="eliminar" onClick={guardarListaEnFirestore}>GUARDAR</button>
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
                  <span>CATEGORÍA</span>
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
                  <span>{lista.length} artículos</span>
                </div>
              </div>
              <div className="imagen-footer">
                <p>Generado por TICKETERA App</p>
              </div>
            </div>

            {lista.map((producto, index) => {
              const isEditing = editandoId === index;
              return (
                <div className="tabla" key={producto.id}>
                  {isEditing ? (
                    <>
                      <input type="text" value={editProducto} onChange={(e) => setEditProducto(e.target.value)} className="edit-input" style={{textTransform: 'uppercase'}} />
                      <input type="number" value={editCantidad} onChange={(e) => setEditCantidad(e.target.value)} className="edit-input" />
                      <select value={editOpciones} onChange={(e) => setEditOpciones(e.target.value)} className="edit-input">
                        <option value="Mercadona">Mercadona</option>
                        <option value="Carrefour">Carrefour</option>
                        <option value="Lidl">Lidl</option>
                        <option value="Aldi">Aldi</option>
                        <option value="Dia">Dia</option>
                        <option value="Consum">Consum</option>
                        <option value="Eroski">Eroski</option>
                        <option value="Otro">Otro</option>
                      </select>
                      <div className="edit-actions">
                        <button className="eliminar1" onClick={() => handleEditProductoSubmit(index)}>💾</button>
                        <button className="eliminar2" onClick={() => setEditandoId(null)}>✕</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="producto">{producto.producto.toUpperCase()}</div>
                      <div className="cantidad">{producto.cantidad}</div>
                      <div className="precio">{producto.opciones}</div>
                      <button className="eliminar" onClick={() => eliminarProducto(producto.id)}>ELIMINAR</button>
                      <button className="editar-btn" onClick={() => handleEditProducto(index)}>✏️</button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className='mis-listas'>
            <h2 className='titulo-mi-lista'>MIS LISTAS GUARDADAS:</h2>
            {loading ? (
              <p className="loading-text">Cargando listas...</p>
            ) : listasGuardadas.length === 0 ? (
              <p className="empty-text">No hay listas guardadas aún</p>
            ) : (
              listasGuardadas.map((listaGuardada, index) => (
                <div className='ticket-card' key={listaGuardada.id || index} data-index={index}>
                  <div className="ticket-header">
                    <img src={logo3} alt="Logo" className="ticket-logo" />
                    <div className="ticket-info">
                      <span className="ticket-date">🗓️ {listaGuardada.fecha}</span>
                      <span className="ticket-items">📦 {listaGuardada.lista.length} artículos</span>
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
                      const listaActual = [...lista, ...listaGuardada.lista.map((p, i) => ({...p, id: Date.now() + i}))];
                      setLista(listaActual);
                    }}>AÑADIR A ACTUAL</button>
                    <button className='eliminar2' onClick={() => compartirLista(listaGuardada.lista)}>COMPARTIR</button>
                    <button className='boton-descargar-sm' onClick={() => descargarListaImagen(listaGuardada.lista, listaGuardada.fecha)}>📥 DESCARGAR</button>
                    <button className='eliminar4' onClick={() => eliminarListaGuardada(index, listaGuardada.id)}>ELIMINAR LISTA</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Lista;
