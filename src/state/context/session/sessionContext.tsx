import { createContext } from 'react';
import { User } from 'firebase/auth';

export type SessionType = {
  isChecking: boolean;
  isLoggedIn: boolean;
  isEulaSigned?: boolean;
  sessionUser?: User | null;
  sessionLocalPersistence: boolean;
  
  logout: () => Promise<void>;
  refreshUser: () => void;
  toggleSessionLocalPersistence: () => void;
};

const defaultSession: SessionType = {
  isChecking: true,
  isLoggedIn: false,
  sessionUser: null,
  sessionLocalPersistence: true,
  logout: async () => {},
  refreshUser: () => {},
  toggleSessionLocalPersistence: () => {},
};

export const SessionContext = createContext<SessionType>(defaultSession);
