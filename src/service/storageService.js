export const loadPricesFromStorage = () => {
  try {
    const stored = localStorage.getItem('customPrices');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const savePricesToStorage = (prices) => {
  try {
    localStorage.setItem('customPrices', JSON.stringify(prices));
  } catch (e) {
    console.error('Error saving prices:', e);
  }
};

export const setStoredPrice = (productName, supermarketId, price) => {
  const stored = loadPricesFromStorage();
  const key = `${productName}_${supermarketId}`;
  stored[key] = price;
  savePricesToStorage(stored);
};

export const getStoredPrice = (productName, supermarketId) => {
  const stored = loadPricesFromStorage();
  const key = `${productName}_${supermarketId}`;
  return stored[key];
};

export const clearStoredPrices = () => {
  localStorage.removeItem('customPrices');
};

export const getAllStoredPrices = () => {
  return loadPricesFromStorage();
};