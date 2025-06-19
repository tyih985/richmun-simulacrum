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

export async function ultimateConsoleLog(): Promise<void> {
    console.log('--- DATABASE DUMP START ---');

    // 1) Committees + their staff and delegate subcollections
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

    // 2) Users + their committees
    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    console.log(`Found ${usersSnap.size} users.`);
    for (const uDoc of usersSnap.docs) {
      console.log(`User [${uDoc.id}]:`, uDoc.data());

      const ucSnap = await getDocs(
        collection(firestoreDb, 'users', uDoc.id, 'committees'),
      );
      console.log(`  ↳ user‑committees (${ucSnap.size}):`);
      ucSnap.docs.forEach((uc) => console.log(`    • [${uc.id}]`, uc.data()));
    }

    // 3) Root staff collection
    const rootStaffSnap = await getDocs(collection(firestoreDb, 'staff'));
    console.log(`Found ${rootStaffSnap.size} staff records at root.`);
    rootStaffSnap.docs.forEach((s) => console.log(`  • [${s.id}]`, s.data()));

    // 4) Root delegates collection
    const rootDelSnap = await getDocs(collection(firestoreDb, 'delegates'));
    console.log(`Found ${rootDelSnap.size} delegate records at root.`);
    rootDelSnap.docs.forEach((d) => console.log(`  • [${d.id}]`, d.data()));

    console.log('--- DATABASE DUMP END ---');
  }

  