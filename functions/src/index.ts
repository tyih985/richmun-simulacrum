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
  inviteStatus: 'accepted' | 'rejected' | 'pending' = 'pending',
  owner?: boolean,
) => {
  console.log('handleCommitteeWrite called with:', email);
  if (!email) return;
  const uid = await getOrCreateUidFromEmail(email);
  if (!uid) return;

  const payload: Record<string, any> = { role, roleId, inviteStatus };

  if (role === 'staff' && staffRole) {
    payload.staffRole = staffRole;
    if (owner !== undefined) {
      payload.owner = owner;
    }
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
      undefined,
      'pending',
    );
  },
);

export const ondelegateemailupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/delegates/{delegateId}' },
  async (event) => {
    const before = event.data?.before.data() as any;
    const after = event.data?.after.data() as any;
    const beforeEmail = (before.email || '').trim().toLowerCase();
    const afterEmail = (after.email || '').trim().toLowerCase();
    const cid = event.params.committeeId;

    if (beforeEmail === afterEmail) {
      console.log(`[onstaffemailupdated] email unchanged, skipping`);
      return;
    }

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
    const inviteStatus =
      (data.inviteStatus as 'accepted' | 'pending' | 'rejected') || 'pending';
    const owner = data.owner === true;
    await handleCommitteeWrite(
      email,
      event.params.committeeId,
      'staff',
      event.params.staffId,
      staffRole,
      inviteStatus,
      owner
    );
  },
);

export const onstaffemailupdated = onDocumentUpdated(
  { document: 'committees/{committeeId}/staff/{staffId}' },
  async (event) => {
    const before = event.data?.before.data() as any;
    const after = event.data?.after.data() as any;
    const beforeEmail = (before.email || '').trim().toLowerCase();
    const afterEmail = (after.email || '').trim().toLowerCase();
    const cid = event.params.committeeId;
    const staffRole = (before.staffRole || '').trim().toLowerCase();

    if (beforeEmail === afterEmail) {
      console.log(`[onstaffemailupdated] email unchanged, skipping`);
      return;
    }

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
    const before = event.data?.before.data() as any;
    const after = event.data?.after.data() as any;
    const oldRole = (before.staffRole || '').trim().toLowerCase();
    const newRole = (after.staffRole || '').trim().toLowerCase();
    if (oldRole === newRole) {
      console.log(`[onstaffroleupdated] role unchanged, skipping`);
      return;
    }
    const { committeeId, staffId } = event.params;
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

export const onusercommitteeinviteupdated = onDocumentUpdated(
  { document: 'users/{userId}/committees/{committeeId}' },
  async (event) => {
    const before = event.data?.before?.data() as any;
    const after = event.data?.after?.data() as any;
    const { userId, committeeId } = event.params;
    const { role, roleId, inviteStatus } = after as {
      role?: string;
      roleId?: string;
      inviteStatus?: string;
    };

    if (before.inviteStatus === after.inviteStatus) {
      console.log(`[onusercommitteeupdated] inviteStatus unchanged, skipping`);
      return;
    }

    if (!role || !roleId) {
      console.error(`No role or roleId at users/${userId}/committees/${committeeId}`);
      return;
    }
    const subcol = role === 'staff' ? 'staff' : 'delegates';
    const docPath = `committees/${committeeId}/${subcol}/${roleId}`;
    console.log(
      `[onusercommitteeupdated] changing inviteStatus="${inviteStatus}" to ${docPath}`,
    );
    await admin.firestore().doc(docPath).update({ inviteStatus });
  },
);

export const onspeakerlogcreated = onDocumentCreated(
  {
    document:
      'committees/{committeeId}/motions/{motionId}/speakers/{speakerId}/logs/{logId}',
  },
  async (event) => {
    const { committeeId, motionId, speakerId, logId } = event.params;
    const db = admin.firestore();

    const logSnap = event.data;
    if (!logSnap) {
      console.warn(
        `No log snapshot for committees/${committeeId}/motions/${motionId}/speakers/${speakerId}/logs/${logId}`,
      );
      return;
    }
    const logData = logSnap.data() as any;
    const isEndLog = logData.type === 'end';

    const speakerRef = db.doc(
      `committees/${committeeId}/motions/${motionId}/speakers/${speakerId}`,
    );
    const speakerSnap = await speakerRef.get();
    if (!speakerSnap.exists) {
      return;
    }

    const updatePayload: Partial<{ spoke: boolean; order: number }> = {};
    if (isEndLog) {
      updatePayload.spoke = true;
      updatePayload.order = -1;
    }
    if (Object.keys(updatePayload).length > 0) {
      await speakerRef.update(updatePayload);
    } else {
      console.log(`No update needed.`);
    }
  },
);

export const onspeakercreated = onDocumentCreated(
  {
    document:
      'committees/{committeeId}/motions/{motionId}/speakers/{speakerId}',
  },
  async (event) => {
    if (!event.data) {
      console.warn('onSpeakerCreated invoked without snapshot');
      return;
    }
    const speakerSnap = event.data;
    const speakerRef = speakerSnap.ref;
    try {
      await speakerRef.set({ spoke: false }, { merge: true });
    } catch (err) {
      console.error(
        `Failed to initialize 'spoke' on ${speakerRef.path}:`,
        err
      );
    }
  }
);


// PERPLEXITY CLOUD FUNCTION TO DELETE ALL SUBCOLLECTIONS WHEN DELETING A COMMITTEE
const firestore = admin.firestore();

async function deleteCollectionDocuments(
  collectionPath: string,
  batchSize = 100
): Promise<void> {
  const collectionRef = firestore.collection(collectionPath);
  const snapshot = await collectionRef.limit(batchSize).get();

  if (snapshot.empty) {
    return;
  }

  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Recursively delete next batch
  if (snapshot.size === batchSize) {
    await deleteCollectionDocuments(collectionPath, batchSize);
  }
}

export const oncommitteedeleted = onDocumentDeleted(
  { document: 'committees/{committeeId}' },
  async (event) => {
    const { committeeId } = event.params;
    console.log(`Committee ${committeeId} deleted. Cleaning up subcollections...`);
    const subcollections = [
      'staff',
      'delegates',
      'directives',
      'motions',
      'rollcalls'
      // Add more subcollections here if needed
    ];

    try {
      for (const subcol of subcollections) {
        const subcolPath = `committees/${committeeId}/${subcol}`;
        console.log(`Deleting documents in subcollection: ${subcolPath}`);
        await deleteCollectionDocuments(subcolPath);
      }
      console.log(`Finished cleaning subcollections for committee ${committeeId}`);
    } catch (error) {
      console.error(`Error cleaning subcollections for committee ${committeeId}:`, error);
      throw error;
    }
  }
);
