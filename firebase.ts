import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDw6HKBlla2UhqsPlXmDnJBqfDANQWYhkc",
  authDomain: "wallxpress-50f0c.firebaseapp.com",
  projectId: "wallxpress-50f0c",
  storageBucket: "wallxpress-50f0c.firebasestorage.app",
  // storageBucket: "wallxpress-50f0c.appspot.com",
  messagingSenderId: "413776784072",
  appId: "1:413776784072:web:ec458abd857d7a1b69d3fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app)

export const storage = getStorage(app);