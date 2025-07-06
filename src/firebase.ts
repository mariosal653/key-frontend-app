
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4KmKdTbnrrl_tt4z-T0MDGps-wV4neoU",
  authDomain: "academic-portal-key.firebaseapp.com",
  projectId: "academic-portal-key",
  storageBucket: "academic-portal-key.firebasestorage.app",
  messagingSenderId: "591216079840",
  appId: "1:591216079840:web:b330fb6a9dedbcc1c9b185",
  measurementId: "G-EKS3GF11EE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
