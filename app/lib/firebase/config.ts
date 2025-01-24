import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSm4zzttijcM1YOPsMyBhJzs8sKkIAmw8",
  authDomain: "starlinks-95fd7.firebaseapp.com",
  projectId: "starlinks-95fd7",
  storageBucket: "starlinks-95fd7.firebasestorage.app",
  messagingSenderId: "151374480032",
  appId: "1:151374480032:web:f8d515e1872b48dce5bfc5",
  measurementId: "G-PWB1GZMJJG",
};

const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export const auth = getAuth(app);

export default app;
