import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import logo3 from "../IMG/img23.jpg.jpeg";
import './Precio.css';
import { 
  searchProductsOpenFoodFacts, 
  getProductsByCategory,
  supermarkets, 
  categories,
} from '../../service/supermarketService';
import { addPrice, getPrices, updatePrice, deletePrice } from '../../service/firestoreService';
import Footer from '../FOOTER/Footer';

const Precio = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [manualPrices, setManualPrices] = useState({});
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [savedPrices, setSavedPrices] = useState([]);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPrices, setEditPrices] = useState({});
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'l-inicial active' : 'l-inicial';

  useEffect(() => {
    cargarPrecios();
  }, []);

  const cargarPrecios = async () => {
    if (!user) return;
    try {
      const data = await getPrices(user.uid);
      setSavedPrices(data);
    } catch (error) {
      console.error('Error cargando precios:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setSelectedProduct(null);
    setShowPriceForm(false);

    try {
      const results = await searchProductsOpenFoodFacts(searchTerm.trim());
      setProducts(results);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedProduct(null);
    setSearchTerm('');
    setHasSearched(true);
    setShowPriceForm(false);
    setLoading(true);

    try {
      const results = await getProductsByCategory(categoryId);
      setProducts(results);
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowPriceForm(true);
    
    const existingPrice = savedPrices.find(p => p.productName === product.name);
    if (existingPrice) {
      const pricesForProduct = {};
      supermarkets.forEach(s => {
        if (existingPrice.prices && existingPrice.prices[s.id] !== undefined) {
          pricesForProduct[s.id] = existingPrice.prices[s.id];
        }
      });
      setManualPrices(pricesForProduct);
    } else {
      setManualPrices({});
    }
  };

  const handleAddManualPrice = (supermarketId, value) => {
    setManualPrices(prev => ({
      ...prev,
      [supermarketId]: value ? parseFloat(value) : null
    }));
  };

  const handleSaveManualPrices = async () => {
    if (!selectedProduct || !user) return;

    try {
      const existingPrice = savedPrices.find(p => p.productName === selectedProduct.name);
      const priceData = {
        userId: user.uid,
        productName: selectedProduct.name,
        productBrand: selectedProduct.brand,
        productImage: selectedProduct.image,
        prices: { ...manualPrices },
      };

      if (existingPrice) {
        const mergedPrices = { ...(existingPrice.prices || {}), ...manualPrices };
        await updatePrice(existingPrice.id, { prices: mergedPrices });
        setSavedPrices(prev => prev.map(p => p.id === existingPrice.id ? { ...p, prices: mergedPrices } : p));
      } else {
        const added = await addPrice(priceData);
        setSavedPrices(prev => [added, ...prev]);
      }
      showSuccess('Precios guardados correctamente');
    } catch (error) {
      console.error('Error guardando precios:', error);
      showError('Error al guardar los precios');
    }
  };

  const handleDeletePrice = async (priceId) => {
    try {
      await deletePrice(priceId);
      setSavedPrices(prev => prev.filter(p => p.id !== priceId));
      showSuccess('Precio eliminado');
    } catch (error) {
      console.error('Error eliminando precio:', error);
      showError('Error al eliminar el precio');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setProducts([]);
    setSelectedProduct(null);
    setHasSearched(false);
    setActiveCategory(null);
    setShowPriceForm(false);
  };

  const getPricesWithValues = () => {
    if (!selectedProduct) return [];
    const prices = supermarkets.map(s => {
      return {
        id: s.id,
        price: manualPrices[s.id] ?? null,
        color: s.color,
        supermarket: s.name,
      };
    });
    return prices.filter(p => p.price !== null && p.price !== undefined && p.price !== '');
  };

  const getCurrentPrices = () => {
    if (!selectedProduct) return [];
    return supermarkets.map(s => {
      const price = manualPrices[s.id] ?? null;
      return {
        id: s.id,
        supermarket: s.name,
        price: price,
        color: s.color,
        hasPrice: price !== null && price !== undefined && price !== '',
      };
    });
  };

  const getLowestPrice = () => {
    const pricesWithValues = getPricesWithValues();
    if (pricesWithValues.length === 0) return null;
    return Math.min(...pricesWithValues.map(p => parseFloat(p.price)));
  };

  const getHighestPrice = () => {
    const pricesWithValues = getPricesWithValues();
    if (pricesWithValues.length === 0) return null;
    return Math.max(...pricesWithValues.map(p => parseFloat(p.price)));
  };

  const getSavings = () => {
    const lowest = getLowestPrice();
    const highest = getHighestPrice();
    if (lowest === null || highest === null) return 0;
    return (highest - lowest).toFixed(2);
  };

  const hasAnyPrice = () => getPricesWithValues().length > 0;

  return (
    <div>
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

      <section className='body2'>
        <div className='precio-container'>
          <div className='precio-header'>
            <h1>COMPARADOR DE PRECIOS</h1>
            <p>Encuentra los mejores precios en supermercados de Valencia</p>
          </div>

          <div className='search-section'>
            <div className='search-layout'>
              <div className='categories-nav'>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span className='cat-icon'>{cat.icon}</span>
                    <span className='cat-name'>{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className='search-form-container'>
                <form className='precio-search' onSubmit={handleSearch}>
                  <div className='search-input-container'>
                    <input
                      type="text"
                      placeholder="Buscar producto (ej: leche, aceite, arroz...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='search-input'
                    />
                    <button type="submit" className='search-button' disabled={loading}>
                      {loading ? '...' : '🔍 BUSCAR'}
                    </button>
                    {(hasSearched || searchTerm) && (
                      <button type="button" className='clear-button' onClick={handleClearSearch}>
                        ✕
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {loading && (
            <div className='precio-loading'>
              <div className="spinner"></div>
              <p>Buscando productos...</p>
            </div>
          )}

          {!loading && hasSearched && products.length > 0 && !selectedProduct && (
            <div className='products-results'>
              <h3>Resultados de búsqueda ({products.length})</h3>
              <div className='products-grid'>
                {products.map((product, index) => (
                  <div 
                    key={index} 
                    className='product-card'
                    onClick={() => handleProductSelect(product)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className='product-image'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className='product-image-placeholder' style={{display: 'none'}}>
                      <span>📦</span>
                    </div>
                    <div className='product-info'>
                      <h4>{product.name}</h4>
                      <p>{product.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && hasSearched && products.length === 0 && (
            <div className='precio-empty'>
              <p>No se encontraron productos para tu búsqueda.</p>
              <p>Intenta con otro producto o selecciona una categoría.</p>
            </div>
          )}

          {selectedProduct && !loading && (
            <>
              <button 
                className='back-button'
                onClick={() => {
                  setSelectedProduct(null);
                  setShowPriceForm(false);
                }}
              >
                ← Volver a resultados
              </button>

              <div className='selected-product'>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className='selected-image'
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className='selected-image-placeholder' style={{display: 'none'}}>
                  <span>📦</span>
                </div>
                <div className='selected-info'>
                  <h2>{selectedProduct.name}</h2>
                  <p className='product-brand'>{selectedProduct.brand}</p>
                  {selectedProduct.quantity && <p className='product-quantity'>{selectedProduct.quantity}</p>}
                </div>
              </div>

              {showPriceForm && (
                <div className='manual-prices-form'>
                  <h4>💰 Añade los precios que has visto:</h4>
                  <p className='form-hint'>Selecciona el supermercado e introduce el precio</p>
                  
                  <div className='price-input-row'>
                    <select 
                      className='supermarket-select'
                      defaultValue=""
                    >
                      <option value="" disabled>Seleccionar supermercado</option>
                      {supermarkets.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    
                    <div className='price-input-group'>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className='price-input'
                      />
                      <span>€</span>
                    </div>
                    
                    <button 
                      className='add-price-btn'
                      onClick={(e) => {
                        const select = e.target.previousSibling.previousSibling;
                        const input = e.target.previousSibling;
                        if (select.value && input.value) {
                          handleAddManualPrice(select.value, input.value);
                          select.value = '';
                          input.value = '';
                        }
                      }}
                    >
                      ➕ Añadir
                    </button>
                  </div>

                  <div className='added-prices'>
                    {Object.entries(manualPrices).filter(([key, val]) => val && val !== '').map(([supermarketId, price]) => {
                      const superm = supermarkets.find(s => s.id === supermarketId);
                      if (!superm) return null;
                      return (
                        <div key={supermarketId} className='added-price-chip' style={{ borderColor: superm.color }}>
                          <span style={{ color: superm.color }}>{superm.name}</span>
                          <span>{parseFloat(price).toFixed(2)}€</span>
                          <button 
                            onClick={() => handleAddManualPrice(supermarketId, null)}
                            className='remove-price-btn'
                          >✕</button>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    className='save-prices-button'
                    onClick={handleSaveManualPrices}
                    disabled={!hasAnyPrice()}
                  >
                    💾 Guardar precios ({getPricesWithValues().length})
                  </button>
                </div>
              )}

              {hasAnyPrice() && (
                <div className='precio-summary'>
                  <div className='summary-card'>
                    <span className='summary-label'>Precio más bajo</span>
                    <span className='summary-value' style={{ color: '#4CAF50' }}>
                      {getLowestPrice()?.toFixed(2)}€
                    </span>
                  </div>
                  <div className='summary-card'>
                    <span className='summary-label'>Precio más alto</span>
                    <span className='summary-value' style={{ color: '#f44336' }}>
                      {getHighestPrice()?.toFixed(2)}€
                    </span>
                  </div>
                  <div className='summary-card'>
                    <span className='summary-label'>Ahorro potencial</span>
                    <span className='summary-value' style={{ color: '#2196F3' }}>
                      {getSavings()}€
                    </span>
                  </div>
                </div>
              )}

              <div className='precios-grid'>
                {getCurrentPrices().map((item, index) => {
                  const hasValue = item.price !== null && item.price !== undefined && item.price !== '';
                  const pricesWithValues = getPricesWithValues();
                  const isLowest = hasValue && pricesWithValues.length > 0 && 
                    parseFloat(item.price) === Math.min(...pricesWithValues.map(p => parseFloat(p.price)));
                  
                  return (
                    <div 
                      key={index} 
                      className={`precio-card ${!hasValue ? 'sin-precio' : ''} ${isLowest ? 'precio-mejor' : ''}`}
                      style={{ borderColor: hasValue ? item.color : '#ccc' }}
                    >
                      {isLowest && <span className='badge-mejor'>MEJOR PRECIO</span>}
                      {!hasValue && <span className='badge-sin-precio'>Sin precio</span>}
                      <div className='card-supermarket' style={{ background: item.color + '20' }}>
                        <h3 style={{ color: item.color }}>{item.supermarket}</h3>
                      </div>
                      <div className='card-price'>
                        {hasValue ? (
                          <>
                            <span className='price-value'>{parseFloat(item.price).toFixed(2)}€</span>
                          </>
                        ) : (
                          <span className='price-value-placeholder'>-</span>
                        )}
                      </div>
                      {isLowest && hasValue && pricesWithValues.length > 1 && (
                        <div className='card-ahorro'>
                          <span>Ahorra {getSavings()}€</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {savedPrices.length > 0 && (
            <div className='saved-prices-section'>
              <h3>📋 Mis Precios Guardados ({savedPrices.length})</h3>
              <div className='saved-prices-grid'>
                {savedPrices.map((sp) => (
                  <div key={sp.id} className='saved-price-card'>
                    <div className='saved-price-header'>
                      {sp.productImage && (
                        <img src={sp.productImage} alt={sp.productName} className='saved-price-img' />
                      )}
                      <div className='saved-price-info'>
                        <h4>{sp.productName}</h4>
                        <p>{sp.productBrand}</p>
                      </div>
                    </div>
                    <div className='saved-price-values'>
                      {sp.prices && Object.entries(sp.prices).filter(([k, v]) => v).map(([superId, price]) => {
                        const superm = supermarkets.find(s => s.id === superId);
                        if (!superm) return null;
                        return (
                          <div key={superId} className='saved-price-chip' style={{ borderColor: superm.color }}>
                            <span style={{ color: superm.color }}>{superm.name}</span>
                            <span className='saved-price-value'>{parseFloat(price).toFixed(2)}€</span>
                          </div>
                        );
                      })}
                    </div>
                    <button className='eliminar-precio-btn' onClick={() => handleDeletePrice(sp.id)}>🗑️ Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasSearched && !loading && (
            <div className='precio-info'>
              <h2>¿Cómo funciona?</h2>
              <div className='info-steps'>
                <div className='step'>
                  <div className='step-icon'>1</div>
                  <p>Busca un producto o selecciona una categoría</p>
                </div>
                <div className='step'>
                  <div className='step-icon'>2</div>
                  <p>Selecciona el producto y añade los precios que conoces</p>
                </div>
                <div className='step'>
                  <div className='step-icon'>3</div>
                  <p>Compara y ahorra en tu próxima compra</p>
                </div>
              </div>
              <p className='info-note'>
                * Las imágenes provienen de Open Food Facts (España). Añade los precios que ves en los supermercados.
              </p>
            </div>
          )}

          <div className='supermarkets-list'>
            <h3>Supermercados disponibles:</h3>
            <div className='supermarkets-grid'>
              {supermarkets.map((s) => (
                <div key={s.id} className='supermarket-chip' style={{ borderColor: s.color }}>
                  <span className='chip-logo'>{s.logo}</span>
                  <span className='chip-name'>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Precio;
