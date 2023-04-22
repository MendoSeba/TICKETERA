// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQo3nWpxGAR_zDrETOBvCX9LSeuv_3AgM",
  authDomain: "ticketera-652e0.firebaseapp.com",
  projectId: "ticketera-652e0",
  storageBucket: "ticketera-652e0.appspot.com",
  messagingSenderId: "947267080476",
  appId: "1:947267080476:web:a9bbbf2d85e59500d7ead9",
  measurementId: "G-97DJ8X7RD1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
export { app, auth };