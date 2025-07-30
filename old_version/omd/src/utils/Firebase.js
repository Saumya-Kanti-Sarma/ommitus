import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ommitus.firebaseapp.com",
  projectId: "ommitus",
  storageBucket: "ommitus.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);