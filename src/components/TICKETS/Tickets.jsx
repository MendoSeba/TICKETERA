import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import logo3 from '../IMG/img23.jpg.jpeg';
import './Tickets.css';

const Tickets = () => {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [opcion, setOpcion] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc');
  const [ordenActual, setOrdenActual] = useState('fecha');

  const ordenarGastos = (a, b) => {
    switch (ordenActual) {
      case 'cantidad':
        return ordenamiento === 'asc' ? a.cantidad - b.cantidad : b.cantidad - a.cantidad;
      case 'opcion':
        return ordenamiento === 'asc' ? a.opcion.localeCompare(b.opcion) : b.opcion.localeCompare(a.opcion);
      default:
        return ordenamiento === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
    }
  };

  Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  useEffect(() => {
    const storedGastos = localStorage.getItem('gastos');
    if (storedGastos) {
      setGastos(JSON.parse(storedGastos));
      console.log('Gastos cargados desde el Local Storage:', gastos);
    }
  }, []);

  useEffect(() => {
    const storedGastos = localStorage.getItem('gastos');
    if (storedGastos) {
      const parsedGastos = JSON.parse(storedGastos);
      const gastosOrdenados = parsedGastos.sort(ordenarGastos);
      setGastos(gastosOrdenados);
      console.log('Gastos cargados desde el Local Storage:', gastosOrdenados);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuid();
    const date = new Date().toLocaleDateString();
    const nuevoGasto = {
      id,
      descripcion,
      cantidad: parseInt(cantidad),
      opcion,
      fecha: date
    };
    const nuevosGastos = [...gastos, nuevoGasto];
    const gastosOrdenados = nuevosGastos.sort(ordenarGastos);
    setGastos(gastosOrdenados);
    setDescripcion('');
    setCantidad('');

    localStorage.setItem('gastos', JSON.stringify(gastosOrdenados));
  };

  const calcularTotalSemana = () => {
    const total = gastos.reduce((acum, gasto) => acum + gasto.cantidad, 0);
    return total;
  };

  const calcularTotalMes = () => {
    const totalSemana = calcularTotalSemana();
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const gastosMesActual = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getMonth() + 1 === mesActual;
    });
    const totalMes = gastosMesActual.reduce((acum, gasto) => acum + gasto.cantidad, 0);
    return totalSemana + totalMes;
  };

  const calcularTotalAnio = () => {
    const totalSemana = calcularTotalSemana();
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const gastosAnioActual = gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getFullYear() === anioActual;
    });
    const totalAnio = gastosAnioActual.reduce((acum, gasto) => acum + gasto.cantidad, 0);
    return totalSemana + totalAnio;
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


  const gastosOrdenados = gastos.sort(ordenarGastos);

  return (
      <div>
    <section className='section-header'>
      <header className='header_home'>
      <a className='container'><img className='logo3' src={logo3}></img></a>
        <nav id="nav" className="">
          <ul id="links" className="links-horizontal" >
          <h2 className='titulo2'> TICKETERA</h2>
          <Link className="l-inicial" to="/">INICIO</Link>
          <Link  className='l-inicial' to="/precio">PRECIO</Link>
          <Link  className='l-inicial' to="/lista">LISTA</Link>
          </ul>
          <div class="responsive-menu">
          <ul>
            <li><Link to="/">INICIO</Link></li>
            <li><Link to="/precio">PRECIO</Link></li>
            <li><Link to="/lista">LISTA</Link></li>
            </ul>
            </div>
        </nav>
      </header>
    </section>
    <section className='body2'>
  <div>
    <form className='form3' onSubmit={handleSubmit}>
      <h3>AGREGAR GASTO:</h3>
      <label className='label-form3' htmlFor="gasto">Gasto:</label>
      <input className='input-form3' type="number" id="gasto" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
      
      <label className='label-form3' htmlFor="opcion">Opcion:</label>
      <select id="opcion-t" value={opcion} onChange={(e) => setOpcion(e.target.value)} required>
        <option value="">Seleccione una opcion</option>
        <option value="LA DONA">LA DONA</option>
        <option value="LILI">LILI</option>
        <option value="CORTE PERUANO">CORTE PERUANO</option>
        <option value="CONSUMO">CONSUMO</option>
        <option value="OTROS">OTROS</option>
      </select>
      <button className='boton-tickets' type="submit">AGREGAR</button>
    </form>
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
    <p>Total Año: {totalAnio}</p>
  </div>
</div>


  </div>
</section>



    <footer className='section-footer'>
        <p>Número de contacto: +54 637-62-89-25</p>
        <a href="https://github.com/MendoSeba" target="_blank" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZdJREFUSEu1lYExBVEMRe+vABWgAlSAClABKkAFqAAdUMGnAlSADuiACpgzk+zkZ7L735rZzOzs7puXe5P7kryZJrbZxPhqITiUdCBp2x5ierfnRdLDUJBDBADfSNpYkuWnpAtJj9W+PoIrSZcj5bs1ogW3iuA/4A56J+k8MmSCPUnPtuFJEmQnks5s7cPeW/ZG/3vbc2xrR1GuTICe67bx2gj4XZX0nSSLazFrMDZ9byTgUOcBhOiIvsWyrKeW2UKZkqqnCei+JMqwxSjhtyq4mAFgu0FrnMZY9KdPdnCOBGi8YoivkjjwMRYJOuxI8BvQJiGIEZDN2pjwrcpcgS+fADGDfMi0P93ZYjQXY8Wtq8C+Mv2x86D86M7cAw5EL1B5OZCyTHGiSUiTEiUqL1u6mp5wIoDJmKrjO1onT64i/n1UAESZOUjsagfLkvr6Qv9Uw871LKdjCLUaikuHnfs7CQ1DNj7UohSZoMpy8EZDLmRg+FXOToDmnE85VlquTIjIgmyiMUq47cqbzDe2ELT0Qe+eyQn+AIklVhnz1DvpAAAAAElFTkSuQmCC"/></a>
        
        <a href="https://www.linkedin.com/in/sebastian-stallocca-10b40690/" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAOdJREFUSEvllWENwjAQhb8pAAk4AAeAA1AAEnCCBXAACgAHSEACKIC85Eqabg0s1y0h3K82ub5vd++6VnQcVcf69A44A1NnVdKYB420gqdTvKabAzyAg2UvgEFL8Fs3B9gDaxPdAaufA9yTFg1LVyAPriY6MQ8uth8BAsqjGyCPxskHfPRAYjM7FEY3HJI3EleVITbANtq7ALluCRimzQVQe06AWreMvIovqQug1gmgOJoHWncCaPJKsGIV/DFAIxdfNE2OTFRorQlSNOV95UHLP0MtPWtyiQcnNr7/J9Pbmnyviiub4As/E0wZX0UvUwAAAABJRU5ErkJggg=="/></a>
        
        <a href="http://ssdesarrolloweb.000webhostapp.com/" target="_blank">Sitio web de SS Desarrollo Web</a>
      </footer>
    </div>
  )
            }

export default Tickets;