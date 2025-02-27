import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain:process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APIID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
