import { loadPricesFromStorage } from './storageService';
import { db } from './fireservice';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const supermarkets = [
  { id: 'mercadona', name: 'Mercadona', logo: '🛒', color: '#219653' }, // Verde
  { id: 'carrefour', name: 'Carrefour', logo: '🛒', color: '#004F9F' }, // Azul
  { id: 'lidl', name: 'LIDL', logo: '🛒', color: '#FFD700' }, // Amarillo
  { id: 'dia', name: 'Dia', logo: '🛒', color: '#E30613' }, // Rojo
  { id: 'eroski', name: 'Eroski', logo: '🛒', color: '#005CA9' }, // Azul
  { id: 'consum', name: 'Consum', logo: '🛒', color: '#FF6600' }, // Naranja
  { id: 'charter', name: 'Charter', logo: '🛒', color: '#d32f2f' }, // Rojo Charter
  { id: 'aldi', name: 'Aldi', logo: '🛒', color: '#002C95' }, // Azul Aldi
  { id: 'alcampo', name: 'Alcampo', logo: '🛒', color: '#ED1C24' },
  { id: 'hipercor', name: 'Hipercor', logo: '🛒', color: '#006B3E' },
  { id: 'bonarea', name: 'BonArea', logo: '🛒', color: '#E2001A' },
];

export const getSuperColor = (name) => {
  if (!name) return '#94a3b8';

  const s = supermarkets.find(sup => sup.name.toLowerCase() === name.toLowerCase());
  if (s) return s.color;

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org';

export const categories = [
  { id: 'leche', name: 'Leche', icon: '🥛', searchTerms: ['leche entera', 'leche sin lactosa', 'bebida avena'] },
  { id: 'yogur', name: 'Yogures', icon: '🍦', searchTerms: ['yogur natural', 'yogur griego', 'bifidus'] },
  { id: 'queso', name: 'Quesos', icon: '🧀', searchTerms: ['queso rallado', 'queso tierno', 'queso lonchas'] },
  { id: 'carne', name: 'Carnes', icon: '🥩', searchTerms: ['pechuga pollo', 'carne picada vacuno', 'lomo cerdo'] },
  { id: 'embutido', name: 'Embutidos', icon: '🥓', searchTerms: ['jamon cocido', 'chorizo', 'salchichon'] },
  { id: 'pescado', name: 'Pescado', icon: '🐟', searchTerms: ['atun conserva', 'merluza congelada', 'salmon'] },
  { id: 'fruta', name: 'Fruta/Verdura', icon: '🍎', searchTerms: ['platano canario', 'manzana roja', 'tomate ensalada'] },
  { id: 'despensa', name: 'Despensa', icon: '🥫', searchTerms: ['aceite oliva virgen extra', 'arroz bomba', 'pasta'] },
  { id: 'pan', name: 'Pan/Bollería', icon: '🍞', searchTerms: ['pan molde integral', 'baguette', 'croissants'] },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤', searchTerms: ['agua mineral', 'refresco cola', 'cerveza'] },
  { id: 'limpieza', name: 'Limpieza', icon: '🧼', searchTerms: ['detergente ropa', 'lavavajillas', 'limpiador hogar'] },
  { id: 'higiene', name: 'Higiene', icon: '🪥', searchTerms: ['champu', 'gel baño', 'pasta dientes'] },
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
    'mercadona', 'hacendado', 'carrefour', 'dia', 'eroski', 'lidl', 'aldi', 'consum',
    'el corte inglés', 'hipercor', 'bonarea', 'coviran', 'deliplus', 'bosque verde',
    'pascual', 'danone', 'nestlé', 'campofrío', 'elpozo', 'pescanova'
  ];

  const busquedaNormalizada = searchTerm.toLowerCase().trim();

  return products
    .map(p => {
      let puntos = 0;
      const texto = (p.name + ' ' + p.brand).toLowerCase();
      if (spanishBrands.some(b => texto.includes(b))) puntos += 25;
      if (texto.includes(busquedaNormalizada)) puntos += 20;
      if (texto.startsWith(busquedaNormalizada)) puntos += 10;
      if (p.hasImage) puntos += 10;
      if (p.quantity) puntos += 5;
      return { ...p, puntos };
    })
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 24);
};

export const searchProductsOpenFoodFacts = async (query) => {
  if (!query || query.length < 2) return [];
  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_API}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=50&fields=product_name,brands,image_front_url,image_url,quantity,categories,countries_tags&tagtype_0=countries&tag_contains_0=contains&tag_0=spain`
    );
    const data = await response.json();
    if (data.products) {
      const products = data.products
        .filter(p => p.product_name && p.product_name.length > 2)
        .map(product => ({
          name: normalizeProductName(product.product_name),
          brand: product.brands || 'Marca blanca / Genérico',
          image: product.image_front_url || product.image_url || '',
          category: product.categories?.split(',')[0] || '',
          quantity: product.quantity || '',
          hasImage: !!(product.image_front_url || product.image_url)
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
      `${OPEN_FOOD_FACTS_API}/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=40&fields=product_name,brands,image_front_url,image_url,quantity,categories,countries_tags&tagtype_0=countries&tag_contains_0=contains&tag_0=spain`
    );
    const data = await response.json();
    if (data.products) {
      const products = data.products
        .filter(p => p.product_name && (p.image_front_url || p.image_url))
        .map(product => ({
          name: normalizeProductName(product.product_name),
          brand: product.brands || 'Sin marca',
          image: product.image_front_url || product.image_url,
          category: category.name,
          quantity: product.quantity || '',
          hasImage: true
        }));
      return filterSpanishProducts(products, searchTerm);
    }
    return [];
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return [];
  }
};

export const getSupermarketSearchUrl = (supermarketId, productName) => {
  const encodedName = encodeURIComponent(productName);
  switch (supermarketId) {
    case 'mercadona': return `https://tienda.mercadona.es/search-results?query=${encodedName}`;
    case 'carrefour': return `https://www.carrefour.es/?q=${encodedName}`;
    case 'dia': return `https://www.dia.es/compra-online/search?text=${encodedName}`;
    case 'lidl': return `https://www.lidl.es/es/search?query=${encodedName}`;
    case 'alcampo': return `https://www.alcampo.es/compra-online/search/?text=${encodedName}`;
    case 'eroski': return `https://supermercado.eroski.es/es/buscar/?q=${encodedName}`;
    case 'hipercor': return `https://www.elcorteingles.es/supermercado/buscar/?term=${encodedName}`;
    default: return `https://www.google.com/search?q=precio+${encodedName}+${supermarketId}`;
  }
};

export const getProductWithStoredPrices = async (productName) => {
  const stored = loadPricesFromStorage();

  // 1. Intentar obtener precios de la Nube (Firestore)
  let cloudPrices = {};
  try {
    const q = query(collection(db, 'global_prices'), where('productName', '==', productName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cloudPrices[data.supermarketId] = data.price;
    });
  } catch (e) {
    console.error("Error al obtener precios de la nube:", e);
  }

  // 2. Combinar con los locales (los locales tienen prioridad por ser del usuario)
  const prices = supermarkets.map(supermarket => {
    const key = `${productName}_${supermarket.id}`;
    const localPrice = stored[key];
    const cloudPrice = cloudPrices[supermarket.id];
    const finalPrice = localPrice || cloudPrice || null;

    return {
      supermarket: supermarket.name,
      id: supermarket.id,
      price: finalPrice,
      unit: 'ud',
      logo: supermarket.logo,
      color: supermarket.color,
      hasPrice: finalPrice !== null && finalPrice !== undefined,
    };
  });
  return prices;
};
