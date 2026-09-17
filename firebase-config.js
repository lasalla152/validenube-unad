// firebase-config.js

// TODO: Reemplaza este objeto con la configuración real de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDm0M-wGPIjqi454dCXb4lEgIggKUyv_Dk",
  authDomain: "lodewhapan.firebaseapp.com",
  databaseURL: "https://lodewhapan-default-rtdb.firebaseio.com",
  projectId: "lodewhapan",
  storageBucket: "lodewhapan.firebasestorage.app",
  messagingSenderId: "398341765710",
  appId: "1:398341765710:web:c02624c15ab51dfe7aa11f"
};

// Inicializar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, push, update, onValue, onDisconnect, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, ref, set, push, update, onValue, onDisconnect, remove, signInWithEmailAndPassword, onAuthStateChanged };
