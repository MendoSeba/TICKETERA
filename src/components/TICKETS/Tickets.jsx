import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import logo3 from '../IMG/img23.jpg.jpeg';
import './Tickets.css';
import Footer from '../FOOTER/Footer';

const Tickets = () => {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [opcion, setOpcion] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc');
  const [ordenActual, setOrdenActual] = useState('fecha');
  const [vista, setVista] = useState('todos');
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  useEffect(() => {
    const storedGastos = localStorage.getItem('gastos');
    if (storedGastos) {
      setGastos(JSON.parse(storedGastos));
    }
  }, []);

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

  const calcularTotalMesEspecifico = (mesAno) => {
    const grupos = agruparPorMes();
    if (grupos[mesAno]) {
      return grupos[mesAno].reduce((total, gasto) => total + gasto.cantidad, 0);
    }
    return 0;
  };

  const borrarMes = (mesAno) => {
    if (!window.confirm(`┬┐Est├ís seguro de eliminar todos los gastos de ${formatearMesAno(mesAno)}?`)) {
      return;
    }
    const nuevosGastos = gastos.filter(gasto => {
      const fecha = new Date(gasto.fecha);
      const gastoMesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      return gastoMesAno !== mesAno;
    });
    setGastos(nuevosGastos);
    setVista('todos');
    setMesSeleccionado(null);
    localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
  };

  const verMes = (mesAno) => {
    setMesSeleccionado(mesAno);
    setVista('mes');
  };

  const volverATodos = () => {
    setVista('todos');
    setMesSeleccionado(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuid();
    const date = new Date().toISOString().split('T')[0];
    const nuevoGasto = {
      id,
      descripcion,
      cantidad: parseInt(cantidad),
      opcion,
      fecha: date
    };
    const nuevosGastos = [...gastos, nuevoGasto];
    const gastosOrdenadosNuevos = nuevosGastos.sort(ordenarGastos);
    setGastos(gastosOrdenadosNuevos);
    setDescripcion('');
    setCantidad('');
    localStorage.setItem('gastos', JSON.stringify(gastosOrdenadosNuevos));
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

  const handleDelete = (id) => {
    const nuevosGastos = gastos.filter((gasto) => gasto.id !== id);
    setGastos(nuevosGastos);
    localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
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
      <section className='tickets-section'>
        <div className="tickets-container">
          <div className="botones-vista">
            <button className='boton-tickets' onClick={() => setVista('todos')}>Ver Todos los Gastos</button>
            <button className='boton-tickets' onClick={() => setVista('meses')}>Ver por Meses</button>
            {vista === 'mes' && <button className='boton-tickets' onClick={volverATodos}>Volver</button>}
          </div>
          <form className='form3' onSubmit={handleSubmit}>
            <h3>AGREGAR GASTO:</h3>
            <label className='label-form3' htmlFor="gasto">Gasto:</label>
            <input className='input-form3' type="number" id="gasto" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
            
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
              <option value="Otro">Otro</option>
            </select>
            <button className='boton-tickets' type="submit">AGREGAR</button>
          </form>
          {vista === 'todos' && (
            <div className='div-del-body2'>
              <table className='table1'>
                <thead>
                  <tr>
                    <th onClick={() => handleOrden('fecha')} className={ordenActual === 'fecha' ? 'active' : ''}>
                      Fecha {ordenActual === 'fecha' ? (ordenamiento === 'asc' ? 'Ôåæ' : 'Ôåô') : ''}
                    </th>
                    <th onClick={() => handleOrden('opcion')} className={ordenActual === 'opcion' ? 'active' : ''}>
                      Opcion {ordenActual === 'opcion' ? (ordenamiento === 'asc' ? 'Ôåæ' : 'Ôåô') : ''}
                    </th>
                    <th onClick={() => handleOrden('cantidad')} className={ordenActual === 'cantidad' ? 'active' : ''}>
                      Cantidad {ordenActual === 'cantidad' ? (ordenamiento === 'asc' ? 'Ôåæ' : 'Ôåô') : ''}
                    </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosOrdenados.map((gasto) => (
                    <tr key={gasto.id}>
                      <td>{gasto.fecha}</td>
                      <td>{gasto.opcion}</td>
                      <td>{gasto.cantidad}</td>
                      <td>
                        <button className='boton-tickets' onClick={() => handleDelete(gasto.id)}>ELIMINAR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="totales">
                <p>Total Semana: {totalSemana}</p>
                <p>Total Mes: {totalMes}</p>
                <p>Total A├▒o: {totalAnio}</p>
              </div>
            </div>
          )}
          {vista === 'meses' && (
            <div className='div-del-body2'>
              <h3>Meses con Gastos:</h3>
              <ul className="lista-meses">
                {Object.keys(agruparPorMes()).sort().reverse().map(mesAno => (
                  <li key={mesAno} className="mes-item">
                    <span>{formatearMesAno(mesAno)} - Total: {calcularTotalMesEspecifico(mesAno)}</span>
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
                    <th>Opcion</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {agruparPorMes()[mesSeleccionado].sort(ordenarGastos).map((gasto) => (
                    <tr key={gasto.id}>
                      <td>{gasto.fecha}</td>
                      <td>{gasto.opcion}</td>
                      <td>{gasto.cantidad}</td>
                      <td>
                        <button className='boton-tickets' onClick={() => handleDelete(gasto.id)}>ELIMINAR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="totales">
                <p>Total del Mes: {calcularTotalMesEspecifico(mesSeleccionado)}</p>
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
