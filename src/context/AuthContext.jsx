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
import { getUserProfile } from '../service/firestoreService';

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
  const profileLoaded = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user && !profileLoaded.current) {
        profileLoaded.current = true;
        try {
          const profile = await getUserProfile(user.uid);
          if (profile && profile.displayName) {
            setUserDisplayName(profile.displayName);
          } else {
            setUserDisplayName(user.displayName || user?.email?.split('@')[0] || 'Usuario');
          }
        } catch (e) {
          console.error('Error loading profile:', e);
          setUserDisplayName(user?.email?.split('@')[0] || 'Usuario');
        }
      } else if (!user) {
        setUserDisplayName(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password, displayName) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => updateProfile(userCredential.user, { displayName })
        .then(() => userCredential));
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    userDisplayName,
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
