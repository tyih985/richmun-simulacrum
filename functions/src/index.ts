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
  const usersCol = admin.firestore().collection('users');
  const snap = await usersCol.where('email', '==', clean).limit(1).get();
  if (!snap.empty) {
    console.log('User found for email:', clean, 'UID:', snap.docs[0].id);
    return snap.docs[0].id;
  }
  try {
    const docRef = await usersCol.add({
      email: clean,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Created new user with email:', clean, 'UID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error creating new user:', e);
    throw e;
  }
};

const handleCommitteeWrite = async (
  data: Record<string, any>,
  committeeId: string,
  role: 'delegate' | 'staff',
) => {
  const email = (data.email || '');
  console.log('handleCommitteeWrite called with:', email);
  const uid = await getOrCreateUidFromEmail(email);
  if (!uid) return;
  await admin.firestore().doc(`users/${uid}/committees/${committeeId}`).set({ role });
};

const handleCommitteeDelete = async (data: Record<string, any>, committeeId: string) => {
  const email = (data.email || '');
  console.log('handleCommitteeDelete called with:', email);
  const uid = await getOrCreateUidFromEmail(email);
  if (!uid) return;
  await admin.firestore().doc(`users/${uid}/committees/${committeeId}`).delete();
};

// ─── Delegates ───────────────────────────────────────────────────────────────
export const ondelegatecreated = onDocumentCreated(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const data = event.data?.data as Record<string, any>;
    await handleCommitteeWrite(data, event.params.committeeId, 'delegate');
  },
);

export const ondelegateupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const before = event.data?.before?.data as Record<string, any>;
    const after = event.data?.after?.data as Record<string, any>;
    const committeeId = event.params.committeeId;
    const beforeEmail = (before.email || '').trim();
    const afterEmail = (after.email || '').trim();
    if (beforeEmail !== afterEmail) {
      const oldUid = await getOrCreateUidFromEmail(beforeEmail);
      if (oldUid) {
        await admin.firestore().doc(`users/${oldUid}/committees/${committeeId}`).delete();
      }
    }
    await handleCommitteeWrite(after, committeeId, 'delegate');
  },
);

export const ondelegatedeleted = onDocumentDeleted(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const data = event.data?.data as Record<string, any>;
    await handleCommitteeDelete(data, event.params.committeeId);
  },
);

// ─── Staff ───────────────────────────────────────────────────────────────
export const onstaffcreated = onDocumentCreated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const data = event.data?.data as Record<string, any>;
    await handleCommitteeWrite(data, event.params.committeeId, 'staff');
  },
);

export const onstaffupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const before = event.data?.before?.data as Record<string, any>;
    const after = event.data?.after?.data as Record<string, any>;
    const committeeId = event.params.committeeId;
    const beforeEmail = (before.email || '').trim();
    const afterEmail = (after.email || '').trim();
    if (beforeEmail !== afterEmail) {
      const oldUid = await getOrCreateUidFromEmail(beforeEmail);
      if (oldUid) {
        await admin.firestore().doc(`users/${oldUid}/committees/${committeeId}`).delete();
      }
    }
    await handleCommitteeWrite(after, committeeId, 'staff');
  },
);

export const onstaffdeleted = onDocumentDeleted(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const data = event.data?.data as Record<string, any>;
    await handleCommitteeDelete(data, event.params.committeeId);
  },
);

// ─── Users ──────────────────────────────────────────────────
// export const onusercommitteeDeleted = onDocumentDeleted(
//   { document: 'users/{userId}/committees/{committeeId}' },
//   async (event) => {
//     const { userId, committeeId } = event.params;
//     const role = (event.data?.data() as any)?.role;
//     const userSnap = await admin.firestore().doc(`users/${userId}`).get();
//     const email = (userSnap.data()?.email || '').trim();
//     if (!email) return;
//     if (role === 'staff') {
//       const staffSnap = await admin
//         .firestore()
//         .collection(`committees/${committeeId}/staff`)
//         .where('email', '==', email)
//         .get();
//       staffSnap.forEach((doc) => doc.ref.delete());
//     } else if (role === 'delegate') {
//       const delRef = admin
//         .firestore()
//         .doc(`committees/${committeeId}/delegates/${userId}`);
//       const delSnap = await delRef.get();
//       if (delSnap.exists && delSnap.data()?.email === email) {
//         await delRef.update({ email: '' });
//       }
//     }
//   }
// );
