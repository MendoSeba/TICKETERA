import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export const REVENUECAT_CONFIG = {
  GOOGLE_API_KEY: 'goog_YOUR_API_KEY', // Reemplazar con la clave real de Google Play
  ENTITLEMENT_ID: 'premium'
};

export const initRevenueCat = async (userId) => {
  if (Capacitor.getPlatform() === 'web') return;

  try {
    await Purchases.configure({
      apiKey: REVENUECAT_CONFIG.GOOGLE_API_KEY,
      appUserID: userId,
    });
    console.log('RevenueCat configurado');
  } catch (e) {
    console.error('Error al configurar RevenueCat:', e);
  }
};

export const checkPremiumStatus = async () => {
  if (Capacitor.getPlatform() === 'web') return false;

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.error('Error al verificar estado Premium:', e);
    return false;
  }
};

export const getOfferings = async () => {
  if (Capacitor.getPlatform() === 'web') return null;

  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (e) {
    console.error('Error al obtener ofertas:', e);
    return null;
  }
};

export const purchaseProduct = async (pkg) => {
  if (Capacitor.getPlatform() === 'web') return false;

  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return customerInfo.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    if (!e.userCancelled) {
      console.error('Error en la compra:', e);
    }
    return false;
  }
};
