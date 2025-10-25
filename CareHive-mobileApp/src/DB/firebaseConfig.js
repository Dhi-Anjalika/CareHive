import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkiUU9Qp2zQM1twyKNHuCwX3uVzC4k_CE",
  authDomain: "carehive-22637.firebaseapp.com",
  projectId: "carehive-22637",
  storageBucket: "carehive-22637.appspot.com",
  messagingSenderId: "819124786713",
  appId: "1:819124786713:web:6a02cc6fc41891639ebc88"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
