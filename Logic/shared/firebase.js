
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBGi5qNYJgeRRETqjQ-PdqlL4BE_hktFZI",
    authDomain: "ekbal-edu-app.firebaseapp.com",
    projectId: "ekbal-edu-app",
    storageBucket: "ekbal-edu-app.firebasestorage.app",
    messagingSenderId: "826151602789",
    appId: "1:826151602789:web:a9c57f630fd8322a7b548c"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  const auth = getAuth(app);

  // Initialize Firestore
  const db = getFirestore(app);

  // Export auth for use in other modules
  export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, db };
