
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDplQ-Tc16-VVhbziOCY2XbYhoPXnWe6CY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "who-cares-e99b3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "who-cares-e99b3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "who-cares-e99b3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "176029499458",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:176029499458:web:c5d381de9132f8bb456ddb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C0QRN755XF",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

// Connect to emulators if in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { auth, db, functions, analytics };
