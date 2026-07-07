/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Environment variables list for validation
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

// Validate that required environment variables are set
const missingVars = requiredEnvVars.filter((varName) => !import.meta.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables:\n${missingVars.join(
      '\n'
    )}\n\nPlease define these variables in your environment or AI Studio Secrets.`
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
const databaseId =
  import.meta.env.VITE_FIRESTORE_DATABASE_ID ||
  "ai-studio-smarthealthai-15ad667c-3a58-4cd5-992e-3c6bf6788708";

export const db = getFirestore(app, databaseId);

/**
 * Returns a collection name dynamically prefixed if the application is running in Demo Mode.
 * This guarantees absolute isolation from production data.
 */
export function getCollectionName(baseName: string): string {
  const isDemo = localStorage.getItem('sh_is_demo_mode') === 'true';
  if (isDemo) {
    return `demo_${baseName}`;
  }
  return baseName;
}
