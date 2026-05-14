import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDNYRqVJAkYwh1VK6IAA6qoL0dsv30K00",
  authDomain: "bazartech-solidario.firebaseapp.com",
  projectId: "bazartech-solidario",
  storageBucket: "bazartech-solidario.firebasestorage.app",
  messagingSenderId: "513012043235",
  appId: "1:513012043235:web:5c49d57b93d9f9669764d6"
};

const app = initializeApp(firebaseConfig);

export default app;