import React, { useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User,
} from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { auth } from '@packages/firebase/firebaseAuth';
import { SessionContext } from '@context/sessionContext';

export type Session = {
  isChecking: boolean;
  isLoggedIn: boolean;
  isEulaSigned?: boolean;
  sessionUser?: User | null;
  sessionLocalPersistence: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
  toggleSessionLocalPersistence: () => void;
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sessionUser, setSessionUser] = useState<User>();
  const [sessionLocalPersistence, setSessionLocalPersistence] = useState<boolean>(true);

  // Monitor the Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setSessionUser(user);
        setIsChecking(false);
      } else {
        setIsLoggedIn(false);
        setSessionUser(undefined);
        setIsChecking(false);
      }
    });
    return unsubscribe; // Clean up the listener on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Function to log out the user
  const logout = async () => {
    await auth.signOut();
    queryClient.clear();
    setIsLoggedIn(false);
    setSessionUser(undefined);
  };

  // Function to refresh the user (e.g., re-fetch the user data)
  const refreshUser = () => {
    if (auth.currentUser) {
      setSessionUser(auth.currentUser);
    }
  };

  // Toggle between local and session persistence
  const toggleSessionLocalPersistence = () => {
    const newPersistence = !sessionLocalPersistence;
    setSessionLocalPersistence(newPersistence);

    const persistenceType = newPersistence
      ? browserLocalPersistence
      : browserSessionPersistence;

    setPersistence(auth, persistenceType).catch((error) => {
      console.error('Error setting persistence:', error);
    });
  };

  return (
    <SessionContext.Provider
      value={{
        isChecking,
        isLoggedIn,
        sessionUser,
        sessionLocalPersistence,
        logout,
        refreshUser,
        toggleSessionLocalPersistence,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
