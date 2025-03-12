// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth ,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOB2_SQZ1L6rcDD87-3wYZMeYfTwEkGx4",
  authDomain: "ekbal-boys.firebaseapp.com",
  projectId: "ekbal-boys",
  storageBucket: "ekbal-boys.firebasestorage.app",
  messagingSenderId: "938292269495",
  appId: "1:938292269495:web:5974e80f48a94c2e4cd832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const submit = document.getElementById('submit');

  submit.addEventListener('click', function(event) {
    event.preventDefault();

        // inputs
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const code = document.getElementById('code').value;
  const grade = document.getElementById('grade').value;
  const room = document.getElementById('room').value;


  createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Signed up 
  const user = userCredential.user;
  window.location.href = "../index.html";
  // ...
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  alert(errorMessage);
  // ..
});

  })
