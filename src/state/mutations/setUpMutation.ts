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
  committeeDirectivePath,
  committeeMotionPath,
  userCommitteesPath,
  userCommitteePath,
} from '@packages/firestorePaths';
import { collection, getDocs } from 'firebase/firestore';
import { Role, StaffRole, InviteStatus, AttendanceStatus, DirectiveStatus, MotionType } from 'src/features/types';

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
    inviteStatus: InviteStatus = 'pending',
  ) => {
    const path = userCommitteePath(uid, committeeId);
    return createFirestoreDocument(path, { role, roleId, inviteStatus }, true);
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
    inviteStatus: InviteStatus = 'pending',
  ) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return createFirestoreDocument(path, { owner, staffRole, email, inviteStatus }, true);
  };

  const removeStaffFromCommittee = (committeeId: string, staffId: string) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return deleteFirestoreDocument(path);
  };

  const addDelegateToCommittee = (
    committeeId: string,
    delegateId: string,
    name: string,
    email: string,
    inviteStatus: InviteStatus = 'pending',
    minutes: number = 0,
    positionPaperSent = false,
    attendanceStatus: AttendanceStatus = 'absent',
    spoke: boolean = false,
  ) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return createFirestoreDocument(path, { name, email, inviteStatus, minutes, positionPaperSent, attendanceStatus, spoke }, true);
  };

  const removeDelegateFromCommittee = (committeeId: string, delegateId: string) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return deleteFirestoreDocument(path);
  };

  const addDirectiveToCommittee = (
    committeeId: string,
    directiveId: string,
    title: string,
    description: string,
    privateStatus: boolean,
    sponsors: string[],
    signatories: string[],
    passed: DirectiveStatus = 'pending',
    read: boolean = false,
    upVotes: number = 0,
  ) => {
    const path = committeeDirectivePath(committeeId, directiveId);
    if (privateStatus) {
      return createFirestoreDocument(path, { directiveId, title, description, privateStatus, sponsors, signatories, passed, read }, true);
    }
    return createFirestoreDocument(path, { directiveId, title, description, privateStatus, sponsors, signatories, passed, read, upVotes }, true);
  };

  const removeDirectiveFromCommittee = (committeeId: string, directiveId: string) => {
    const path = committeeDirectivePath(committeeId, directiveId);
    return deleteFirestoreDocument(path);
  };

  const addCommitteeMotion = (
    committeeId: string,
    motionId: string,
    delegate: string,
    type: MotionType,
    totalTime?: number,
    speakingTime?: number,
  ) => {
  const path = committeeMotionPath(committeeId, motionId);
  const data: any = {
    delegate,
    type,
  };
  if (totalTime !== undefined) {
    data.totalTime = totalTime;
  }
  if (speakingTime !== undefined) {
    data.speakingTime = speakingTime;
  }
  return createFirestoreDocument(path, data, true);
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
