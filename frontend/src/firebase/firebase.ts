import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
                apiKey: import.meta.env['VITE_FIREBASE_API_KEY'],
                authDomain: import.meta.env['VITE_AUTH_ADOMIN'],
                projectId: import.meta.env['VITE_PROJECT_ID'],
                storageBucket: import.meta.env['VITE_STORAGE_BUCKET'],
                messagingSenderId: import.meta.env['VITE_MESSAGING_SENDER_ID'],
                appId: import.meta.env['VITE_APP_ID'],
                measurementId: import.meta.env['VITE_MEANSUREMNT_ID']
};

const firebase_app = initializeApp(firebaseConfig);
const auth = getAuth(firebase_app);
const provider = new GithubAuthProvider();

export { auth, provider };