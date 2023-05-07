import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo3 from '../IMG/img23.jpg.jpeg';
import './Lista.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Lista = ({ guardarLista }) => {
  const [lista, setLista] = useState([]);
  const formRef = useRef(null);
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [nuevaOpcion, setNuevaOpcion] = useState("");
  const [listasGuardadas, setListasGuardadas] = useState([]);
  const [fechaGuardado, setFechaGuardado] = useState("");

  function limpiarCampos() {
    setNuevoProducto("");
    setNuevaCantidad("");
    setNuevaOpcion("");
    formRef.current.reset();
  }

  function eliminarProducto(id) {
    setLista(lista.filter(producto => producto.id !== id));
  }

  function agregarProducto() {
    const nuevoId = lista.length + 1;
    const nuevoProductoTexto = nuevoProducto.trim();
    const nuevoPrecio = calcularPrecio(document.getElementById("opciones").value);
    const nuevoProducto = {
      id: nuevoId,
      producto: nuevoProductoTexto,
      cantidad: nuevaCantidad,
      precio: nuevoPrecio
    };
    setLista([...lista, nuevoProducto]);
    limpiarCampos();
  }
  
  function calcularPrecio(opciones) {
    let precio = 0;
    switch (opciones) {
      case "LA DONA":
        precio = 2.99;
        break;
      case "LILI":
        precio = 1.49;
        break;
      case "CORTE PERUANO":
        precio = 3.99;
        break;
      case "CONSUMO":
        precio = 0.99;
        break;
      case "OTRO":
        precio = 4.99;
        break;
      default:
        precio = 0;
        break;
    }
    return precio;
  }

  function guardarListaEnLocalStorage() {
    const listaGuardada = {
      lista: lista,
      fecha: new Date().toLocaleDateString()
    };
    const nuevasListasGuardadas = [...listasGuardadas, listaGuardada];
    localStorage.setItem("listasGuardadas", JSON.stringify(nuevasListasGuardadas));
    setListasGuardadas(nuevasListasGuardadas);
    setFechaGuardado(listaGuardada.fecha);
    guardarLista();
  }    

  function eliminarListaGuardada(index) {
    const nuevasListasGuardadas = [...listasGuardadas];
    nuevasListasGuardadas.splice(index, 1);
    localStorage.setItem("listasGuardadas", JSON.stringify(nuevasListasGuardadas));
    setListasGuardadas(nuevasListasGuardadas);
  }

  useEffect(() => {
    const listasGuardadasJson = localStorage.getItem("listasGuardadas");
    if (listasGuardadasJson) {
    setListasGuardadas(JSON.parse(listasGuardadasJson));
    }
    }, []);

  return (
    <div>
      <section className="section-header">
        <header className="header_home">
          <a className="container">
            <img className="logo3" src={logo3} alt="Logo" />
          </a>
          <nav id="nav" className="">
            <ul id="links" className="links-horizontal">
            <h2 className='titulo2'> TICKETERA</h2>
              <Link className="l-inicial" to="/">
                INICIO
              </Link>
              
              <Link className="l-inicial" to="/precio">
                PRECIO
              </Link>
              <Link className="l-inicial" to="/tickets">
                TICKETS
              </Link>
            </ul>
          </nav>
        </header>
      </section>
      <section className="body2">
      <div className='caja-list'>
        <form className='botones-lista'>
          <label htmlFor="producto">PRODUCTO:</label>
          <input type="text" id="producto" name="producto" style={{textTransform: 'uppercase'}} />
  
          <label htmlFor="cantidad">CANTIDAD:</label>
          <input type="number" id="cantidad" name="cantidad" min="0" max="99" onKeyPress={(event) => {
            const charCode = event.which ? event.which : event.keyCode;
            if (charCode < 48 || charCode > 57) {
              event.preventDefault();
            }
          }} pattern="[0-9]*" />
  
  
          <label htmlFor="opciones">OPCIONES:</label>
          <select id="opciones" name="opciones">
            <option value="" disabled selected>Opción</option>
            <option value="LA DONA">LA DONA</option>
            <option value="LILI">LILI </option>
            <option value="CORTE PERUANO">CORTE PERUANO</option>
            <option value="CONSUMO">CONSUMO</option>
            <option value="OTRO">OTRO</option>
          </select>
  
          <button type="button" className="eliminar" onClick={() => {
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const opciones = document.getElementById("opciones").value;
  const precio = calcularPrecio(opciones);

  if (producto.trim() === "" || cantidad.trim() === "" || opciones === "") {
    alert("Por favor, rellene todos los campos");
  } else {
    const nuevoProducto = { id: lista.length + 1, producto, cantidad, opciones };
    setLista([...lista, nuevoProducto]);
    limpiarCampos();
  }
}}>AGREGAR PRODUCTOS A LA LISTA</button>
</form>
        <div className="nueva-lista">
  <h2 className="titulo-mi-lista">MI LISTA DE COMPRAS:</h2>
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
  {lista.length > 0 ? (
    <button className="eliminar" onClick={guardarListaEnLocalStorage}>GUARDAR LISTA</button>
  ) : null}
</div>

 
    <div className='mis-listas'>
      <h2 className='titulo-mi-lista'>MIS LISTAS GUARDADAS:</h2>
      {listasGuardadas.map((lista, index) => (
        <div className='separador' key={index}>
          <p>Fecha de guardado: {lista.fecha}</p>
          <ul>
            {lista.lista.map((producto) => (
              <li key={producto.id}>
                {producto.producto.toUpperCase()} - {producto.cantidad} - {producto.opciones}
                <input type="checkbox" className="check" onChange={() => {
                  // código para manejar el cambio de estado del checkbox
                }} />
              </li>
            ))}
          </ul>
          <button className="eliminar1" onClick={() => {
            eliminarListaGuardada(index);
          }}>ELIMINAR LISTA</button>
          <button className='eliminar2' onClick={() => {
  if (navigator.share) {
    navigator.share({
      title: 'Título del contenido a compartir',
      text: 'Texto del contenido a compartir',
      url: 'https://www.example.com',
    })
      .then(() => console.log('Compartido correctamente.'))
      .catch((error) => console.log('Error al compartir:', error));
  } else {
    console.log('La API Web Share no está disponible en este dispositivo.');
  }
}}>COMPARTIR</button>

        </div>
      ))}
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
export default Lista;
