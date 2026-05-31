import { db } from './fireservice';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const initialPrices = [
  { name: 'Leche Entera 1L', prices: { mercadona: 0.91, carrefour: 0.92, lidl: 0.90, dia: 0.91 } },
  { name: 'Huevos L (12 uds)', prices: { mercadona: 2.25, carrefour: 2.35, lidl: 2.20, dia: 2.25 } },
  { name: 'Aceite de Oliva VE 1L', prices: { mercadona: 9.25, carrefour: 9.50, lidl: 8.95, dia: 9.10 } },
  { name: 'Arroz Bomba 1kg', prices: { mercadona: 1.35, carrefour: 1.40, lidl: 1.30, dia: 1.35 } },
  { name: 'Pechuga de Pollo 1kg', prices: { mercadona: 7.50, carrefour: 7.25, lidl: 6.95, dia: 7.40 } },
  { name: 'Detergente Líquido 50 lavados', prices: { mercadona: 4.50, carrefour: 4.95, lidl: 3.99, dia: 4.25 } },
  { name: 'Pan de Molde Integral', prices: { mercadona: 1.25, carrefour: 1.30, lidl: 1.15, dia: 1.20 } },
  { name: 'Papel Higiénico (12 rollos)', prices: { mercadona: 3.40, carrefour: 3.60, lidl: 3.20, dia: 3.30 } },
  { name: 'Plátano de Canarias 1kg', prices: { mercadona: 1.99, carrefour: 2.10, lidl: 1.85, dia: 1.95 } }
];

export const seedGlobalPrices = async () => {
  console.log('Iniciando población de precios...');
  try {
    for (const item of initialPrices) {
      for (const [superId, price] of Object.entries(item.prices)) {
        const docId = `${item.name.replace(/\s+/g, '_')}_${superId}`;
        await setDoc(doc(db, 'global_prices', docId), {
          productName: item.name,
          supermarketId: superId,
          price: price,
          updatedAt: serverTimestamp()
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error poblando precios:', error);
    return false;
  }
};
