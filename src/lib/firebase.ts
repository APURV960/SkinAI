
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "skinai-advisor-47szd",
  appId: "1:719212927923:web:8aeb1461cb6fb2d96cc9c6",
  storageBucket: "skinai-advisor-47szd.firebasestorage.app",
  apiKey: "AIzaSyCF9yiX5ryR4CUuWAE_T5O_bA-TlT5fFi4",
  authDomain: "skinai-advisor-47szd.firebaseapp.com",
  messagingSenderId: "719212927923",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
