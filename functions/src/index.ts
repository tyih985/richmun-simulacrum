import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const getorcreateuidfromemail = functions.https.onCall(async (data: any, context) => {
  const email = (data.email || '').trim();
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
  }

  try {
    // try to get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    return { uid: userRecord.uid };
  } catch (error: any) {
    // otherwise, create a new user
    if (error.code === 'auth/user-not-found') {
      const newUser = await admin.auth().createUser({ email });
      return { uid: newUser.uid };
    }
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const ultraman