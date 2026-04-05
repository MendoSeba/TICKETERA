<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
﻿import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
import logo3 from '../IMG/img23.jpg.jpeg';
import listaImg from '../IMG/lista.jpeg';
import './Lista.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2canvas from 'html2canvas';
import Layout from '../Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import { getShoppingLists, addShoppingList, deleteShoppingList } from '../../service/firestoreService';

const Lista = () => {
  const { showSuccess, showError } = useToast();
  const [lista, setLista] = useState([]);
  const [listasGuardadas, setListasGuardadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const productoRef = useRef(null);
  const cantidadRef = useRef(null);
  const opcionesRef = useRef(null);
  const listaImageRef = useRef(null);
  const { user } = useAuth();
  const listaRefs = useRef({});

  useEffect(() => {
    const loadLogo = () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setLogoDataUrl(canvas.toDataURL('image/png'));
      };
      img.src = logo3;
    };
    loadLogo();
  }, []);

  const toggleChecked = (listaIndex, productoId) => {
    const key = `${listaIndex}-${productoId}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearChecksForList = (listaIndex) => {
    const keysToRemove = Object.keys(checkedItems).filter(key => key.startsWith(`${listaIndex}-`));
    const newChecked = { ...checkedItems };
    keysToRemove.forEach(key => delete newChecked[key]);
    setCheckedItems(newChecked);
  };

  const getCheckedCountForList = (listaIndex) => {
    return Object.keys(checkedItems).filter(key => key.startsWith(`${listaIndex}-`) && checkedItems[key]).length;
  };

  const limpiarCampos = () => {
    if (productoRef.current) productoRef.current.value = '';
    if (cantidadRef.current) cantidadRef.current.value = '';
    if (opcionesRef.current) opcionesRef.current.selectedIndex = 0;
  };

  const guardarListaEnLocalStorage = async () => {
    if (lista.length === 0) {
      showError("No hay productos en la lista para guardar");
      return;
    }
    if (!user) {
      showError("Debes iniciar sesión para guardar listas");
      return;
    }

    const listaGuardada = {
      lista: lista,
      fecha: new Date().toLocaleDateString(),
      userId: user.uid,
      nombre: `Lista ${new Date().toLocaleDateString('es-ES')}`
    };

    try {
      const listaGuardadaFirebase = await addShoppingList(listaGuardada, user.uid);
      setListasGuardadas(prev => [{ ...listaGuardada, id: listaGuardadaFirebase.id }, ...prev]);
      setLista([]);
      limpiarCampos();
      showSuccess("Lista guardada correctamente");
    } catch (error) {
      console.error('Error al guardar la lista:', error);
      showError("Error al guardar la lista: " + error.message);
    }
  };

  const eliminarListaGuardada = async (id) => {
    try {
      await deleteShoppingList(id, user.uid);
      setListasGuardadas(prev => {
        const deletedList = prev.find(l => l.id === id);
        if (deletedList) {
          const listIndex = prev.indexOf(deletedList);
          const newRefs = { ...listaRefs.current };
          delete newRefs[listIndex];
          listaRefs.current = newRefs;
        }
        return prev.filter(l => l.id !== id);
      });
    } catch (error) {
      console.error('Error al eliminar la lista:', error);
    }
  };

  const descargarListaGuardada = async (listaGuardada, index) => {
    const container = document.createElement('div');
    container.style.cssText = `
      width: 400px;
      padding: 30px;
      background: white;
      font-family: Arial, sans-serif;
      position: fixed;
      left: -9999px;
      top: 0;
    `;

    const productosOrdenados = listaGuardada.lista
      .slice()
      .sort((a, b) => (a.opciones || '').localeCompare(b.opciones || ''));

    let productosHTML = '';
    productosOrdenados.forEach((producto) => {
      const key = `${index}-${producto.id}`;
      const checked = checkedItems[key];
      productosHTML += `
        <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; ${checked ? 'background: #e8f5e9; text-decoration: line-through; opacity: 0.7;' : ''}">
          <div style="width: 20px; height: 20px; border: 2px solid ${checked ? '#4CAF50' : '#ccc'}; border-radius: 4px; margin-right: 12px; ${checked ? 'background: #4CAF50;' : ''}">
            ${checked ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
          </div>
          <div style="flex: 1; font-size: 14px; font-weight: 600; color: #333;">${producto.producto.toUpperCase()}</div>
          <div style="width: 60px; text-align: center; font-weight: bold; color: #FF9800;">x${producto.cantidad}</div>
          <div style="width: 100px; text-align: right; font-size: 11px; color: #666; background: #f5f5f5; padding: 4px 8px; border-radius: 10px;">${producto.opciones}</div>
        </div>
      `;
    });

    const checkedCount = Object.keys(checkedItems).filter(k => k.startsWith(`${index}-`) && checkedItems[k]).length;

    const logoImg = logoDataUrl 
      ? `<img src="${logoDataUrl}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #ddd;">`
      : `<div style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #ddd; background: #f5f5f5;"></div>`;

    container.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #FF9800;">
        ${logoImg}
        <div>
          <h1 style="color: #FF9800; margin: 0; font-size: 24px; font-weight: bold;">TICKETERA</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 12px;">Mi Lista de Compras</p>
        </div>
      </div>
      <div style="background: linear-gradient(135deg, #f5f5f5, #eee); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <div style="font-size: 14px; color: #333; font-weight: 600;">Fecha: ${listaGuardada.fecha}</div>
        <div style="font-size: 12px; color: #666;">Total: ${listaGuardada.lista.length} artículos</div>
        ${checkedCount > 0 ? `<div style="font-size: 12px; color: #4CAF50; font-weight: 600; margin-top: 5px;">✓ ${checkedCount} comprados</div>` : ''}
      </div>
      <div style="border: 2px solid #FF9800; border-radius: 8px; overflow: hidden;">
        <div style="display: flex; background: linear-gradient(135deg, orange, orangered); color: white; padding: 12px; font-size: 12px; font-weight: bold;">
          <div style="flex: 2;">PRODUCTO</div>
          <div style="width: 60px; text-align: center;">CANT.</div>
          <div style="width: 100px; text-align: right;">SUPERMERCADO</div>
        </div>
        ${productosHTML}
      </div>
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 11px; margin: 0;">Generado por TICKETERA App</p>
      </div>
    `;

    if (!logoDataUrl) {
      showError('El logo aún está cargando, espera un momento e intenta de nuevo');
      return;
    }

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `lista-compras-${listaGuardada.fecha || new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      showError('Error al descargar la imagen');
    } finally {
      document.body.removeChild(container);
    }
  };

  const agregarProducto = () => {
    const producto = productoRef.current?.value || '';
    const cantidad = cantidadRef.current?.value || '';
    const opciones = opcionesRef.current?.value || '';

    if (producto.trim() === "" || cantidad.trim() === "" || opciones === "") {
      showError("Por favor, rellene todos los campos");
    } else {
      const nuevoProducto = { id: lista.length + 1, producto, cantidad, opciones };
      setLista([...lista, nuevoProducto]);
      limpiarCampos();
    }
  };

<<<<<<< HEAD
  const compartirLista = async (listaGuardada, index) => {
    if (!logoDataUrl) {
      showError('El logo aún está cargando, espera un momento');
      return;
    }

    const container = document.createElement('div');
    container.style.cssText = `
      width: 400px;
      padding: 30px;
      background: white;
      font-family: Arial, sans-serif;
      position: fixed;
      left: -9999px;
      top: 0;
    `;

    const productosOrdenados = listaGuardada.lista
      .slice()
      .sort((a, b) => (a.opciones || '').localeCompare(b.opciones || ''));

    let productosHTML = '';
    productosOrdenados.forEach((producto) => {
      const key = `${index}-${producto.id}`;
      const checked = checkedItems[key];
      productosHTML += `
        <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; ${checked ? 'background: #e8f5e9; text-decoration: line-through; opacity: 0.7;' : ''}">
          <div style="width: 20px; height: 20px; border: 2px solid ${checked ? '#4CAF50' : '#ccc'}; border-radius: 4px; margin-right: 12px; ${checked ? 'background: #4CAF50;' : ''}">
            ${checked ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
          </div>
          <div style="flex: 1; font-size: 14px; font-weight: 600; color: #333;">${producto.producto.toUpperCase()}</div>
          <div style="width: 60px; text-align: center; font-weight: bold; color: #FF9800;">x${producto.cantidad}</div>
          <div style="width: 100px; text-align: right; font-size: 11px; color: #666; background: #f5f5f5; padding: 4px 8px; border-radius: 10px;">${producto.opciones}</div>
        </div>
      `;
    });

    const checkedCount = Object.keys(checkedItems).filter(k => k.startsWith(`${index}-`) && checkedItems[k]).length;

    const logoImg = logoDataUrl 
      ? `<img src="${logoDataUrl}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #ddd;">`
      : `<div style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #ddd; background: #f5f5f5;"></div>`;

    container.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #FF9800;">
        ${logoImg}
        <div>
          <h1 style="color: #FF9800; margin: 0; font-size: 24px; font-weight: bold;">TICKETERA</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 12px;">Mi Lista de Compras</p>
        </div>
      </div>
      <div style="background: linear-gradient(135deg, #f5f5f5, #eee); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <div style="font-size: 14px; color: #333; font-weight: 600;">Fecha: ${listaGuardada.fecha}</div>
        <div style="font-size: 12px; color: #666;">Total: ${listaGuardada.lista.length} artículos</div>
        ${checkedCount > 0 ? `<div style="font-size: 12px; color: #4CAF50; font-weight: 600; margin-top: 5px;">✓ ${checkedCount} comprados</div>` : ''}
      </div>
      <div style="border: 2px solid #FF9800; border-radius: 8px; overflow: hidden;">
        <div style="display: flex; background: linear-gradient(135deg, orange, orangered); color: white; padding: 12px; font-size: 12px; font-weight: bold;">
          <div style="flex: 2;">PRODUCTO</div>
          <div style="width: 60px; text-align: center;">CANT.</div>
          <div style="width: 100px; text-align: right;">SUPERMERCADO</div>
        </div>
        ${productosHTML}
      </div>
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 11px; margin: 0;">Generado por TICKETERA App</p>
      </div>
    `;

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `lista-compras-${listaGuardada.fecha || new Date().toISOString().split('T')[0]}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Mi Lista de Compras - TICKETERA',
            text: `Mi lista de compras del ${listaGuardada.fecha} - ${listaGuardada.lista.length} artículos`,
            files: [file]
          });
        } else {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `lista-compras-${listaGuardada.fecha || new Date().toISOString().split('T')[0]}.png`;
          link.click();
          showSuccess('Lista compartida como imagen');
        }
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `lista-compras-${listaGuardada.fecha || new Date().toISOString().split('T')[0]}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      showError('Error al compartir la lista');
    } finally {
      document.body.removeChild(container);
=======
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
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
    }
  };

  const descargarListaImagen = async () => {
    if (lista.length === 0) {
      showError("No hay productos en la lista para descargar");
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
      showError('Error al descargar la imagen');
    }
  };

  useEffect(() => {
    const loadListas = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const listas = await getShoppingLists(user.uid);
        setListasGuardadas(listas);
      } catch (error) {
        console.error('Error al cargar las listas:', error);
      } finally {
        setLoading(false);
      }
    };
    loadListas();
  }, [user]);

  return (
<<<<<<< HEAD
    <Layout>
      <div className="caja-list">
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
            <select ref={opcionesRef} id="opciones" name="opciones" defaultValue="">
              <option value="" disabled>Supermercado</option>
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
=======
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
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
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
<<<<<<< HEAD
              {lista
                .slice()
                .sort((a, b) => (a.opciones || '').localeCompare(b.opciones || ''))
                .map((producto, index) => (
                <div key={producto.id} className={`producto-fila ${index % 2 === 0 ? 'fila-par' : 'fila-impar'}`}>
                  <span className="producto-nombre">{producto.producto.toUpperCase()}</span>
                  <span className="producto-cantidad">{producto.cantidad}</span>
                  <span className="producto-categoria">{producto.opciones}</span>
                </div>
              ))}
              <div className="producto-total">
                <span>TOTAL:</span>
                <span>{lista.length} artículos</span>
=======
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
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
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
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : listasGuardadas.length === 0 ? (
            <p>No hay listas guardadas</p>
          ) : (
            listasGuardadas.map((listaGuardada, index) => {
              const checkedCount = getCheckedCountForList(index);
              return (
              <div className='ticket-card' key={listaGuardada.id || index} data-index={index} ref={el => listaRefs.current[index] = el}>
                {checkedCount > 0 && (
                  <div className="ticket-checks-header">
                    <button className="limpiar-checks-btn" onClick={() => clearChecksForList(index)}>
                      Limpiar checks ({checkedCount})
                    </button>
                  </div>
                )}
                <div className="ticket-header">
                  <img src={logo3} alt="Logo" className="ticket-logo" />
                  <div className="ticket-info">
<<<<<<< HEAD
                    <span className="ticket-date">{listaGuardada.fecha}</span>
                    <span className="ticket-items">{listaGuardada.lista.length} artículos</span>
=======
                    <span className="ticket-date">­ƒùô´©Å {listaGuardada.fecha}</span>
                    <span className="ticket-items">­ƒôª {listaGuardada.lista.length} art├¡culos</span>
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
                  </div>
                </div>
                <div className="ticket-body">
                  {listaGuardada.lista
                    .slice()
                    .sort((a, b) => (a.opciones || '').localeCompare(b.opciones || ''))
                    .map((producto) => {
                      const key = `${index}-${producto.id}`;
                      return (
                      <div className={`ticket-row ${checkedItems[key] ? 'checked' : ''}`} key={producto.id}>
                        <input 
                          type="checkbox" 
                          checked={!!checkedItems[key]} 
                          onChange={() => toggleChecked(index, producto.id)}
                          className="ticket-checkbox"
                        />
                        <span className="ticket-product">{producto.producto.toUpperCase()}</span>
                        <span className="ticket-qty">x{producto.cantidad}</span>
                        <span className="ticket-store">{producto.opciones}</span>
                      </div>
                    );
                    })}
                </div>
                <div className="ticket-actions">
<<<<<<< HEAD
                  <button className="boton-descargar" onClick={() => descargarListaGuardada(listaGuardada, index)}>DESCARGAR</button>
                  <button className='eliminar2' onClick={() => compartirLista(listaGuardada, index)}>COMPARTIR</button>
                  {listaGuardada.id && (
                    <button className="eliminar" onClick={() => eliminarListaGuardada(listaGuardada.id)}>ELIMINAR</button>
                  )}
=======
                  <button className="eliminar3" onClick={() => eliminarChecks(index)}>ELIMINAR CHECKS</button>
                  <button className="eliminar1" onClick={() => {
                    const listaActual = [...lista, ...listaGuardada.lista.map((p, i) => ({...p, id: lista.length + i + 1}))];
                    setLista(listaActual);
                  }}>A├æADIR A ACTUAL</button>
                  <button className='eliminar2' onClick={() => compartirLista(listaGuardada.lista)}>COMPARTIR</button>
>>>>>>> c9ab882ab8da79c9e97b585bde9e6976bc33ee9a
                </div>
              </div>
            );})
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Lista;
