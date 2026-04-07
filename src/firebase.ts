// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8rhooDdm-FcWOH2JknCgh1ghqbvFNSDc",
  authDomain: "aroshi-clicker.firebaseapp.com",
  projectId: "aroshi-clicker",
  storageBucket: "aroshi-clicker.firebasestorage.app",
  messagingSenderId: "486410415603",
  appId: "1:486410415603:web:05743208f8f8b2b6d4f686"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);