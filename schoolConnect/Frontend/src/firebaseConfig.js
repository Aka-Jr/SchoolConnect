// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3QGAV-4ZXEdllcAOUcU-BZDNoN-wRbzY",
  authDomain: "fir-3d4ce.firebaseapp.com",
  projectId: "fir-3d4ce",
  storageBucket: "fir-3d4ce.appspot.com",
  messagingSenderId: "897752881714",
  appId: "1:897752881714:web:d7980ab1c398177777fa2b",
  measurementId: "G-LM9Z834BMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();