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
  staffMemberPath,
  delegatePath,
  userCommitteesPath,
  userCommitteePath,
} from '@packages/firestorePaths';

// ─── COMMITTEE CRUD ────────────────────────────────────────────────────────────
export async function createCommittee(
  committeeId: string,
  name: string,
  startDate: Date,
  endDate: Date,
): Promise<void> {
  const path = committeePath(committeeId);
  await createFirestoreDocument(path, { name, startDate, endDate }, true);
}

export async function getCommittee(
  committeeId: string,
): Promise<{ id: string; name: string; startDate: Date; endDate: Date } | null> {
  const path = committeePath(committeeId);
  const doc = await getFirestoreDocument<{
    name: string;
    startDate: Date;
    endDate: Date;
  }>(path);
  return doc
    ? { id: committeeId, name: doc.name, startDate: doc.startDate, endDate: doc.endDate }
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

// ─── STAFF CRUD ────────────────────────────────────────────────────────────────

export async function createStaff(staffId: string, uid: string): Promise<void> {
  const path = staffMemberPath(staffId);
  await createFirestoreDocument(path, { uid }, true);
}

export async function getStaff(
  staffId: string,
): Promise<{ id: string; uid: string } | null> {
  const path = staffMemberPath(staffId);
  const doc = await getFirestoreDocument<{ uid: string }>(path);
  return doc ? { id: staffId, uid: doc.uid } : null;
}

export async function deleteStaff(staffId: string): Promise<void> {
  const path = staffMemberPath(staffId);
  await deleteFirestoreDocument(path);
}

// ─── STAFF COMMITTEE MAPPING ─────────────────────────────────────────────────────────

export async function addStaffToCommittee(
  committeeId: string,
  staffId: string,
  owner: boolean = false,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, staffId);
  await createFirestoreDocument(path, { owner }, true);
}

export async function removeStaffFromCommittee(
  committeeId: string,
  staffId: string,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, staffId);
  await deleteFirestoreDocument(path);
}

// ─── DELEGATE CRUD ─────────────────────────────────────────────────────────────

export async function createDelegate(delegateId: string, uid: string): Promise<void> {
  const path = delegatePath(delegateId);
  await createFirestoreDocument(path, { uid }, true);
}

export async function getDelegate(
  delegateId: string,
): Promise<{ id: string; uid: string } | null> {
  const path = delegatePath(delegateId);
  const doc = await getFirestoreDocument<{ uid: string }>(path);
  return doc ? { id: delegateId, uid: doc.uid } : null;
}

export async function deleteDelegate(delegateId: string): Promise<void> {
  const path = delegatePath(delegateId);
  await deleteFirestoreDocument(path);
}

// ─── DELEGATE COMMITTEE MAPPING ───────────────────────────────────────────────────────

export async function addDelegateToCommittee(
  committeeId: string,
  delegateId: string,
  name: string,
): Promise<void> {
  const path = committeeDelegatePath(committeeId, delegateId);
  await createFirestoreDocument(path, { name }, true);
}

export async function removeDelegateFromCommittee(
  committeeId: string,
  delegateId: string,
): Promise<void> {
  const path = committeeDelegatePath(committeeId, delegateId);
  await deleteFirestoreDocument(path);
}
