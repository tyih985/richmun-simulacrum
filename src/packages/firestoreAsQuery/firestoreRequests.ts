import { firestoreDb } from '@packages/firebase/firestoreDb';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  FirestoreError,
  deleteDoc,
  writeBatch,
  collection,
  getDocs,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';

export const createFirestoreDocument = async <T>(
  path: string,
  data: T,
  merge: boolean = false, // merge with existing document data
): Promise<void> => {
  try {
    if (!path || !data)
      throw new Error('Invalid path or data for Firestore document creation.');

    const docRef = doc(firestoreDb, path);
    await setDoc(docRef, { ...data, createdAt: serverTimestamp() }, { merge });

    console.log(`Document ${merge ? 'updated' : 'created'} at: ${path}`);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error(`Error creating document at ${path}:`, firestoreError.message);
    throw firestoreError;
  }
};

export const updateFirestoreDocument = async <T>(
  path: string,
  data: Partial<T>,
): Promise<void> => {
  return createFirestoreDocument(path, data, true);
};

export const deleteFirestoreDocument = async (path: string): Promise<void> => {
  try {
    if (!path) throw new Error('Invalid path for Firestore document deletion.');

    const docRef = doc(firestoreDb, path);
    await deleteDoc(docRef);

    console.log(`Document deleted at: ${path}`);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error(`Error deleting document at ${path}:`, firestoreError.message);
    throw firestoreError;
  }
};

export const getFirestoreDocument = async <T>(path: string): Promise<T | null> => {
  try {
    if (!path) throw new Error('Invalid path for Firestore document fetch.');

    const docRef = doc(firestoreDb, path);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Document fetched at: ${path}`);
      return docSnap.data() as T;
    } else {
      console.log(`No document exists at: ${path}`);
      return null;
    }
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error(`Error fetching document at ${path}:`, firestoreError.message);
    throw firestoreError;
  }
};

// this function ensures atomic udpates, use this instead of Promise.all
export type BatchRequest = {
  path: string;
  data?: Record<string, unknown>;
  op?: 'update' | 'delete';
};
export const batchUpdateDocuments = async (requests: BatchRequest[]) => {
  try {
    const batch = writeBatch(firestoreDb);

    requests.forEach(({ path, data, op }) => {
      const docRef = doc(firestoreDb, path);
      if (!op || op === 'update') batch.set(docRef, data as never, { merge: true });
      else if (op === 'delete') batch.delete(docRef);
    });

    await batch.commit();
    console.log(`Batch update completed for ${requests.length} documents`);
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error('Error performing batch update:', firestoreError.message);
    throw firestoreError;
  }
};

export const getFirestoreCollection = async <T extends DocumentData>(
  collectionPath: string,
): Promise<T[]> => {
  try {
    if (!collectionPath) throw new Error('Invalid path for Firestore collection fetch.');

    const collectionRef = collection(
      firestoreDb,
      collectionPath,
    ) as CollectionReference<T>;
    const querySnapshot = await getDocs(collectionRef);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));

    console.log(
      `Fetched ${documents.length} documents from collection: ${collectionPath}`,
    );
    return documents;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error(
      `Error fetching collection at ${collectionPath}:`,
      firestoreError.message,
    );
    throw firestoreError;
  }
};
export const getFirestoreCollectionKeys = async (
  collectionPath: string,
): Promise<string[]> => {
  try {
    if (!collectionPath) throw new Error('Invalid path for Firestore collection fetch.');

    const collectionRef = collection(firestoreDb, collectionPath);
    const querySnapshot = await getDocs(collectionRef);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const documentKeys = querySnapshot.docs.map((doc: any) => doc.id as string);
    console.log(`Fetched ${documentKeys.length} keys from collection: ${collectionPath}`);
    return documentKeys;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error(
      `Error fetching collection keys at ${collectionPath}:`,
      firestoreError.message,
    );
    throw firestoreError;
  }
};
