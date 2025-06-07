import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhPy_l6EpXlTo6CKUeJzHRxgYWZMxOM_o",
  authDomain: "fichas-obras.firebaseapp.com",
  databaseURL: "https://fichas-obras-default-rtdb.firebaseio.com",
  projectId: "fichas-obras",
  storageBucket: "fichas-obras.firebasestorage.app",
  messagingSenderId: "282422497651",
  appId: "1:282422497651:web:29a7521c1f52cea74cf506",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, storage };
