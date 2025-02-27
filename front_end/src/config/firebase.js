import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMDvc4_HoST6V54PDuCPpwNlpdzVi2EGU",
  authDomain: "vehicle-tracking-system-e465c.firebaseapp.com",
  projectId: "vehicle-tracking-system-e465c",
  storageBucket: "vehicle-tracking-system-e465c.firebasestorage.app",
  messagingSenderId: "441849404318",
  appId: "1:441849404318:web:29ce587eff5f43de28948f",
  measurementId: "G-J8QPYJ6T6D"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
