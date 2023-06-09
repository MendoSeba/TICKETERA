import firebase from "firebase";
import firebaseui from 'firebaseui';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_DOMINIO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_BUCKET.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
  };
 const uiConfig = {
    singInOptions: {
        firebase,auth,EmailAuthProvider,PROVIDER_ID,
    },
 };
  
  firebase.initializeApp(firebaseConfig);


  export const auth = firebase.auth();
  export const db = firebase.firestore();
  
  db.settings ({
    timestampsInSnapshots: true,
  });
export const startUI = () => {
    const ui = new firebase.auth.AuthUi (auth);
    ui.start(elemetId, uiConfig);
}