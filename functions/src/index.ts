/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from 'firebase-admin';
import {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} from 'firebase-functions/v2/firestore';

admin.initializeApp();

const getOrCreateUidFromEmail = async (email: string): Promise<string> => {
  console.log('getOrCreateUidFromEmail called with:', email);
  const clean = (email || '').trim().toLowerCase();
  if (!clean) {
    console.log('Email is empty after cleaning.');
    return '';
  }
  let userDoc;
  try {
    userDoc = await admin.auth().getUserByEmail(clean);
  } catch (e: any) {
    if (e.code === 'auth/user-not-found') {
      userDoc = await admin.auth().createUser({ email: clean });
    } else {
      console.error('Error creating new Auth user:', e);
    }
  }
  if (!userDoc) {
    console.error('Failed to get or create Auth user for email:', clean);
    throw new Error('Failed to get or create Auth user');
  }
  const uid = userDoc.uid;
  await admin
    .firestore()
    .doc(`users/${uid}`)
    .set(
      { email: clean, createdAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );
  return uid;
};

const handleCommitteeWrite = async (
  email: string,
  committeeId: string,
  role: 'delegate' | 'staff',
) => {
  console.log('handleCommitteeWrite called with:', email);
  if (!email) return;
  const uid = await getOrCreateUidFromEmail(email);
  if (!uid) return;
  await admin.firestore().doc(`users/${uid}/committees/${committeeId}`).set({ role });
};

const handleCommitteeDelete = async (email: string, committeeId: string) => {
  console.log('handleCommitteeDelete called with:', email);
  if (!email) return;
  const uid = await getOrCreateUidFromEmail(email);
  if (!uid) return;
  await admin.firestore().doc(`users/${uid}/committees/${committeeId}`).delete();
};

// ─── Delegates ───────────────────────────────────────────────────────────────
export const ondelegatecreated = onDocumentCreated(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as any;
    const email = (data.email || '').trim().toLowerCase();
    await handleCommitteeWrite(email, event.params.committeeId, 'delegate');
  },
);

export const ondelegateupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const beforeSnap = event.data?.before;
    const afterSnap = event.data?.after;
    if (!beforeSnap || !afterSnap) return;
    const before = beforeSnap.data() as any;
    const after = afterSnap.data() as any;
    const cid = event.params.committeeId;

    const beforeEmail = (before.email || '').trim().toLowerCase();
    const afterEmail = (after.email || '').trim().toLowerCase();
    if (beforeEmail && beforeEmail !== afterEmail) {
      const beforeUid = await getOrCreateUidFromEmail(beforeEmail);
      await admin.firestore().doc(`users/${beforeUid}/committees/${cid}`).delete();
    }
    await handleCommitteeWrite(afterEmail, cid, 'delegate');
  },
);

export const ondelegatedeleted = onDocumentDeleted(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as any;
    const email = (data.email || '').trim().toLowerCase();
    await handleCommitteeDelete(email, event.params.committeeId);
  },
);

// ─── Staff ───────────────────────────────────────────────────────────────
export const onstaffcreated = onDocumentCreated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as any;
    const email = (data.email || '').trim().toLowerCase();
    await handleCommitteeWrite(email, event.params.committeeId, 'staff');
  },
);

export const onstaffupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const beforeSnap = event.data?.before;
    const afterSnap = event.data?.after;
    if (!beforeSnap || !afterSnap) return;
    const before = beforeSnap.data() as any;
    const after = afterSnap.data() as any;
    const cid = event.params.committeeId;

    const beforeEmail = (before.email || '').trim().toLowerCase();
    const afterEmail = (after.email || '').trim().toLowerCase();
    if (beforeEmail && beforeEmail !== afterEmail) {
      const beforeUid = await getOrCreateUidFromEmail(beforeEmail);
      await admin.firestore().doc(`users/${beforeUid}/committees/${cid}`).delete();
    }
    await handleCommitteeWrite(afterEmail, cid, 'staff');
  },
);

export const onstaffdeleted = onDocumentDeleted(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as any;
    const email = (data.email || '').trim().toLowerCase();
    await handleCommitteeDelete(email, event.params.committeeId);
  },
);

// ─── Users ──────────────────────────────────────────────────
// TODO
