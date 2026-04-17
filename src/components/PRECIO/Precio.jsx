import React, { useState, useEffect } from 'react';
import './Precio.css';
import { 
  searchProductsOpenFoodFacts, 
  getProductsByCategory,
  supermarkets, 
  categories,
} from '../../service/supermarketService';
import { loadPricesFromStorage, savePricesToStorage } from '../../service/storageService';
import Layout from '../Layout/Layout';
import { useToast } from '../ToastProvider';
import { useNavigate } from 'react-router-dom';

const Precio = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [manualPrices, setManualPrices] = useState({});
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [newSupermarket, setNewSupermarket] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [customProducts, setCustomProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductSupermarket, setNewProductSupermarket] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [showCustomProducts, setShowCustomProducts] = useState(false);

  const [customProductToEdit, setCustomProductToEdit] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteCustomProduct = (productId) => {
    const updated = customProducts.filter(p => p.id !== productId);
    setCustomProducts(updated);
    localStorage.setItem('customProducts', JSON.stringify(updated));
    
    const stored = loadPricesFromStorage();
    const productToDelete = customProducts.find(p => p.id === productId);
    if (productToDelete) {
      Object.keys(stored).forEach(key => {
        if (key.startsWith(productToDelete.name + '_')) {
          delete stored[key];
        }
      });
      savePricesToStorage(stored);
      setManualPrices(stored);
    }
  };

  const handleEditCustomProduct = (product) => {
    setCustomProductToEdit(product);
    setNewProductName(product.name);
    setNewProductBrand(product.brand || '');
    setNewProductDesc(product.description || '');
    setNewProductImage(product.image || '');
    setShowAddProduct(true);
  };

  useEffect(() => {
    const stored = loadPricesFromStorage();
    setManualPrices(stored);
    const custom = localStorage.getItem('customProducts');
    if (custom) setCustomProducts(JSON.parse(custom));
  }, []);

  const saveCustomProduct = () => {
    if (!newProductName.trim()) return;
    
    let updated;
    
    if (customProductToEdit) {
      updated = customProducts.map(p => 
        p.id === customProductToEdit.id 
          ? { ...p, name: newProductName.trim(), brand: newProductBrand.trim(), description: newProductDesc.trim(), image: newProductImage || '', category: newProductCategory }
          : p
      );
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name: newProductName.trim(),
        brand: newProductBrand.trim() || 'Mi producto',
        description: newProductDesc.trim(),
        image: newProductImage || '',
        category: newProductCategory,
        isCustom: true,
      };
      updated = [...customProducts, newProduct];
    }
    
    setCustomProducts(updated);
    localStorage.setItem('customProducts', JSON.stringify(updated));
    
    if (newProductSupermarket && newProductPrice) {
      const allPrices = loadPricesFromStorage();
      allPrices[`${newProductName.trim()}_${newProductSupermarket}`] = parseFloat(newProductPrice);
      savePricesToStorage(allPrices);
      setManualPrices(allPrices);
    }
    
    setNewProductName('');
    setNewProductBrand('');
    setNewProductDesc('');
    setNewProductImage('');
    setNewProductCategory('');
    setNewProductSupermarket('');
    setNewProductPrice('');
    setShowAddProduct(false);
    setCustomProductToEdit(null);
    setSelectedProduct(null);
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
    if (categoryId === 'todos') {
      setLoading(true);
      setActiveCategory('todos');
      setSelectedProduct(null);
      setShowPriceForm(false);
      setHasSearched(true);
      setSearchTerm('');
      
      try {
        const results = await searchProductsOpenFoodFacts('leche');
        const combined = [...customProducts, ...results.slice(0, 8)];
        setProducts(combined);
      } catch (error) {
        setProducts(customProducts);
      } finally {
        setLoading(false);
      }
      return;
    }

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
        storedForProduct[key] = stored[key];
      }
    });
    setManualPrices(storedForProduct);
  };

  const handleEditProduct = (product, e) => {
    e.stopPropagation();
    setCustomProductToEdit(product);
    setNewProductName(product.name);
    setNewProductBrand(product.brand || '');
    setNewProductDesc(product.description || '');
    setNewProductImage(product.image || '');
    setNewProductCategory(product.category || '');
    setShowAddProduct(true);
  };

  const handleDeleteProduct = (product, e) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${product.name}"?`)) {
      deleteCustomProduct(product.id);
      setProducts(customProducts.filter(p => p.id !== product.id));
    }
  };

  const handleAddToList = async (product, e) => {
    e?.stopPropagation();
    
    if (!user) {
      showError('Inicia sesión para usar listas');
      return;
    }
    
    try {
      const { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../service/fireservice');
      
      const q = query(collection(db, 'listas'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      let listRef;
      
      if (snapshot.empty) {
        listRef = await addDoc(collection(db, 'listas'), {
          userId: user.uid,
          nombre: 'Mi Lista',
          lista: [{
            id: Date.now().toString(),
            producto: product.name,
            cantidad: 1,
            opciones: product.brand || '',
            opciones2: selectedProduct?.category || ''
          }],
          createdAt: serverTimestamp()
        });
        showSuccess('Nueva lista creada');
      } else {
        const listDoc = snapshot.docs[0];
        const existingLista = listDoc.data().lista || [];
        await import('firebase/firestore').then(({ doc, updateDoc }) => {
          return updateDoc(doc(db, 'listas', listDoc.id), {
            lista: [...existingLista, {
              id: Date.now().toString(),
              producto: product.name,
              cantidad: 1,
              opciones: product.brand || '',
              opciones2: selectedProduct?.category || ''
            }]
          });
        });
      }
      
      showSuccess(`${product.name} añadido a la lista`);
    } catch (error) {
      console.error('Error adding to list:', error);
      navigate('/lista');
    }
  };

  const handleAddManualPrice = (supermarketId, value) => {
    if (!selectedProduct) return;
    setManualPrices(prev => ({
      ...prev,
      [`${selectedProduct.name}_${supermarketId}`]: value ? parseFloat(value) : null
    }));
  };

  const handleSaveManualPrices = () => {
    if (!selectedProduct) return;

    const allPrices = loadPricesFromStorage();
    Object.entries(manualPrices)
      .filter(([key]) => key.startsWith(selectedProduct.name + '_'))
      .forEach(([key, price]) => {
        if (price !== null && price !== undefined && price !== '') {
          allPrices[key] = price;
        }
      });
    savePricesToStorage(allPrices);
    showSuccess('Precios guardados correctamente');
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
        price: manualPrices[key] ?? stored[key] ?? null,
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
      const price = manualPrices[key] ?? stored[key] ?? null;
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
    <Layout>
        <div className='precio-container'>
        <div className='precio-header'>
          <h1>COMPARADOR DE PRECIOS</h1>
          <p>Encuentra los mejores precios en supermercados de Valencia</p>
        </div>

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

          <div className='search-section'>
            <div className='search-layout'>
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
                      {loading ? '...' : 'BUSCAR'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className='categories-nav'>
              <button
                className={`category-btn ${activeCategory === 'todos' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('todos');
                  setProducts(customProducts);
                  setHasSearched(true);
                  setSelectedProduct(null);
                }}
              >
                <span className='cat-icon'>📋</span>
                <span className='cat-name'>Todos</span>
              </button>
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
              <button 
                className='category-btn add-product-btn'
                onClick={() => {
                  setShowAddProduct(!showAddProduct);
                  if (!showAddProduct) {
                    setCustomProductToEdit(null);
                    setNewProductName('');
                    setNewProductBrand('');
                    setNewProductDesc('');
                    setNewProductImage('');
                    setNewProductCategory('');
                    setNewProductSupermarket('');
                    setNewProductPrice('');
                  }
                }}
              >
                <span className='cat-icon'>➕</span>
                <span className='cat-name'>Nuevo</span>
              </button>
            </div>

            {showAddProduct && (
              <div className='add-product-form'>
                <h3>{customProductToEdit ? 'Editar producto' : 'Añadir mi propio producto'}</h3>
                <div className='custom-product-fields'>
                  <label className="image-upload-label">
                    {newProductImage ? (
                      <img src={newProductImage} alt="Preview" className="image-preview large" />
                    ) : (
                      <div className="image-placeholder-large">
                        <span>📷</span>
                        <p>Subir foto</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className='file-input'
                    />
                  </label>
                  
                  <label>
                    Nombre del producto:
                    <input
                      type="text"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Ej: Leche de almendra"
                    />
                  </label>
                  
                  <label>
                    Categoría:
                    <select 
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </label>
                  
                  <label>
                    Marca:
                    <input
                      type="text"
                      value={newProductBrand}
                      onChange={(e) => setNewProductBrand(e.target.value)}
                      placeholder="Mi marca"
                    />
                  </label>
                  
                  <label className="price-inline">
                    <select 
                      value={newProductSupermarket}
                      onChange={(e) => setNewProductSupermarket(e.target.value)}
                    >
                      <option value="">Supermercado</option>
                      {supermarkets.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      placeholder="0.00"
                    />
                    <span>€</span>
                  </label>
                  
                  <label>
                    Descripción:
                    <textarea
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      placeholder="Descripción o notas..."
                    />
                  </label>
                </div>
                <div className="form-buttons">
                  {customProductToEdit && (
                    <button 
                      className='delete-custom-btn'
                      onClick={() => {
                        deleteCustomProduct(customProductToEdit.id);
                        setShowAddProduct(false);
                        setCustomProductToEdit(null);
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                  <button 
                    className='save-custom-product-btn'
                    onClick={saveCustomProduct}
                    disabled={!newProductName.trim()}
                  >
                    {customProductToEdit ? '✓ Guardar cambios' : '✓ Crear producto'}
                  </button>
                </div>
              </div>
            )}
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
                    <div className="image-wrapper">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className='product-image'
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.product-image-placeholder').style.display = 'flex';
                        }}
                      />
                      <div className='product-image-placeholder'>
                        <span>🛒</span>
                      </div>
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
                <div className="selected-image-wrapper">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className='selected-image'
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.querySelector('.selected-image-placeholder').style.display = 'flex';
                    }}
                  />
                  <div className='selected-image-placeholder'>
                    <span>🛒</span>
                  </div>
                </div>
                <div className='selected-info'>
                  <h2>{selectedProduct.name}</h2>
                  <p className='product-brand'>{selectedProduct.brand}</p>
                  {selectedProduct.quantity && <p className='product-quantity'>{selectedProduct.quantity}</p>}
                </div>
              </div>

              <div className='selected-product-actions'>
                {selectedProduct.isCustom ? (
                  <>
                    <button 
                      className='selected-action-btn edit'
                      onClick={() => handleEditProduct(selectedProduct, { stopPropagation: () => {} })}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className='selected-action-btn delete'
                      onClick={() => handleDeleteProduct(selectedProduct, { stopPropagation: () => {} })}
                    >
                      🗑️ Eliminar
                    </button>
                  </>
                ) : (
                  <button 
                    className='selected-action-btn delete'
                    disabled
                    style={{ opacity: 0.5 }}
                  >
                    🗑️ Solo mis productos
                  </button>
                )}
                <button 
                  className='selected-action-btn list'
                  onClick={(e) => handleAddToList(selectedProduct, e)}
                >
                  📝 Añadir a Lista
                </button>
              </div>

              {showPriceForm && (
                <div className='manual-prices-form'>
                  <h4>Añade los precios que has visto:</h4>
                  <p className='form-hint'>Selecciona el supermercado e introduce el precio</p>
                  
                  <div className='price-input-row'>
                    <select 
                      className='supermarket-select'
                      value={newSupermarket}
                      onChange={(e) => setNewSupermarket(e.target.value)}
                    >
                      <option value="">Seleccionar supermercado</option>
                      {supermarkets.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    
                    <div className='price-input-group'>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className='price-input'
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                      />
                      <span>€</span>
                    </div>
                    
                    <button 
                      className='add-price-btn'
                      onClick={() => {
                        if (newSupermarket && newPrice) {
                          handleAddManualPrice(newSupermarket, newPrice);
                          setNewSupermarket('');
                          setNewPrice('');
                        }
                      }}
                    >
                      + Añadir
                    </button>
                  </div>

                  <button 
                    className='save-prices-button'
                    onClick={handleSaveManualPrices}
                    disabled={!hasAnyPrice()}
                  >
                    Guardar precios ({getPricesWithValues().length})
                  </button>
                </div>
              )}

              {hasAnyPrice() && selectedProduct && (
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
      </Layout>
    );
  };

export default Precio;
