import admin from "firebase-admin";
import 'dotenv/config';

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
};

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  console.error('Missing Firebase Admin SDK credentials');
  throw new Error('Missing required Firebase Admin SDK credentials. Check your environment variables.');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.projectId,
    privateKey: serviceAccount.privateKey,
    clientEmail: serviceAccount.clientEmail
  })
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };