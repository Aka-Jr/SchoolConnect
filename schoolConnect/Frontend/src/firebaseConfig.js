// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg4MUh1kxFgHRI8DSazpe2kPyXr66N-DI",
  authDomain: "schoolconnect-69f2c.firebaseapp.com",
  projectId: "schoolconnect-69f2c",
  storageBucket: "schoolconnect-69f2c.appspot.com",
  messagingSenderId: "563465787323",
  appId: "1:563465787323:web:8f8da5aea601aceda1569e",
  measurementId: "G-6PGLLNC90C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);