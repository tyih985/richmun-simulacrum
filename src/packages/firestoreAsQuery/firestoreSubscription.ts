import { useEffect } from 'react';
import {
  collection,
  doc,
  query,
  onSnapshot,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
  DocumentData,
  orderBy,
} from 'firebase/firestore';
import { useFirestoreQuery } from './useQuery';
import { FirestoreQueryState } from './types';
import { firestoreDb } from '@packages/firebase/firestoreDb';

type FirestoreQueryOptions = {
  enabled?: boolean;
  sortBy?: boolean | string;
};

export const useFirestoreCollectionQuery = <T extends DocumentData>(
  path: string,
  options: FirestoreQueryOptions = {},
): FirestoreQueryState<T[]> => {
  const { enabled = true, sortBy = false } = options;
  const sortByIndex = typeof sortBy === 'string' ? sortBy : 'index';
  const [state, dispatch] = useFirestoreQuery<T[]>();

  useEffect(() => {
    if (!enabled || !path) return;

    const colRef: CollectionReference<T> = collection(
      firestoreDb,
      path,
    ) as CollectionReference<T>;
    const unsubscribe = onSnapshot(
      sortBy ? query(colRef, orderBy(sortByIndex)) : query(colRef),
      (snapshot: QuerySnapshot<T>) => {
        const snapshotArrayData = (snapshot.empty ? [] : snapshot.docs).map((doc) => ({
          id: doc.id,
          ...(doc.data() as T),
        }));
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: snapshotArrayData,
        });
      },
      (error) => dispatch({ type: 'FETCH_ERROR', payload: error.message }),
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled, sortBy, sortByIndex]);
  return state;
};

export const useFirestoreCollectionRecordQuery = <T extends DocumentData>(
  path: string,
  options: FirestoreQueryOptions = {},
): FirestoreQueryState<Record<string, T>> => {
  const { enabled = true, sortBy = false } = options;
  const sortByIndex = typeof sortBy === 'string' ? sortBy : 'index';
  const [state, dispatch] = useFirestoreQuery<Record<string, T>>();

  useEffect(() => {
    if (!enabled || !path) return;

    const colRef: CollectionReference<T> = collection(
      firestoreDb,
      path,
    ) as CollectionReference<T>;
    const unsubscribe = onSnapshot(
      sortBy ? query(colRef, orderBy(sortByIndex)) : query(colRef),
      (snapshot: QuerySnapshot<T>) => {
        const snapshotRecordData = (snapshot.empty ? [] : snapshot.docs).reduce(
          (acc, doc) => ({ ...acc, [doc.id]: { id: doc.id, ...(doc.data() as T) } }),
          {} as Record<string, T>,
        );
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: snapshotRecordData,
        });
      },
      (error) => dispatch({ type: 'FETCH_ERROR', payload: error.message }),
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled, sortBy]);

  return state;
};

export const useFirestoreDocQuery = <T extends DocumentData>(
  path: string,
  options: FirestoreQueryOptions = {},
): FirestoreQueryState<T> => {
  const { enabled = true } = options;
  const [state, dispatch] = useFirestoreQuery<T>();

  useEffect(() => {
    if (!enabled || !path) return;

    const docRef: DocumentReference<T> = doc(firestoreDb, path) as DocumentReference<T>;
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<T>) =>
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: snapshot.exists()
            ? ({ id: snapshot.id, ...(snapshot.data() as T) } as T)
            : (null as unknown as T),
        }),
      (error) => dispatch({ type: 'FETCH_ERROR', payload: error.message }),
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled]);

  return state;
};
