import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './fireservice';

export const FIRESTORE_COLLECTIONS = {
  TICKETS: 'tickets',
  SHOPPING_LISTS: 'shoppingLists',
  PRICES: 'prices',
  USER_PROFILES: 'userProfiles',
};

const validateUserId = (userId, dataUserId) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId inválido');
  }
  if (dataUserId !== userId) {
    throw new Error('No tienes permiso para realizar esta operación');
  }
};

export const addTicket = async (ticketData, userId) => {
  if (!ticketData || typeof ticketData !== 'object') {
    throw new Error('Datos de ticket inválidos');
  }
  validateUserId(userId, ticketData.userId);
  if (typeof ticketData.cantidad !== 'number' || ticketData.cantidad < 0) {
    throw new Error('Cantidad inválida');
  }
  if (!ticketData.opcion || typeof ticketData.opcion !== 'string') {
    throw new Error('Opción inválida');
  }
  if (!ticketData.fecha || typeof ticketData.fecha !== 'string') {
    throw new Error('Fecha inválida');
  }
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.TICKETS), {
    userId: ticketData.userId,
    cantidad: ticketData.cantidad,
    opcion: ticketData.opcion,
    fecha: ticketData.fecha,
    createdAt: serverTimestamp(),
  });
  return { 
    id: docRef.id, 
    userId: ticketData.userId,
    cantidad: ticketData.cantidad,
    opcion: ticketData.opcion,
    fecha: ticketData.fecha 
  };
};

export const getTickets = async (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId inválido');
  }
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.TICKETS),
    where('userId', '==', userId),
    orderBy('fecha', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTicket = async (ticketId, data, userId) => {
  if (!ticketId || typeof ticketId !== 'string') {
    throw new Error('ticketId inválido');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId requerido');
  }
  const docRef = doc(db, FIRESTORE_COLLECTIONS.TICKETS, ticketId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteTicket = async (ticketId, userId) => {
  if (!ticketId || typeof ticketId !== 'string') {
    throw new Error('ticketId inválido');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId requerido');
  }
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.TICKETS, ticketId));
};

export const addShoppingList = async (listData, userId) => {
  if (!listData || typeof listData !== 'object') {
    throw new Error('Datos de lista inválidos');
  }
  validateUserId(userId, listData.userId);
  if (!listData.nombre || typeof listData.nombre !== 'string') {
    throw new Error('Nombre inválido');
  }
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.SHOPPING_LISTS), {
    userId: listData.userId,
    lista: listData.lista,
    fecha: listData.fecha,
    nombre: listData.nombre,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...listData };
};

export const getShoppingLists = async (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId inválido');
  }
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.SHOPPING_LISTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteShoppingList = async (listId, userId) => {
  if (!listId || typeof listId !== 'string') {
    throw new Error('listId inválido');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId requerido');
  }
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.SHOPPING_LISTS, listId));
};

export const addPrice = async (priceData, userId) => {
  if (!priceData || typeof priceData !== 'object') {
    throw new Error('Datos de precio inválidos');
  }
  validateUserId(userId, priceData.userId);
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.PRICES), {
    ...priceData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...priceData };
};

export const getPrices = async (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId inválido');
  }
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.PRICES),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePrice = async (priceId, data, userId) => {
  if (!priceId || typeof priceId !== 'string') {
    throw new Error('priceId inválido');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId requerido');
  }
  const docRef = doc(db, FIRESTORE_COLLECTIONS.PRICES, priceId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deletePrice = async (priceId, userId) => {
  if (!priceId || typeof priceId !== 'string') {
    throw new Error('priceId inválido');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId requerido');
  }
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.PRICES, priceId));
};

export const getUserProfile = async (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId inválido');
  }
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.USER_PROFILES),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
};

export const saveUserProfile = async (userId, profileData) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId inválido');
  }
  if (!profileData || typeof profileData !== 'object') {
    throw new Error('Datos de perfil inválidos');
  }
  const existingProfile = await getUserProfile(userId);
  
  if (existingProfile) {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.USER_PROFILES, existingProfile.id);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return { id: existingProfile.id, ...profileData };
  } else {
    const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.USER_PROFILES), {
      ...profileData,
      userId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...profileData };
  }
};

export const createUserProfile = async (profileData) => {
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.USER_PROFILES), {
    ...profileData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...profileData };
};

export const updateUserProfile = async (profileId, data) => {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.USER_PROFILES, profileId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const FIRESTORE_COLLECTIONS_SUGERENCIAS = 'sugerencias';

export const addSugerencia = async (sugerenciaData) => {
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS_SUGERENCIAS), {
    ...sugerenciaData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...sugerenciaData };
};

export const getSugerencias = async () => {
  const q = query(collection(db, FIRESTORE_COLLECTIONS_SUGERENCIAS), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
