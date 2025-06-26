import { firestoreDb } from '@packages/firebase/firestoreDb';
import {
  createFirestoreDocument,
  deleteFirestoreDocument,
  getFirestoreDocument,
  getFirestoreCollection,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  committeePath,
  committeeDelegatePath,
  committeeStaffMemberPath,
  userCommitteesPath,
  userCommitteePath,
} from '@packages/firestorePaths';
import {
  addDoc,
  collection,
  FirestoreError,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { Role, StaffRole } from 'src/features/types';

export const committeeMutations = () => {
  const createCommittee = (
    committeeId: string,
    longName: string,
    shortName: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const path = committeePath(committeeId);
    return createFirestoreDocument(
      path,
      { longName, shortName, startDate, endDate },
      true,
    );
  };

  const getCommittee = async (
    committeeId: string,
  ): Promise<{
    id: string;
    longName: string;
    shortName: string;
    startDate: Date;
    endDate: Date;
  } | null> => {
    const path = committeePath(committeeId);
    const doc = await getFirestoreDocument<{
      longName: string;
      shortName: string;
      startDate: Date;
      endDate: Date;
    }>(path);
    if (!doc) return null;
    return { id: committeeId, ...doc };
  };

  const deleteCommittee = (committeeId: string) => {
    const path = committeePath(committeeId);
    return deleteFirestoreDocument(path);
  };

  const addUserCommittee = (uid: string, committeeId: string, role: Role) => {
    const path = userCommitteePath(uid, committeeId);
    return createFirestoreDocument(path, { role }, true);
  };

  const getUserCommittees = (
    uid: string,
  ): Promise<Array<{ committeeId: string; role: Role }>> => {
    const path = userCommitteesPath(uid);
    return getFirestoreCollection<{ id: string; role: Role }>(path).then((docs) =>
      docs.map((d) => ({ committeeId: d.id, role: d.role })),
    );
  };

  const removeUserCommittee = (uid: string, committeeId: string) => {
    const path = userCommitteePath(uid, committeeId);
    return deleteFirestoreDocument(path);
  };

  const addStaffToCommittee = (
    committeeId: string,
    staffId: string,
    owner: boolean = false,
    role: StaffRole,
    uid: string,
  ) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return createFirestoreDocument(path, { owner, role, uid }, true);
  };

  const removeStaffFromCommittee = (committeeId: string, staffId: string) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return deleteFirestoreDocument(path);
  };

  const addDelegateToCommittee = (
    committeeId: string,
    delegateId: string,
    name: string,
    uid: string,
  ) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return createFirestoreDocument(path, { name, uid }, true);
  };

  const removeDelegateFromCommittee = (committeeId: string, delegateId: string) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return deleteFirestoreDocument(path);
  };

  const getOrCreateUidFromEmail = async (email: string): Promise<string> => {
    if (!email.trim()) return '';
    try {
      const usersCol = collection(firestoreDb, 'users');
      const q = query(usersCol, where('email', '==', email));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].id;
      const docRef = await addDoc(usersCol, {
        email,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (e) {
      console.error('Error in getOrCreateUidFromEmail:', (e as FirestoreError).message);
      throw e;
    }
  };

  const ultimateConsoleLog = async (): Promise<void> => {
    console.log('--- DATABASE DUMP START ---');
    const committeesSnap = await getDocs(collection(firestoreDb, 'committees'));
    console.log(`Found ${committeesSnap.size} committees.`);
    for (const cDoc of committeesSnap.docs) {
      console.log(`Committee [${cDoc.id}]:`, cDoc.data());
      const staffSnap = await getDocs(
        collection(firestoreDb, 'committees', cDoc.id, 'staff'),
      );
      console.log(`  ↳ staff (${staffSnap.size}):`);
      staffSnap.docs.forEach((s) => console.log(`    • [${s.id}]`, s.data()));
      const delSnap = await getDocs(
        collection(firestoreDb, 'committees', cDoc.id, 'delegates'),
      );
      console.log(`  ↳ delegates (${delSnap.size}):`);
      delSnap.docs.forEach((d) => console.log(`    • [${d.id}]`, d.data()));
    }
    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    console.log(`Found ${usersSnap.size} users.`);
    for (const uDoc of usersSnap.docs) {
      console.log(`User [${uDoc.id}]:`, uDoc.data());
      const ucSnap = await getDocs(
        collection(firestoreDb, 'users', uDoc.id, 'committees'),
      );
      console.log(`  ↳ user-committees (${ucSnap.size}):`);
      ucSnap.docs.forEach((uc) => console.log(`    • [${uc.id}]`, uc.data()));
    }
    const rootStaffSnap = await getDocs(collection(firestoreDb, 'staff'));
    console.log(`Found ${rootStaffSnap.size} staff records at root.`);
    rootStaffSnap.docs.forEach((s) => console.log(`  • [${s.id}]`, s.data()));
    const rootDelSnap = await getDocs(collection(firestoreDb, 'delegates'));
    console.log(`Found ${rootDelSnap.size} delegate records at root.`);
    rootDelSnap.docs.forEach((d) => console.log(`  • [${d.id}]`, d.data()));
    console.log('--- DATABASE DUMP END ---');
  };

  return {
    createCommittee,
    getCommittee,
    deleteCommittee,
    addUserCommittee,
    getUserCommittees,
    removeUserCommittee,
    addStaffToCommittee,
    removeStaffFromCommittee,
    addDelegateToCommittee,
    removeDelegateFromCommittee,
    getOrCreateUidFromEmail,
    ultimateConsoleLog,
  };
};
