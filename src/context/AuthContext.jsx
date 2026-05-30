import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../service/fireservice';
import { getUserProfile, getTickets } from '../service/firestoreService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const profileLoaded = useRef(false);

  const refreshData = async (userId) => {
    if (!userId) return;

    // Solo mostramos el spinner de carga si no tenemos ningún dato previo
    // Esto evita que la pantalla "salte" al navegar
    const isFirstLoad = tickets.length === 0 && !userProfile;
    if (isFirstLoad) setLoadingData(true);

    try {
      const [profile, ticketsData] = await Promise.all([
        getUserProfile(userId),
        getTickets(userId)
      ]);

      setUserProfile(profile);
      setTickets(ticketsData);

      if (profile && profile.displayName) {
        setUserDisplayName(profile.displayName);
      } else {
        // Intentar obtener el nombre del objeto user de Firebase si no hay perfil en Firestore
        const currentUser = auth.currentUser;
        const nameFromEmail = currentUser?.email ? currentUser.email.split('@')[0] : 'Usuario';
        setUserDisplayName(currentUser?.displayName || nameFromEmail);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // ESPERAR a que los datos estén cargados antes de quitar el 'loading' inicial
        // Esto evita que la app parpadee al entrar
        await refreshData(currentUser.uid);
      } else {
        setUser(currentUser);
        setUserDisplayName(null);
        setUserProfile(null);
        setTickets([]);
        profileLoaded.current = false;
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const value = {
    user,
    userDisplayName,
    userProfile,
    // INYECCIÓN DE SUPER USUARIO (PREMIUM TOTAL) PARA TU CUENTA
    isPremium: user?.email?.toLowerCase() === 'mendoseba_@hotmail.com' || userProfile?.isPremium === true,
    tickets,
    loadingData,
    refreshData: () => refreshData(user?.uid),
    login,
    register,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
