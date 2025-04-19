import { getAuth } from 'firebase/auth';
import './initializeFirebase';

export const auth = getAuth();

const JWT_TOKEN_LIFESPAN = 3600000; // 1 hour
type JwtToken = string;
type AuthInstance = {
  token: JwtToken;
  timestamp: Date;
};

const isAuthExpired = (auth: AuthInstance): boolean => {
  const now = new Date();
  return now.getTime() - auth.timestamp.getTime() > JWT_TOKEN_LIFESPAN;
};

const refreshAuthToken = async (): Promise<JwtToken> => {
  if (!auth.currentUser) {
    throw new Error('User is not logged in');
  }
  const token = await auth.currentUser.getIdToken(true);
  cachedAuthToken = { token, timestamp: new Date() }; // Update the cache with the new token
  return token;
};

let cachedAuthToken: AuthInstance | null = null;

export const getAuthToken = async (): Promise<JwtToken> => {
  if (cachedAuthToken && !isAuthExpired(cachedAuthToken)) {
    return cachedAuthToken.token; // Return the cached token if it's still valid
  }

  try {
    return await refreshAuthToken();
  } catch (error) {
    console.error('Error fetching token:', error);
    return refreshAuthToken();
  }
};
