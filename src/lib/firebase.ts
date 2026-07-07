import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAUYqioiqbULcDUvCQmm9j3mE-Dszyvp8",
  authDomain: "gen-lang-client-0520111784.firebaseapp.com",
  projectId: "gen-lang-client-0520111784",
  storageBucket: "gen-lang-client-0520111784.firebasestorage.app",
  messagingSenderId: "349110193669",
  appId: "1:349110193669:web:779aaada76772ee23c566c"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
