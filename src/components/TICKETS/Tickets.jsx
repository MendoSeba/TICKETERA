import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import './Tickets.css';
import Layout from '../Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import { getTickets, addTicket, deleteTicket } from '../../service/firestoreService';
import { supermarkets, getSuperColor } from '../../service/supermarketService';
import { analyzeTicketWithGemini } from '../../service/geminiService';

const Tickets = () => {
  const { showSuccess, showError } = useToast();
  const { user, tickets: gastos, loadingData, refreshData } = useAuth();
  const [cantidad, setCantidad] = useState('');
  const [opcion, setOpcion] = useState('');
  const [customOpcion, setCustomOpcion] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc');
  const [ordenActual, setOrdenActual] = useState('fecha');
  const [vista, setVista] = useState('todos');
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedItems, setScannedItems] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const ordenarGastos = useCallback((a, b) => {
    switch (ordenActual) {
      case 'cantidad':
        return ordenamiento === 'asc' ? a.cantidad - b.cantidad : b.cantidad - a.cantidad;
      case 'opcion':
        return ordenamiento === 'asc' ? (a.opcion || '').localeCompare(b.opcion || '') : (b.opcion || '').localeCompare(a.opcion || '');
      default:
        return ordenamiento === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
    }
  }, [ordenActual, ordenamiento]);

  const gastosOrdenados = useMemo(() => {
    return [...gastos].sort(ordenarGastos);
  }, [gastos, ordenarGastos]);

  const agruparPorMes = useCallback(() => {
    const grupos = {};
    gastos.forEach(gasto => {
      const fecha = new Date(gasto.fecha);
      const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!grupos[mesAno]) {
        grupos[mesAno] = [];
      }
      grupos[mesAno].push(gasto);
    });
    return grupos;
  }, [gastos]);

  const formatearMesAno = (mesAno) => {
    const [year, month] = mesAno.split('-');
    const date = new Date(year, month - 1);
    const mesNombre = date.toLocaleDateString('es-ES', { month: 'long' });
    return mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1) + ' de ' + year;
  };

  const formatearMonto = (monto) => {
    return monto.toFixed(2).replace('.', ',');
  };

  const getTotalColor = (totalActual, totalAnterior) => {
    if (totalAnterior === 0) return 'green'; // Primer periodo
    if (totalActual < totalAnterior) return 'green'; // Gastado menos que antes
    if (totalActual <= totalAnterior * 1.1) return 'orange'; // Hasta un 10% más
    return 'red'; // Más de un 10% de aumento
  };

  const calcularTotalesAnteriores = () => {
    const hoy = new Date();

    // Semana anterior
    const haceUnaSemana = new Date(hoy);
    haceUnaSemana.setDate(hoy.getDate() - 7);
    const semanaAnterior = getWeekNumber(haceUnaSemana);
    const totalSemanaAnterior = gastos
      .filter(g => {
        const d = new Date(g.fecha);
        return getWeekNumber(d) === semanaAnterior && d.getFullYear() === haceUnaSemana.getFullYear();
      })
      .reduce((acc, g) => acc + g.cantidad, 0);

    // Mes anterior
    const dMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const totalMesAnterior = gastos
      .filter(g => {
        const d = new Date(g.fecha);
        return d.getMonth() === dMesAnterior.getMonth() && d.getFullYear() === dMesAnterior.getFullYear();
      })
      .reduce((acc, g) => acc + g.cantidad, 0);

    // Año anterior
    const totalAnioAnterior = gastos
      .filter(g => new Date(g.fecha).getFullYear() === hoy.getFullYear() - 1)
      .reduce((acc, g) => acc + g.cantidad, 0);

    return { totalSemanaAnterior, totalMesAnterior, totalAnioAnterior };
  };

  const { totalSemanaAnterior, totalMesAnterior, totalAnioAnterior } = useMemo(calcularTotalesAnteriores, [gastos]);

  const calcularTotalMesEspecifico = (mesAno) => {
    const grupos = agruparPorMes();
    if (grupos[mesAno]) {
      return grupos[mesAno].reduce((total, gasto) => total + gasto.cantidad, 0);
    }
    return 0;
  };

  const borrarMes = async (mesAno) => {
    const grupos = agruparPorMes();
    const gastosDelMes = grupos[mesAno] || [];
    
    for (const gasto of gastosDelMes) {
      if (gasto.id) {
        await deleteTicket(gasto.id, user.uid);
      }
    }
    
    const nuevosGastos = gastos.filter(gasto => {
      const fecha = new Date(gasto.fecha);
      const gastoMesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      return gastoMesAno !== mesAno;
    });
    setGastos(nuevosGastos);
    setVista('todos');
    setMesSeleccionado(null);
    showSuccess('Gastos del mes eliminados');
  };

  const verMes = (mesAno) => {
    setMesSeleccionado(mesAno);
    setVista('mes');
  };

  const volverATodos = () => {
    setVista('todos');
    setMesSeleccionado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showError("Debes iniciar sesión para guardar tickets");
      return;
    }

    if (!cantidad || !opcion) {
      showError("Por favor, completa todos los campos");
      return;
    }

    const id = uuid();
    const date = new Date().toISOString().split('T')[0];
    const cantidadNum = parseFloat(cantidad.replace(/,/g, '.'));
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      showError("Por favor, introduce un número válido");
      return;
    }
    const nuevoGasto = {
      id,
      cantidad: cantidadNum,
      opcion: opcion === 'Otro' ? customOpcion : opcion,
      fecha: date,
      userId: user.uid,
      items: scannedItems // Guardamos los productos detectados por la IA
    };

    try {
      const ticketGuardado = await addTicket(nuevoGasto, user.uid);
      await refreshData();
      setCantidad('');
      setOpcion('');
      setScannedItems([]); // Limpiamos los items escaneados
      showSuccess("Ticket guardado correctamente con desglose de productos");
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
      showError("Error al guardar el ticket: " + error.message);
    }
  };

  const calcularTotalSemana = () => {
    const fechaActual = new Date();
    const semanaActual = getWeekNumber(fechaActual);
    const gastosSemanaActual = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return getWeekNumber(fechaGasto) === semanaActual;
    });
    return gastosSemanaActual.reduce((acum, gasto) => acum + gasto.cantidad, 0);
  };

  const calcularTotalMes = () => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();
    const gastosMesActual = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getMonth() + 1 === mesActual && fechaGasto.getFullYear() === anioActual;
    });
    return gastosMesActual.reduce((acum, gasto) => acum + gasto.cantidad, 0);
  };

  const calcularTotalAnio = () => {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const gastosAnioActual = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getFullYear() === anioActual;
    });
    return gastosAnioActual.reduce((acum, gasto) => acum + gasto.cantidad, 0);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id, user.uid);
      await refreshData();
      showSuccess('Gasto eliminado');
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
      showError('Error al eliminar el gasto');
    }
  };

  const handleOrden = (campo) => {
    if (campo === ordenActual) {
      setOrdenamiento(ordenamiento === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenActual(campo);
      setOrdenamiento('asc');
    }
  };

  const totalSemana = calcularTotalSemana();
  const totalMes = calcularTotalMes();
  const totalAnio = calcularTotalAnio();

  const detectSupermarket = (text) => {
    const textLower = text.toLowerCase();
    const supermarkets = {
      'mercadona': ['mercadona'],
      'carrefour': ['carrefour'],
      'lidl': ['lidl'],
      'dia': ['dia', 'dIA'],
      'eroski': ['eroski'],
      'consum': ['consum'],
      'aldi': ['aldi']
    };
    
    for (const [key, keywords] of Object.entries(supermarkets)) {
      for (const kw of keywords) {
        if (textLower.includes(kw)) {
          return key.charAt(0).toUpperCase() + key.slice(1);
        }
      }
    }
    return '';
  };

  const extractTotal = (text) => {
    const patterns = [
      /total[:\s]*(\d+[.,]\d{2})/i,
      /importe[:\s]*(\d+[.,]\d{2})/i,
      /a\s*pagar[:\s]*(\d+[.,]\d{2})/i,
      /subtotal[:\s]*(\d+[.,]\d{2})/i,
      /(\d+[.,]\d{2})\s*€/i,
      /€\s*(\d+[.,]\d{2})/i,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const num = match[1].replace(',', '.');
        return parseFloat(num);
      }
    }
    return null;
  };

  const handleScanTicket = async (imageSource) => {
    setScanning(true);
    setScanProgress(10);
    
    try {
      setScanProgress(30);
      const data = await analyzeTicketWithGemini(imageSource);
      setScanProgress(90);
      
      if (data && data.total) {
        setCantidad(data.total.toString().replace('.', ','));
        if (data.productos) {
          setScannedItems(data.productos);
        }
        if (data.supermercado) {
          // Normalizar nombre del supermercado para el selector
          const superMatch = supermarkets.find(s =>
            data.supermercado.toLowerCase().includes(s.id.toLowerCase()) ||
            s.name.toLowerCase().includes(data.supermercado.toLowerCase())
          );

          if (superMatch) {
            setOpcion(superMatch.name);
          } else {
            setOpcion('Otro');
            setCustomOpcion(data.supermercado);
          }
        }

        showSuccess(`IA: Ticket de ${data.supermercado || 'Súper'} detectado. Total: ${data.total}€`);

        // Aquí podrías guardar también los productos desglosados si actualizamos la DB
        console.log('Productos detectados:', data.productos);

      } else {
        showError('La IA no pudo encontrar el total. Intenta otra foto.');
      }
    } catch (error) {
      console.error('Error con Gemini:', error);
      showError('Error al procesar con IA. Verifica tu API Key.');
    } finally {
      setScanning(false);
      setScanProgress(0);
      setShowCamera(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleScanTicket(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
      handleScanTicket(imageData);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  useEffect(() => {
    return () => {
      const videoEl = videoRef.current;
      if (videoEl && videoEl.srcObject) {
        videoEl.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
      <div className="tickets-app">
        <header className="page-header">
          <h2 className="title-app">Mis Tickets</h2>
          <p className="subtitle-app">Gestiona y escanea tus gastos</p>
        </header>

        <div className="tickets-container">
        <div className="botones-vista">
          <button className='boton-tickets' onClick={() => setVista('todos')}>Ver Todos los Gastos</button>
          <button className='boton-tickets' onClick={() => setVista('meses')}>Ver por Meses</button>
          <label className='boton-tickets scan-btn'>
            📷 Escanear Ticket
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>
          {vista === 'mes' && <button className='boton-tickets' onClick={volverATodos}>Volver</button>}
        </div>
        {scanning && (
          <div className="scan-progress">
            <p>Escaneando ticket... {scanProgress}%</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${scanProgress}%` }}></div>
            </div>
          </div>
        )}
        <form className='form3' onSubmit={handleSubmit}>
          <h3>AGREGAR GASTO:</h3>
          <label className='label-form3' htmlFor="gasto">Gasto:</label>
          <input className='input-form3' type="text" id="gasto" value={cantidad} onChange={(e) => {
              const val = e.target.value.replace(/[^0-9,]/g, '');
              if (val === '' || !isNaN(parseFloat(val.replace(/,/g, '.')))) {
                setCantidad(val);
              }
            }} placeholder="0,00" required />
          
          <label className='label-form3' htmlFor="opcion">Opcion:</label>
            <select id="opcion-t" value={opcion} onChange={(e) => setOpcion(e.target.value)} required>
            <option value="">Seleccione supermercado</option>
            <option value="Mercadona">Mercadona</option>
            <option value="Carrefour">Carrefour</option>
            <option value="Lidl">Lidl</option>
            <option value="Aldi">Aldi</option>
            <option value="Dia">Dia</option>
            <option value="Consum">Consum</option>
            <option value="Eroski">Eroski</option>
            <option value="Alcampo">Alcampo</option>
            <option value="Hipercor">Hipercor</option>
            <option value="BonArea">BonArea</option>
            <option value="Otro">Otro</option>
          </select>
          {opcion === 'Otro' && (
            <input
              className='input-form3'
              type="text"
              placeholder="Escribe el nombre del super"
              value={customOpcion}
              onChange={(e) => setCustomOpcion(e.target.value)}
              required
            />
          )}

          {scannedItems.length > 0 && (
            <div className="scanned-items-preview">
              <h4>Productos detectados por IA:</h4>
              <ul>
                {scannedItems.slice(0, 5).map((item, idx) => (
                  <li key={idx}>
                    {item.nombre} - {item.precio}€
                  </li>
                ))}
                {scannedItems.length > 5 && <li>... y {scannedItems.length - 5} más</li>}
              </ul>
            </div>
          )}

          <button className='boton-tickets' type="submit" disabled={scanning}>AGREGAR</button>
        </form>

        {!loadingData && !error && vista === 'todos' && (
          <div className="totales">
            <div className={`totales-card ${getTotalColor(totalSemana, totalSemanaAnterior)}`}>
              <p>Semana</p>
              <strong>{formatearMonto(totalSemana)}€</strong>
              <small style={{fontSize: '10px', opacity: 0.8}}>Ant: {formatearMonto(totalSemanaAnterior)}€</small>
            </div>
            <div className={`totales-card ${getTotalColor(totalMes, totalMesAnterior)}`}>
              <p>Mes</p>
              <strong>{formatearMonto(totalMes)}€</strong>
              <small style={{fontSize: '10px', opacity: 0.8}}>Ant: {formatearMonto(totalMesAnterior)}€</small>
            </div>
            <div className={`totales-card ${getTotalColor(totalAnio, totalAnioAnterior)}`}>
              <p>Año</p>
              <strong>{formatearMonto(totalAnio)}€</strong>
              <small style={{fontSize: '10px', opacity: 0.8}}>Ant: {formatearMonto(totalAnioAnterior)}€</small>
            </div>
          </div>
        )}

        {loadingData && gastos.length === 0 ? (
          <div className="loading-state" style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>
            <p>Cargando tus tickets...</p>
          </div>
        ) : error ? (
          <div className="error-message" style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
            {error}
          </div>
        ) : vista === 'todos' && (
          <div className='div-del-body2'>
            <table className='table1'>
              <thead>
                <tr>
                  <th onClick={() => handleOrden('fecha')} className={ordenActual === 'fecha' ? 'active' : ''}>
                    Fecha {ordenActual === 'fecha' ? (ordenamiento === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleOrden('opcion')} className={ordenActual === 'opcion' ? 'active' : ''}>
                    Opcion {ordenActual === 'opcion' ? (ordenamiento === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleOrden('cantidad')} className={ordenActual === 'cantidad' ? 'active' : ''}>
                    Cantidad {ordenActual === 'cantidad' ? (ordenamiento === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {gastosOrdenados.map((gasto) => {
                  const gastoFecha = new Date(gasto.fecha);
                  const hoy = new Date();
                  const esMismoAnio = gastoFecha.getFullYear() === hoy.getFullYear();
                  const esMismoMes = esMismoAnio && gastoFecha.getMonth() === hoy.getMonth();
                  const esMismaSemana = esMismoMes && getWeekNumber(gastoFecha) === getWeekNumber(hoy);

                  let rowColorClass = '';
                  if (esMismaSemana) rowColorClass = 'row-semana';
                  else if (esMismoMes) rowColorClass = 'row-mes';
                  else if (esMismoAnio) rowColorClass = 'row-anio';
                  else rowColorClass = 'row-anterior';

                  return (
                    <tr key={gasto.id} className={rowColorClass}>
                      <td>{gasto.fecha}</td>
                      <td>
                        <span
                          className="supermarket-tag"
                          style={{ backgroundColor: getSuperColor(gasto.opcion) }}
                        >
                          {gasto.opcion}
                        </span>
                      </td>
                      <td><strong>{formatearMonto(gasto.cantidad)}€</strong></td>
                      <td>
                        <button className='boton-tickets eliminar-btn' onClick={() => handleDelete(gasto.id)} title="Eliminar">
                          <span className="btn-text">Eliminar</span>
                          <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {vista === 'meses' && (
          <div className='div-del-body2'>
            <h3>Meses con Gastos:</h3>
            <ul className="lista-meses">
              {Object.keys(agruparPorMes()).sort().reverse().map(mesAno => {
                const total = calcularTotalMesEspecifico(mesAno);
                const color = total < 100 ? 'green' : total < 300 ? 'orange' : 'red';
                return (
                <li key={mesAno} className="mes-item">
                  <span className="mes-nombre">{formatearMesAno(mesAno)}</span>
                  <span className={`mes-total ${color}`}>{formatearMonto(total)}€</span>
                  <div className="mes-botones">
                    <button className='boton-tickets' onClick={() => verMes(mesAno)}>Ver Gastos</button>
                    <button className='boton-tickets eliminar' onClick={() => borrarMes(mesAno)}>Borrar</button>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        )}
        {vista === 'mes' && mesSeleccionado && agruparPorMes()[mesSeleccionado] && (
          <div className='div-del-body2'>
            <h3>Gastos del Mes: {formatearMesAno(mesSeleccionado)}</h3>
            <table className='table1'>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Opcion</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {agruparPorMes()[mesSeleccionado].sort(ordenarGastos).map((gasto) => (
                  <tr key={gasto.id}>
                    <td>{gasto.fecha}</td>
                    <td>
                      <span
                        className="supermarket-tag"
                        style={{ backgroundColor: getSuperColor(gasto.opcion) }}
                      >
                        {gasto.opcion}
                      </span>
                    </td>
                    <td><strong>{formatearMonto(gasto.cantidad)}€</strong></td>
                    <td>
                      <button className='boton-tickets eliminar-btn' onClick={() => handleDelete(gasto.id)} title="Eliminar">
                        <span className="btn-text">Eliminar</span>
                        <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-mensual-container">
              <p>Total del Mes: <span>{formatearMonto(calcularTotalMesEspecifico(mesSeleccionado))}€</span></p>
            </div>
          </div>
        )}
      </div>
      {showCamera && (
        <div className="camera-modal">
          <div className="camera-content">
            <h3>Captura el ticket</h3>
            <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <div className="camera-buttons">
              <button className='boton-tickets' onClick={capturePhoto}>📸 Capturar</button>
              <button className='eliminar' onClick={stopCamera}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
