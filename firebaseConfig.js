import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnlse5Fpi5F0IAj3TUOePJKJ7xTXcKBxg",
  authDomain: "booklibraryapp-f7557.firebaseapp.com",
  projectId: "booklibraryapp-f7557",
  storageBucket: "booklibraryapp-f7557.appspot.com",
  messagingSenderId: "674237151357",
  appId: "1:674237151357:web:10ff7d4c1c3f8cf9a39914"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
