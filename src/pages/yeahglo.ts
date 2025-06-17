import {
  createFirestoreDocument,
  deleteFirestoreDocument,
  getFirestoreCollection,
  getFirestoreDocument,
  updateFirestoreDocument,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  usersPath,
  committeePath,
  emailPath,
  committeeStaffMemberPath,
  committeeDelegatePathTyler,
} from '@packages/firestorePaths';

// COMMITTEE CRUD
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

// USER CRUD
export async function createUser(
  uid: string,
  email: string,
  committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }>,
): Promise<void> {
  const path = usersPath(uid);
  await createFirestoreDocument(path, { email, committees }, true);
}

export async function getUser(uid: string): Promise<{
  id: string;
  email: string;
  committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }>;
} | null> {
  const path = usersPath(uid);
  const doc = await getFirestoreDocument<{
    email: string;
    committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }>;
  }>(path);
  return doc ? { id: uid, email: doc.email, committees: doc.committees } : null;
}

export async function deleteUser(uid: string): Promise<void> {
  const path = usersPath(uid);
  await deleteFirestoreDocument(path);
}

// STAFF AND DELEGATES CRUD
export async function addStaffToCommittee(
  committeeId: string,
  uid: string,
  owner: boolean = false,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, uid);
  await createFirestoreDocument(path, { owner }, true);
}

export async function removeStaffFromCommittee(
  committeeId: string,
  uid: string,
): Promise<void> {
  const path = committeeStaffMemberPath(committeeId, uid);
  await deleteFirestoreDocument(path);
}

export async function addDelegateToCommittee(
  committeeId: string,
  country: string,
  uid: string,
): Promise<void> {
  const path = committeeDelegatePathTyler(committeeId, country);
  await createFirestoreDocument(path, { uid }, true);
}

export async function removeDelegateFromCommittee(
  committeeId: string,
  country: string,
): Promise<void> {
  const path = committeeDelegatePathTyler(committeeId, country);
  await deleteFirestoreDocument(path);
}

// USERS' COMMITTEES CRUD
export async function addUserCommittee(
  uid: string,
  committeeId: string,
  role: 'staff' | 'delegate',
): Promise<void> {
  const path = usersPath(uid);
  const committees = await getUserCommittees(uid);
  const filtered = committees.filter((c) => c.committeeId !== committeeId);
  filtered.push({ committeeId, role });
  await updateFirestoreDocument(path, { committees: filtered });
}

export async function getUserCommittees(
  uid: string,
): Promise<Array<{ committeeId: string; role: 'staff' | 'delegate' }>> {
  const path = usersPath(uid);
  const user = await getFirestoreDocument<{
    committees: Array<{ committeeId: string; role: 'staff' | 'delegate' }>;
  }>(path);
  return user?.committees ?? [];
}

export async function removeUserCommittee(
  uid: string,
  committeeId: string,
): Promise<void> {
  const path = usersPath(uid);
  const committees = await getUserCommittees(uid);
  const filtered = committees.filter((c) => c.committeeId !== committeeId);
  await updateFirestoreDocument(path, { committees: filtered });
}

// EMAIL CRUD
export async function createEmail(email: string, uid: string): Promise<void> {
  const path = emailPath(email);
  await createFirestoreDocument(path, { uid }, true);
}

export async function getEmail(
  email: string,
): Promise<{ email: string; uid: string } | null> {
  const path = emailPath(email);
  const doc = await getFirestoreDocument<{ uid: string }>(path);
  return doc ? { email, uid: doc.uid } : null;
}

export async function deleteEmail(email: string): Promise<void> {
  const path = emailPath(email);
  await deleteFirestoreDocument(path);
}
