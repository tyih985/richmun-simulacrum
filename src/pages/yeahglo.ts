import {
  createFirestoreDocument,
  deleteFirestoreDocument,
  getFirestoreCollection,
  getFirestoreDocument,
  updateFirestoreDocument,
  batchUpdateDocuments,
  BatchRequest,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  usersPath,
  committeePath,
  committeeStaffMemberPath,
  committeeDelegatePath,
} from '@packages/firestorePaths';

// TODO: should I be concerned about overwriting thingies (i.e. having merge flag as true)

// COMMITTEE CRUD
export async function createCommittee(
  committeeId: string,
  name: string,
  startDate: Date,
  endDate: Date
): Promise<void> {
  const path = committeePath(committeeId);
  await createFirestoreDocument(path, { name, startDate, endDate }, true);
}

export async function getCommittee(
  committeeId: string
): Promise<{ id: string; name: string; startDate: Date; endDate: Date } | null> {
  const path = committeePath(committeeId);
  const doc = await getFirestoreDocument<{ name: string; startDate: Date; endDate: Date }>(path);
  return doc
    ? { id: committeeId, name: doc.name, startDate: doc.startDate, endDate: doc.endDate }
    : null;
}

export async function deleteCommittee(
  committeeId: string
): Promise<void> {
  const path = committeePath(committeeId);
  await deleteFirestoreDocument(path);
}

// USER CRUD
export async function createUser(
  userId: string,
  committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }>
): Promise<void> {
  const path = usersPath(userId);
  await createFirestoreDocument(path, { committees }, true);
}

export async function getUser(
  userId: string
): Promise<{ id: string; committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }> } | null> {
  const path = usersPath(userId);
  const doc = await getFirestoreDocument<{ committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }> }>(path);
  return doc
    ? { id: userId, committees: doc.committees }
    : null;
}

export async function deleteUser(
  userId: string
): Promise<void> {
  const path = usersPath(userId);
  await deleteFirestoreDocument(path);
}

// STAFF AND DELEGATES CRUD
export async function addStaffToCommittee(
  committeeId: string,
  userId: string,
  owner: boolean = false,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, userId);
  await createFirestoreDocument(path, { owner }, true);
}

export async function removeStaffFromCommittee(
  committeeId: string,
  userId: string,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, userId);
  await deleteFirestoreDocument(path);
}

export async function addDelegateToCommittee(
  committeeId: string,
  userId: string,
): Promise<void> {
  const path = committeeDelegatePath(committeeId, userId);
  await createFirestoreDocument(path, {}, true);
}

export async function removeDelegateFromCommittee(
  committeeId: string,
  userId: string,
): Promise<void> {
  const path = committeeDelegatePath(committeeId, userId);
  await deleteFirestoreDocument(path);
}

// USERS' COMMITTEES CRUD
export async function addUserCommittee(
  userId: string,
  committeeId: string,
  role: 'staff' | 'delegate',
): Promise<void> {
  const path = usersPath(userId);
  const committees = await getUserCommittees(userId);
  const filtered = committees.filter((c) => c.committeeId !== committeeId);
  filtered.push({ committeeId, role });
  await updateFirestoreDocument(path, { committees: filtered });
}

export async function getUserCommittees(userId: string): Promise<Array<{ committeeId: string; role: 'staff' | 'delegate' }>> {
  const path = usersPath(userId);
  const user = await getFirestoreDocument<{ committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }> }>(path);
  return user?.committees ?? [];
}

export async function removeUserCommittee(
  userId: string,
  committeeId: string,
): Promise<void> {
  const path = usersPath(userId);
  const committees = await getUserCommittees(userId);
  const filtered = committees.filter((c) => c.committeeId !== committeeId);
  await updateFirestoreDocument(path, { committees: filtered });
}