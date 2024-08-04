// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYUfDIYBzytc9WcGXEfsmRFmDx_sFU30A",
  authDomain: "pantrytracker-c0ca7.firebaseapp.com",
  projectId: "pantrytracker-c0ca7",
  storageBucket: "pantrytracker-c0ca7.appspot.com",
  messagingSenderId: "573857417314",
  appId: "1:573857417314:web:4ab5adecad1b3117e5e93b",
  measurementId: "G-F9CG0XSCJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { firestore, storage }; // Export firestore and storage


