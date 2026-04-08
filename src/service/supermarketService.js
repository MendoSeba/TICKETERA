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
  { id: 'lacteos', name: 'Lácteos', icon: '🥛', searchTerms: ['leche', 'yogur', 'queso'] },
  { id: 'carne', name: 'Carne', icon: '🥩', searchTerms: ['pollo', 'ternera', 'cerdo'] },
  { id: 'pescado', name: 'Pescado', icon: '🐟', searchTerms: ['merluza', 'salmón', 'atún'] },
  { id: 'fruta', name: 'Fruta', icon: '🍎', searchTerms: ['manzana', 'plátano', 'naranja'] },
  { id: 'verdura', name: 'Verdura', icon: '🥬', searchTerms: ['tomate', 'lechuga', 'patata'] },
  { id: 'panaderia', name: 'Panadería', icon: '🍞', searchTerms: ['pan', 'baguette'] },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤', searchTerms: ['agua', 'zumo', 'cerveza'] },
  { id: 'aceites', name: 'Aceites', icon: '🫒', searchTerms: ['aceite de oliva'] },
  { id: 'arroz', name: 'Arroz y Pasta', icon: '🍚', searchTerms: ['arroz', 'pasta', 'legumbres'] },
  { id: 'huevos', name: 'Huevos', icon: '🥚', searchTerms: ['huevos'] },
  { id: 'azucar', name: 'Azúcar', icon: '🍬', searchTerms: ['azúcar', 'miel'] },
  { id: 'cafe', name: 'Café', icon: '☕', searchTerms: ['café', 'té'] },
];

const normalizeProductName = (name) => {
  if (!name) return '';
  return name
    .replace(/[^\w\sáéíóúñÁÉÍÓÚÑ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const filterSpanishProducts = (products) => {
  const spanishBrands = [
    'mercadona', 'carrefour', 'dia', 'eroski', 'lidl', 'aldi', 'consum',
    'el corte inglés', 'hipercor', 'alcampo', 'bonarea', 'coviran',
    'el pozo', 'campofrío', 'gallina blanca', 'hacendado', 'pascual',
    'danone', 'nestlé', 'coca-cola', 'heineken', 'estrella'
  ];
  
  const spanishTerms = ['españa', 'espana', 'spain', 'es'];
  
  const filtered = products.filter(p => {
    const text = [
      p.product_name,
      p.brands,
      p.countries,
      p.categories
    ].join(' ').toLowerCase();
    
    return spanishBrands.some(b => text.includes(b)) || 
           spanishTerms.some(t => text.includes(t)) ||
           text.includes('español') || text.includes('valencia');
  });
  
  if (filtered.length >= 3) return filtered.slice(0, 8);
  
  return products.slice(0, 10);
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
      
      return filterSpanishProducts(products);
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
  
  const results = [];
  
  for (const term of category.searchTerms.slice(0, 2)) {
    const products = await searchProductsOpenFoodFacts(term);
    results.push(...products);
  }
  
  const unique = results.reduce((acc, product) => {
    if (!acc.find(p => p.name === product.name)) {
      acc.push(product);
    }
    return acc;
  }, []);
  
  return unique.slice(0, 12);
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