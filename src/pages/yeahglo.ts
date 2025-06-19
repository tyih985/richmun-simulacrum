import { firestoreDb } from '@packages/firebase/firestoreDb';
import {
  createFirestoreDocument,
  deleteFirestoreDocument,
  getFirestoreCollection,
  getFirestoreDocument,
} from '@packages/firestoreAsQuery/firestoreRequests';

import {
  committeePath,
  committeeDelegatePath,
  committeeStaffMemberPath,
  userCommitteesPath,
  userCommitteePath,
} from '@packages/firestorePaths';
import { addDoc, collection, FirestoreError, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

// ─── COMMITTEE CRUD ────────────────────────────────────────────────────────────
export async function createCommittee(
  committeeId: string,
  longName: string,
  shortName: string,
  startDate: Date,
  endDate: Date,
): Promise<void> {
  const path = committeePath(committeeId);
  await createFirestoreDocument(path, { longName, shortName, startDate, endDate }, true);
  console.log(
    `[createCommittee] created committee ${committeeId} at path ${path} with long name ${longName} and short name ${shortName} and dates ${startDate} to ${endDate}`,
  );
}

export async function getCommittee(
  committeeId: string,
): Promise<{ id: string;  longName: string; shortName: string; startDate: Date; endDate: Date } | null> {
  const path = committeePath(committeeId);
  const doc = await getFirestoreDocument<{
    longName: string;
    shortName: string;
    startDate: Date;
    endDate: Date;
  }>(path);
  return doc
    ? { id: committeeId, longName: doc.longName, shortName: doc.shortName, startDate: doc.startDate, endDate: doc.endDate }
    : null;
}

export async function deleteCommittee(committeeId: string): Promise<void> {
  const path = committeePath(committeeId);
  await deleteFirestoreDocument(path);
}

// ─── USER COMMITTEE MAPPING ───────────────────────────────────────────────────

export async function addUserCommittee(
  uid: string,
  committeeId: string,
  role: 'staff' | 'delegate',
): Promise<void> {
  const path = userCommitteePath(uid, committeeId);
  await createFirestoreDocument(path, { role }, true);
  console.log(
    `[addUserCommittee] created committee ${committeeId} at path ${path} with role ${role}`,
  );
}

export async function getUserCommittees(
  uid: string,
): Promise<Array<{ committeeId: string; role: 'staff' | 'delegate' }>> {
  const path = userCommitteesPath(uid);
  const docs = await getFirestoreCollection<{ id: string; role: 'staff' | 'delegate' }>(
    path,
  );
  return docs.map((doc) => ({
    committeeId: doc.id,
    role: doc.role,
  }));
}

export async function removeUserCommittee(
  uid: string,
  committeeId: string,
): Promise<void> {
  const path = userCommitteePath(uid, committeeId);
  await deleteFirestoreDocument(path);
}

// ─── STAFF COMMITTEE MAPPING ─────────────────────────────────────────────────────────

export async function addStaffToCommittee(
  committeeId: string,
  staffId: string,
  owner: boolean = false,
  role: 'assistant director' | 'director' | 'flex staff',
  uid: string,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, staffId);
  await createFirestoreDocument(path, { owner, role, uid }, true);
  console.log(
    `[addStaffToCommittee] added staff ${staffId} (uid=${uid}) to committee ${committeeId} as owner=${owner} with role=${role}`,
  );
}

export async function removeStaffFromCommittee(
  committeeId: string,
  staffId: string,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, staffId);
  await deleteFirestoreDocument(path);
}

// ─── DELEGATE COMMITTEE MAPPING ───────────────────────────────────────────────────────

export async function addDelegateToCommittee(
  committeeId: string,
  delegateId: string,
  name: string,
  uid: string,
): Promise<void> {
  const path = committeeDelegatePath(committeeId, delegateId);
  await createFirestoreDocument(path, { name, uid }, true);
  console.log(
    `[addDelegateToCommittee] added delegate ${delegateId} (uid=${uid}) to committee ${committeeId} with name="${name}"`,
  );
}

export async function removeDelegateFromCommittee(
  committeeId: string,
  delegateId: string,
): Promise<void> {
  const path = committeeDelegatePath(committeeId, delegateId);
  await deleteFirestoreDocument(path);
}

export async function getOrCreateUidFromEmail(email: string): Promise<string> {
  if (!email.trim()) {
    console.log('No email provided, skipping user creation.');
    return '';
  }
  try {
    const usersCol = collection(firestoreDb, 'users');
    const q = query(usersCol, where('email', '==', email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      console.log(`Found existing user for email ${email}:`, snap.docs[0].id);
      return snap.docs[0].id;
    }
    // make user if snap is empty
    const docRef = await addDoc(usersCol, {
      email,
      createdAt: serverTimestamp(),
    });
    console.log(`Created new user for email ${email}:`, docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error in getOrCreateUidFromEmail:', (e as FirestoreError).message);
    throw e;
  }
}
