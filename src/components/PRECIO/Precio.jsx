import React, { useState, useEffect } from 'react';
import './Precio.css';
import { 
  searchProductsOpenFoodFacts, 
  getProductsByCategory,
  supermarkets, 
  categories,
} from '../../service/supermarketService';
import { loadPricesFromStorage, savePricesToStorage } from '../../service/storageService';

const Precio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [manualPrices, setManualPrices] = useState({});
  const [showPriceForm, setShowPriceForm] = useState(false);

  useEffect(() => {
    const stored = loadPricesFromStorage();
    setManualPrices(stored);
  }, []);

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
    
    const stored = loadPricesFromStorage();
    const storedForProduct = {};
    supermarkets.forEach(s => {
      const key = `${product.name}_${s.id}`;
      if (stored[key] !== undefined) {
        storedForProduct[s.id] = stored[key];
      }
    });
    setManualPrices(storedForProduct);
  };

  const handleAddManualPrice = (supermarketId, value) => {
    setManualPrices(prev => ({
      ...prev,
      [supermarketId]: value ? parseFloat(value) : null
    }));
  };

  const handleSaveManualPrices = () => {
    if (!selectedProduct) return;

    const allPrices = loadPricesFromStorage();
    Object.entries(manualPrices).forEach(([supermarketId, price]) => {
      if (price !== null && price !== undefined && price !== '') {
        allPrices[`${selectedProduct.name}_${supermarketId}`] = price;
      }
    });
    savePricesToStorage(allPrices);
    alert('Precios guardados correctamente');
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
    const stored = loadPricesFromStorage();
    const prices = supermarkets.map(s => {
      const key = `${selectedProduct.name}_${s.id}`;
      return {
        id: s.id,
        price: manualPrices[s.id] ?? stored[key] ?? null,
        color: s.color,
        supermarket: s.name,
      };
    });
    return prices.filter(p => p.price !== null && p.price !== undefined && p.price !== '');
  };

  const getCurrentPrices = () => {
    if (!selectedProduct) return [];
    const stored = loadPricesFromStorage();
    return supermarkets.map(s => {
      const key = `${selectedProduct.name}_${s.id}`;
      const price = manualPrices[s.id] ?? stored[key] ?? null;
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
      <section className='body2'>
        <div className='precio-layout'>
          <aside className='categories-sidebar'>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-sidebar-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span className='cat-icon'>{cat.icon}</span>
                <span className='cat-name'>{cat.name}</span>
              </button>
            ))}
          </aside>
          <div className='precio-container'>
            <div className='precio-header'>
              <h1>COMPARADOR DE PRECIOS</h1>
              <p>Encuentra los mejores precios en supermercados de Valencia</p>
            </div>

            <div className='search-section'>
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
                {products.map((product) => (
                  <div 
                    key={product.name} 
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
                    {Object.entries(manualPrices).filter(([, value]) => value && value !== '').map(([supermarketId, price]) => {
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
                {getCurrentPrices().map((item) => {
                  const hasValue = item.price !== null && item.price !== undefined && item.price !== '';
                  const pricesWithValues = getPricesWithValues();
                  const isLowest = hasValue && pricesWithValues.length > 0 && 
                    parseFloat(item.price) === Math.min(...pricesWithValues.map(p => parseFloat(p.price)));
                  
                  return (
                    <div 
                      key={item.id} 
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
        </div>
      </section>
    </div>
  );
};

export default Precio;
