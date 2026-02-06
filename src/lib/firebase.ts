// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Kunci untuk ABDIPUNK (Sesuai screenshot Anda)
const firebaseConfig = {
  apiKey: "AIzaSyCsBBV04bupC3thytxvPIw_h_BiFY6iCgU",
  authDomain: "abdipunk-40a73.firebaseapp.com",
  projectId: "abdipunk-40a73",
  storageBucket: "abdipunk-40a73.firebasestorage.app",
  messagingSenderId: "130438001021",
  appId: "1:130438001021:web:da305ff06fd723f5c85c14"
};

// 1. Mulai Aplikasi Firebase
const app = initializeApp(firebaseConfig);

// 2. Siapkan Database
export const db = getFirestore(app);