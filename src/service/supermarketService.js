import { loadPricesFromStorage } from './storageService';

export const supermarkets = [
  { id: 'mercadona', name: 'Mercadona', logo: '🛒', color: '#DA291C' },
  { id: 'carrefour', name: 'Carrefour', logo: '🛒', color: '#004F9F' },
  { id: 'lidl', name: 'LIDL', logo: '🛒', color: '#00529B' },
  { id: 'dia', name: 'Dia', logo: '🛒', color: '#E30613' },
  { id: 'eroski', name: 'Eroski', logo: '🛒', color: '#007B3D' },
  { id: 'consum', name: 'Consum', logo: '🛒', color: '#FF6600' },
  { id: 'aldi', name: 'Aldi', logo: '🛒', color: '#003399' },
];

const OPEN_FOOD_FACTS_API = 'https://es.openfoodfacts.org';

export const categories = [
  { id: 'leche', name: 'Leche', icon: '🥛', searchTerms: ['leche fresca', 'leche entera', 'leche semidescremada'] },
  { id: 'yogur', name: 'Yogur', icon: '🥛', searchTerms: ['yogur natural', 'yogur griego', 'yogur frutas'] },
  { id: 'queso', name: 'Queso', icon: '🧀', searchTerms: ['queso mozzarella', 'queso cheddar', 'queso havanti'] },
  { id: 'pollo', name: 'Pollo', icon: '🥩', searchTerms: ['pollo entero', 'pechuga pollo', 'muslos pollo'] },
  { id: 'cerdo', name: 'Cerdo', icon: '🥓', searchTerms: ['filete cerdo', 'lomo cerdo', 'paleta cerdo'] },
  { id: 'merluza', name: 'Pescado', icon: '🐟', searchTerms: ['merluza fresca', 'salmón fresco', 'filete merluza'] },
  { id: 'manzana', name: 'Fruta', icon: '🍎', searchTerms: ['manzana roja', 'plátano canario', 'naranja Valencia'] },
  { id: 'tomate', name: 'Verdura', icon: '🍅', searchTerms: ['tomate raff', 'patata gallega', 'cebolla blanca'] },
  { id: 'pan', name: 'Pan', icon: '🍞', searchTerms: ['pan integral', 'baguette francesa', 'pan candeal'] },
  { id: 'agua', name: 'Agua', icon: '💧', searchTerms: ['agua mineral', 'agua sin gas', 'agua con gas'] },
  { id: 'aceite', name: 'Aceite', icon: '🫒', searchTerms: ['aceite oliva virgen', 'aceite girasol', 'aceite orujo'] },
  { id: 'arroz', name: 'Arroz', icon: '🍚', searchTerms: ['arroz bomba', 'arroz Basmati', 'arroz redondo'] },
];

const normalizeProductName = (name) => {
  if (!name) return '';
  return name
    .replace(/[^\w\sáéíóúñÁÉÍÓÚÑ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const filterSpanishProducts = (products, searchTerm = '') => {
  const spanishBrands = [
    'mercadona', 'carrefour', 'dia', 'eroski', 'lidl', 'aldi', 'consum',
    'el corte inglés', 'hipercor', 'bonarea', 'coviran',
    'pascual', 'danone', 'nestlé'
  ];
  
  if (!searchTerm) {
    return products.slice(0, 12);
  }
  
  const busquedaNormalizada = searchTerm.toLowerCase().trim();
  
  const productsConPuntuacion = products.map(p => {
    let puntos = 0;
    const texto = (p.name + ' ' + p.brand).toLowerCase();
    
    if (spanishBrands.some(b => texto.includes(b))) puntos += 15;
    if (texto.includes(busquedaNormalizada)) puntos += 20;
    if (texto.startsWith(busquedaNormalizada)) puntos += 10;
    if (p.image?.length > 10) puntos += 3;
    if (p.name?.length > 5 && p.name?.length < 50) puntos += 1;
    
    return { ...p, puntos };
  });
  
  productsConPuntuacion.sort((a, b) => b.puntos - a.puntos);
  
  return productsConPuntuacion.slice(0, 12);
};

export const searchProductsOpenFoodFacts = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_API}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=15&fields=product_name,brands,image_front_url,quantity,categories`
    );
    
    const data = await response.json();
    
    if (data.products) {
      const products = data.products
        .filter(p => p.product_name && p.image_front_url && p.product_name.length > 3)
        .map(product => ({
          name: normalizeProductName(product.product_name),
          brand: product.brands || 'Sin marca',
          image: product.image_front_url,
          category: product.categories?.split(',')[0] || '',
          quantity: product.quantity || '',
        }));
      
      return filterSpanishProducts(products, query);
    }
    
    return [];
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return [];
  
  const searchTerm = category.searchTerms[0];
  
  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_API}/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=15&fields=product_name,brands,image_front_url,quantity,categories`
    );
    
    const data = await response.json();
    
    if (data.products) {
      const products = data.products
        .filter(p => p.product_name && p.image_front_url && p.product_name.length > 3)
        .map(product => ({
          name: normalizeProductName(product.product_name),
          brand: product.brands || 'Sin marca',
          image: product.image_front_url,
          category: product.categories?.split(',')[0] || '',
          quantity: product.quantity || '',
        }));
      
      return filterSpanishProducts(products, searchTerm);
    }
    
    return [];
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return [];
  }
};

export const getProductWithStoredPrices = (productName) => {
  const stored = loadPricesFromStorage();
  const prices = supermarkets.map(supermarket => {
    const key = `${productName}_${supermarket.id}`;
    const price = stored[key];
    return {
      supermarket: supermarket.name,
      id: supermarket.id,
      price: price || null,
      unit: 'ud',
      logo: supermarket.logo,
      color: supermarket.color,
      hasPrice: price !== null && price !== undefined,
    };
  });
  return prices;
};