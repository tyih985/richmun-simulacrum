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
import { collection, getDocs } from 'firebase/firestore';
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

  const addUserCommittee = (
    uid: string,
    committeeId: string,
    role: Role,
    roleId: string,
  ) => {
    const path = userCommitteePath(uid, committeeId);
    return createFirestoreDocument(path, { role, roleId }, true);
  };

  const getUserCommittees = (
    uid: string,
  ): Promise<Array<{ committeeId: string; role: Role }>> => {
    const path = userCommitteesPath(uid);
    return getFirestoreCollection<{ id: string; role: Role; roleId: string }>(path).then(
      (docs) => docs.map((d) => ({ committeeId: d.id, role: d.role, roleId: d.roleId })),
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
    staffRole: StaffRole,
    email: string,
  ) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return createFirestoreDocument(path, { owner, staffRole: staffRole, email }, true);
  };

  const removeStaffFromCommittee = (committeeId: string, staffId: string) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return deleteFirestoreDocument(path);
  };

  const addDelegateToCommittee = (
    committeeId: string,
    delegateEmail: string,
    name: string,
    email: string,
  ) => {
    const path = committeeDelegatePath(committeeId, delegateEmail);
    return createFirestoreDocument(path, { name, email }, true);
  };

  const removeDelegateFromCommittee = (committeeId: string, delegateEmail: string) => {
    const path = committeeDelegatePath(committeeId, delegateEmail);
    return deleteFirestoreDocument(path);
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
    ultimateConsoleLog,
  };
};
