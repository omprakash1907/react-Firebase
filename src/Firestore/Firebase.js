// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQnhZf6DPUHVTHOOnS63_s_oXlZATGuQQ",
  authDomain: "fir-crud-9c4d1.firebaseapp.com",
  projectId: "fir-crud-9c4d1",
  storageBucket: "fir-crud-9c4d1.appspot.com",
  messagingSenderId: "636325538262",
  appId: "1:636325538262:web:310937bb916c3579315c77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)