import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import { addTicket, getTickets, updateTicket, deleteTicket } from '../../service/firestoreService';
import logo3 from '../IMG/img23.jpg.jpeg';
import './Tickets.css';
import Footer from '../FOOTER/Footer';

const SUPERMARKETS = [
  'Mercadona', 'Carrefour', 'Lidl', 'Aldi', 'Dia', 'Consum', 'Eroski', 'Otro'
];

const Tickets = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState('');
  const [opcion, setOpcion] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc');
  const [ordenActual, setOrdenActual] = useState('fecha');
  const [vista, setVista] = useState('todos');
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [filtroSupermercado, setFiltroSupermercado] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editCantidad, setEditCantidad] = useState('');
  const [editOpcion, setEditOpcion] = useState('');
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  const cargarGastos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getTickets(user.uid);
      setGastos(data);
    } catch (error) {
      console.error('Error cargando gastos:', error);
      showError('Error al cargar los gastos');
    } finally {
      setLoading(false);
    }
  };

  const gastosFiltrados = useMemo(() => {
    let resultado = [...gastos];
    if (filtroSupermercado) {
      resultado = resultado.filter(g => g.opcion === filtroSupermercado);
    }
    return resultado;
  }, [gastos, filtroSupermercado]);

  const ordenarGastos = useCallback((a, b) => {
    switch (ordenActual) {
      case 'cantidad':
        return ordenamiento === 'asc' ? a.cantidad - b.cantidad : b.cantidad - a.cantidad;
      case 'opcion':
        return ordenamiento === 'asc' ? a.opcion.localeCompare(b.opcion) : b.opcion.localeCompare(a.opcion);
      default:
        return ordenamiento === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
    }
  }, [ordenActual, ordenamiento]);

  const gastosOrdenados = useMemo(() => {
    return [...gastosFiltrados].sort(ordenarGastos);
  }, [gastosFiltrados, ordenarGastos]);

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

  const calcularTotalMesEspecifico = (mesAno) => {
    const grupos = agruparPorMes();
    if (grupos[mesAno]) {
      return grupos[mesAno].reduce((total, gasto) => total + gasto.cantidad, 0);
    }
    return 0;
  };

  const borrarMes = async (mesAno) => {
    if (!window.confirm(`¿Estás seguro de eliminar todos los gastos de ${formatearMesAno(mesAno)}?`)) {
      return;
    }
    try {
      const gastosMes = agruparPorMes()[mesAno] || [];
      for (const gasto of gastosMes) {
        await deleteTicket(gasto.id);
      }
      setGastos(prev => prev.filter(g => {
        const fecha = new Date(g.fecha);
        const gastoMesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        return gastoMesAno !== mesAno;
      }));
      setVista('todos');
      setMesSeleccionado(null);
      showSuccess('Gastos del mes eliminados');
    } catch (error) {
      console.error('Error borrando mes:', error);
      showError('Error al eliminar los gastos');
    }
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
    if (!user) return;
    if (!cantidad || !opcion) {
      showError('Completa la cantidad y el supermercado');
      return;
    }
    try {
      const date = new Date().toISOString().split('T')[0];
      const nuevoGasto = {
        userId: user.uid,
        cantidad: parseFloat(cantidad),
        opcion,
        fecha: date,
      };
      const added = await addTicket(nuevoGasto);
      setGastos(prev => [...prev, added]);
      setCantidad('');
      setOpcion('');
      showSuccess('Gasto agregado correctamente');
    } catch (error) {
      console.error('Error agregando gasto:', error);
      showError('Error al agregar el gasto');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      setGastos(prev => prev.filter(g => g.id !== id));
      showSuccess('Gasto eliminado');
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      showError('Error al eliminar el gasto');
    }
  };

  const handleEdit = (gasto) => {
    setEditandoId(gasto.id);
    setEditCantidad(gasto.cantidad.toString());
    setEditOpcion(gasto.opcion || '');
  };

  const handleEditSubmit = async (id) => {
    try {
      const updatedData = {
        cantidad: parseFloat(editCantidad),
        opcion: editOpcion,
      };
      await updateTicket(id, updatedData);
      setGastos(prev => prev.map(g => g.id === id ? { ...g, ...updatedData } : g));
      setEditandoId(null);
      showSuccess('Gasto actualizado');
    } catch (error) {
      console.error('Error actualizando gasto:', error);
      showError('Error al actualizar el gasto');
    }
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
  };

  const handleOrden = (campo) => {
    if (campo === ordenActual) {
      setOrdenamiento(ordenamiento === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenActual(campo);
      setOrdenamiento('asc');
    }
  };

  const calcularTotalSemana = () => {
    const fechaActual = new Date();
    const semanaActual = fechaActual.getWeek();
    const gastosSemanaActual = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getWeek() === semanaActual;
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

  const exportarCSV = () => {
    const headers = 'Fecha,Supermercado,Cantidad\n';
    const rows = gastos.map(g =>
      `${g.fecha},${g.opcion},${g.cantidad}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showSuccess('CSV exportado correctamente');
  };

  const totalSemana = calcularTotalSemana();
  const totalMes = calcularTotalMes();
  const totalAnio = calcularTotalAnio();

  const renderGastoRow = (gasto) => {
    const isEditing = editandoId === gasto.id;
    if (isEditing) {
      return (
        <tr key={gasto.id} className="edit-row">
          <td><input type="date" value={gasto.fecha} className="input-form3" readOnly /></td>
          <td>
            <select value={editOpcion} onChange={(e) => setEditOpcion(e.target.value)} className="input-form3">
              <option value="">Seleccione</option>
              {SUPERMARKETS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </td>
          <td>
            <input type="number" step="0.01" value={editCantidad} onChange={(e) => setEditCantidad(e.target.value)} className="input-form3" />
          </td>
          <td>
            <button className="boton-tickets guardar" onClick={() => handleEditSubmit(gasto.id)}>💾</button>
            <button className="boton-tickets cancelar" onClick={handleCancelEdit}>✕</button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={gasto.id}>
        <td>{gasto.fecha}</td>
        <td>{gasto.opcion}</td>
        <td>{gasto.cantidad.toFixed(2)}€</td>
        <td>
          <button className="boton-tickets editar" onClick={() => handleEdit(gasto)}>✏️ Editar</button>
          <button className="boton-tickets eliminar" onClick={() => handleDelete(gasto.id)}>🗑️ Eliminar</button>
        </td>
      </tr>
    );
  };

  return (
    <div className="tickets-page">
      <section className='section-header'>
        <header className='header_home'>
          <a className='container'><img className='logo3' src={logo3} alt="Logo" /></a>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal" >
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
      <section className='tickets-section'>
        <div className="tickets-container">
          <div className="botones-vista">
            <button className='boton-tickets' onClick={() => setVista('todos')}>Ver Todos</button>
            <button className='boton-tickets' onClick={() => setVista('meses')}>Ver por Meses</button>
            {vista === 'mes' && <button className='boton-tickets' onClick={volverATodos}>Volver</button>}
            {gastos.length > 0 && <button className='boton-tickets exportar' onClick={exportarCSV}>📥 Exportar CSV</button>}
          </div>

          <div className="filtros-container">
            <select value={filtroSupermercado} onChange={(e) => setFiltroSupermercado(e.target.value)} className="filtro-select">
              <option value="">Todos los supermercados</option>
              {SUPERMARKETS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <form className='form3' onSubmit={handleSubmit}>
            <h3>AGREGAR GASTO:</h3>
            <label className='label-form3' htmlFor="gasto">Cantidad (€):</label>
            <input className='input-form3' type="number" step="0.01" id="gasto" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />

            <label className='label-form3' htmlFor="opcion">Supermercado:</label>
            <select id="opcion-t" value={opcion} onChange={(e) => setOpcion(e.target.value)} required>
              <option value="">Seleccione supermercado</option>
              {SUPERMARKETS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button className='boton-tickets' type="submit">AGREGAR</button>
          </form>

          {vista === 'todos' && (
            <div className='div-del-body2'>
              <table className='table1'>
                <thead>
                  <tr>
                    <th onClick={() => handleOrden('fecha')} className={ordenActual === 'fecha' ? 'active' : ''}>
                      Fecha {ordenActual === 'fecha' ? (ordenamiento === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleOrden('opcion')} className={ordenActual === 'opcion' ? 'active' : ''}>
                      Supermercado {ordenActual === 'opcion' ? (ordenamiento === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleOrden('cantidad')} className={ordenActual === 'cantidad' ? 'active' : ''}>
                      Cantidad {ordenActual === 'cantidad' ? (ordenamiento === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="loading-cell">Cargando gastos...</td></tr>
                  ) : gastosOrdenados.length === 0 ? (
                    <tr><td colSpan="4" className="empty-cell">No hay gastos {filtroSupermercado ? 'con ese filtro' : ''}</td></tr>
                  ) : (
                    gastosOrdenados.map(renderGastoRow)
                  )}
                </tbody>
              </table>
              <div className="totales">
                <p>Total Semana: <span>{totalSemana.toFixed(2)}€</span></p>
                <p>Total Mes: <span>{totalMes.toFixed(2)}€</span></p>
                <p>Total Año: <span>{totalAnio.toFixed(2)}€</span></p>
              </div>
            </div>
          )}

          {vista === 'meses' && (
            <div className='div-del-body2'>
              <h3>Meses con Gastos:</h3>
              <ul className="lista-meses">
                {Object.keys(agruparPorMes()).sort().reverse().map(mesAno => (
                  <li key={mesAno} className="mes-item">
                    <span>{formatearMesAno(mesAno)} - Total: {calcularTotalMesEspecifico(mesAno).toFixed(2)}€</span>
                    <button className='boton-tickets' onClick={() => verMes(mesAno)}>Ver Gastos</button>
                    <button className='boton-tickets eliminar' onClick={() => borrarMes(mesAno)}>Borrar Mes</button>
                  </li>
                ))}
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
                    <th>Supermercado</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {agruparPorMes()[mesSeleccionado].sort(ordenarGastos).map(renderGastoRow)}
                </tbody>
              </table>
              <div className="totales">
                <p>Total del Mes: <span>{calcularTotalMesEspecifico(mesSeleccionado).toFixed(2)}€</span></p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Tickets;
