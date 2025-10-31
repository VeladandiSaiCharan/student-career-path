// Import the functions you need from the SDKs (via CDN links)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth , /*createUserWithEmailAndPassword, signInWithEmailAndPassword*/} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2G2ujAcVwJk2j9EMq2JtJp06w4hSzMLA",
  authDomain: "career-path-guide-ee5de.firebaseapp.com",
  projectId: "career-path-guide-ee5de",
  storageBucket: "career-path-guide-ee5de.appspot.com",
  messagingSenderId: "307615241440",
  appId: "1:307615241440:web:e92913bbc92a3b24c7ac85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// Import the functions you need from the SDKs (via CDN links)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth , /*createUserWithEmailAndPassword, signInWithEmailAndPassword*/} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2G2ujAcVwJk2j9EMq2JtJp06w4hSzMLA",
  authDomain: "career-path-guide-ee5de.firebaseapp.com",
  projectId: "career-path-guide-ee5de",
  storageBucket: "career-path-guide-ee5de.appspot.com",
  messagingSenderId: "307615241440",
  appId: "1:307615241440:web:e92913bbc92a3b24c7ac85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

