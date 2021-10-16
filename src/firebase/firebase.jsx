

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWkk1cBC0AKQUWkAOeUvugiNX-b9ADdPE",
  authDomain: "t-tiktok.firebaseapp.com",
  projectId: "t-tiktok",
  storageBucket: "t-tiktok.appspot.com",
  messagingSenderId: "29922305899",
  appId: "1:29922305899:web:08a778850fba1a70084e2e",
  measurementId: "G-EYMTV41W4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore();


export default db;
