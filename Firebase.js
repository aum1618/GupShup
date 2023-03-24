// Import the functions you need from the SDKs you need
import { getDatabase } from "@firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYnThuIkcwOr_XAOhHlMd2_Fb1t0f0XNo",
  authDomain: "gupshup-dbb80.firebaseapp.com",
  databaseURL: "https://gupshup-dbb80-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gupshup-dbb80",
  storageBucket: "gupshup-dbb80.appspot.com",
  messagingSenderId: "62853303543",
  appId: "1:62853303543:web:1bd6dde0679e2dbd0797f2",
  measurementId: "G-5JRQG0BHLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig,{name:"GupShup",automaticDataCollectionEnabled:true});
export const auth=getAuth(app)
export const db=getDatabase(app)
export const firestoreDb=getFirestore(app)
export const appOptions= app.options
