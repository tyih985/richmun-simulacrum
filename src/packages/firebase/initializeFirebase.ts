import { FirebaseApp, initializeApp } from 'firebase/app';
import { getConfig } from '@runtime/index'; // Your config loader
import { getDatabaseInstance } from './firestoreDb';

let firebaseApp: FirebaseApp = null as unknown as FirebaseApp;

const initializeFirebase = (): void => {
  try {
    const config = getConfig();
    if (!config?.firebase) {
      console.error('❌ Firebase config is missing.', { config });
      throw new Error('Firebase config is missing.');
    }
    firebaseApp = initializeApp(config.firebase);
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
};

initializeFirebase();
if (firebaseApp) getDatabaseInstance(firebaseApp);

export default firebaseApp;
