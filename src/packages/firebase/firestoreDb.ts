// firestoreDb.ts
import { getConfig } from '@runtime/index';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

export let firestoreDb = null as unknown as ReturnType<typeof initializeFirestore>;

export const getDatabaseInstance = (firebaseApp: FirebaseApp) => {
  const config = getConfig();
  const firestoreName = config?.firebase.firestoreName;
  const useNamedDb = firestoreName && firestoreName !== 'default';
  // Only use databaseId if it's NOT "default"

  firestoreDb = initializeFirestore(firebaseApp, {
    ...(useNamedDb && { databaseId: firestoreName }),
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });

  console.log(
    `🔥 Firestore connected to ${
      useNamedDb ? `"${firestoreName}"` : 'default'
    } DB and offline support.`,
  );
};