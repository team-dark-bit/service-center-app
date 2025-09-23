
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLZ0WkND3watoYlhw8ZfoBSSvKuyJTqhQ",
  authDomain: "imagenesproductos-f4b71.firebaseapp.com",
  projectId: "imagenesproductos-f4b71",
  storageBucket: "imagenesproductos-f4b71.firebasestorage.app",
  messagingSenderId: "550571510848",
  appId: "1:550571510848:web:297a50eee4f51a4c59e3a5",
  measurementId: "G-9C2J3FEQRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };