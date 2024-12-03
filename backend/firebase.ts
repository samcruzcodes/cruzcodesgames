import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as dotenv from 'dotenv';

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "cruzcodesgames-c2fe2.firebaseapp.com",
  projectId: "cruzcodesgames-c2fe2",
  storageBucket: "cruzcodesgames-c2fe2.firebasestorage.app",
  messagingSenderId: "32050881297",
  appId: "1:32050881297:web:dd5da6aaf18252896ba2b0",
  measurementId: "G-2Y23E14F1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };