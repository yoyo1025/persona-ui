// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPN9QLneeRX35mn3agx9aFE1DrX3LCGYU",
  authDomain: "persona-8adb4.firebaseapp.com",
  projectId: "persona-8adb4",
  storageBucket: "persona-8adb4.appspot.com",
  messagingSenderId: "301902385743",
  appId: "1:301902385743:web:c1cc3f157a873451e7103a",
  measurementId: "G-Z13XTT9JCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// FirebaseのAuthを取得してエクスポート
export const auth = getAuth(app);