
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Added
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Added

// Log the project ID being used to help debug connection issues.
if (typeof window === 'undefined') { // Log only on the server during initialization
    console.log('[Firebase Config] Initializing with Project ID:', firebaseConfig.projectId || 'NOT SET');
    if (!firebaseConfig.projectId) {
        console.warn('[Firebase Config] WARNING: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in your environment variables. Firestore will not work.');
    }
     if (!firebaseConfig.storageBucket) {
        console.warn('[Firebase Config] WARNING: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in your environment variables. Firebase Storage will not work.');
    }
    if (!firebaseConfig.authDomain) {
        console.warn('[Firebase Config] WARNING: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is not set. Firebase Authentication might not work as expected.');
    }
}


export { app, db, storage, auth }; // Export auth
