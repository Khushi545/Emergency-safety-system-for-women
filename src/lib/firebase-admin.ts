import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    console.warn("Firebase Admin credentials missing. This is expected if you are in the build phase and haven't set Vercel Environment Variables yet.");
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { db, auth, storage };
