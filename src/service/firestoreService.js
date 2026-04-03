import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './fireservice';

export const FIRESTORE_COLLECTIONS = {
  TICKETS: 'tickets',
  SHOPPING_LISTS: 'shoppingLists',
  PRICES: 'prices',
  USER_PROFILES: 'userProfiles',
};

export const addTicket = async (ticketData) => {
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.TICKETS), {
    ...ticketData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...ticketData };
};

export const getTickets = async (userId) => {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.TICKETS),
    where('userId', '==', userId),
    orderBy('fecha', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTicket = async (ticketId, data) => {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.TICKETS, ticketId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteTicket = async (ticketId) => {
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.TICKETS, ticketId));
};

export const addShoppingList = async (listData) => {
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.SHOPPING_LISTS), {
    ...listData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...listData };
};

export const getShoppingLists = async (userId) => {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.SHOPPING_LISTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteShoppingList = async (listId) => {
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.SHOPPING_LISTS, listId));
};

export const addPrice = async (priceData) => {
  const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.PRICES), {
    ...priceData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...priceData };
};

export const getPrices = async (userId) => {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.PRICES),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePrice = async (priceId, data) => {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.PRICES, priceId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deletePrice = async (priceId) => {
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.PRICES, priceId));
};

export const getUserProfile = async (userId) => {
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
