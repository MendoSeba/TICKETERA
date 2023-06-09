
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use




const firebaseConfig = {
  apiKey: "AIzaSyCQo3nWpxGAR_zDrETOBvCX9LSeuv_3AgM",
  authDomain: "ticketera-652e0.firebaseapp.com",
  projectId: "ticketera-652e0",
  storageBucket: "ticketera-652e0.appspot.com",
  messagingSenderId: "947267080476",
  appId: "1:947267080476:web:a9bbbf2d85e59500d7ead9",
  measurementId: "G-97DJ8X7RD1"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth();
export { app, auth };