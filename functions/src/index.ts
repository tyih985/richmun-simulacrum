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
  await admin.firestore().doc(`users/${uid}`).set({ email: clean }, { merge: true });
  return uid;
};

const handleCommitteeWrite = async (
  email: string,
  committeeId: string,
  role: 'delegate' | 'staff',
  roleId: string,
  staffRole?: string,
) => {
  console.log('handleCommitteeWrite called with:', email);
  if (!email) return;
  const uid = await getOrCreateUidFromEmail(email);
  if (!uid) return;

  const payload: Record<string, any> = { role, roleId };
  if (role === 'staff' && staffRole) {
    payload.staffRole = staffRole;
  }

  await admin
    .firestore()
    .doc(`users/${uid}/committees/${committeeId}`)
    .set(payload, { merge: true });
  console.log('Write complete.');
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
    await handleCommitteeWrite(
      email,
      event.params.committeeId,
      'delegate',
      event.params.delegateId,
    );
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
    await handleCommitteeWrite(afterEmail, cid, 'delegate', event.params.delegateId);
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
    const staffRole = (data.staffRole || '').trim().toLowerCase();
    await handleCommitteeWrite(
      email,
      event.params.committeeId,
      'staff',
      event.params.staffId,
      staffRole,
    );
  },
);

export const onstaffemailupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const beforeSnap = event.data?.before;
    const afterSnap = event.data?.after;
    if (!beforeSnap || !afterSnap) return;
    const before = beforeSnap.data() as any;
    const after = afterSnap.data() as any;

    const cid = event.params.committeeId;
    const staffRole = (before.staffRole || '').trim().toLowerCase();

    const beforeEmail = (before.email || '').trim().toLowerCase();
    const afterEmail = (after.email || '').trim().toLowerCase();
    if (beforeEmail && beforeEmail !== afterEmail) {
      const beforeUid = await getOrCreateUidFromEmail(beforeEmail);
      await admin.firestore().doc(`users/${beforeUid}/committees/${cid}`).delete();
    }
    await handleCommitteeWrite(afterEmail, cid, 'staff', event.params.staffId, staffRole);
  },
);

export const onstaffroleupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const beforeSnap = event.data?.before;
    const afterSnap = event.data?.after;
    if (!beforeSnap || !afterSnap) return;

    const before = beforeSnap.data() as any;
    const after = afterSnap.data() as any;
    const { committeeId, staffId } = event.params;

    const oldRole = (before.staffRole || '').trim();
    const newRole = (after.staffRole || '').trim();
    if (oldRole === newRole) {
      console.log(
        `[onstaffroleupdated] staffRole unchanged for ${staffId} in ${committeeId}:`,
        oldRole,
      );
      return;
    }

    const email = (after.email || '').trim().toLowerCase();
    if (!email) {
      console.error(`[onstaffroleupdated] no email for staff/${staffId}`);
      return;
    }
    const uid = await getOrCreateUidFromEmail(email);
    if (!uid) {
      console.error(`[onstaffroleupdated] failed to get uid for ${email}`);
      return;
    }

    const userCommitteeRef = admin
      .firestore()
      .doc(`users/${uid}/committees/${committeeId}`);
    await userCommitteeRef.update({ staffRole: newRole });
    console.log(
      `[onstaffroleupdated] updated users/${uid}/committees/${committeeId}.staffRole = "${newRole}"`,
    );
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
export const onusercommitteedeleted = onDocumentDeleted(
  { document: 'users/{userId}/committees/{committeeId}' },
  async (event) => {
    const { userId, committeeId } = event.params;
    const data = event.data?.data() as { role?: string; roleId?: string } | undefined;
    if (!data) {
      console.log(`No data stored at users/${userId}/committees/${committeeId}`);
      return;
    }
    const { role, roleId } = data;
    if (!role || !roleId) {
      console.log(`No role or roleId at users/${userId}/committees/${committeeId}`);
      return;
    }

    const db = admin.firestore();
    const userSnap = await db.doc(`users/${userId}`).get();
    const userEmail = (userSnap.data()?.email as string) || '';

    const staffRef = db.doc(`committees/${committeeId}/staff/${roleId}`);
    const delRef = db.doc(`committees/${committeeId}/delegates/${roleId}`);

    if (role === 'staff') {
      const staffSnap = await staffRef.get();
      const emailInDoc = (staffSnap.data()?.email as string) || '';
      if (staffSnap.exists && emailInDoc !== '' && emailInDoc !== userEmail) {
        return;
      }
      await staffRef.delete();
    } else if (role === 'delegate') {
      const delSnap = await delRef.get();
      const emailInDoc = (delSnap.data()?.email as string) || '';
      if (!delSnap.exists || emailInDoc === '' || emailInDoc !== userEmail) {
        return;
      }
      await delRef.update({ email: '' });
    } else {
      console.log(`Unknown role "${role}" on users/${userId}/committees/${committeeId}`);
    }
  },
);
