import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAmccgTZfKGaBL1RRJD-oB1XGgg88Jgpt8",
  authDomain: "qr-alert-3b598.firebaseapp.com",
  projectId: "qr-alert-3b598",
  storageBucket: "qr-alert-3b598.firebasestorage.app",
  messagingSenderId: "429931856677",
  appId: "1:429931856677:web:061310f843228a0f3f50cc",
};

/* ================= INIT ================= */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* ================= PROVIDER ================= */
// default provider (no forced popup)
export const provider = new GoogleAuthProvider();

/* ================= LOGIN ================= */
// forceSelect = true → ask account
// forceSelect = false → auto login (default)
export const loginWithGoogle = async (forceSelect = false) => {
  try {
    const customProvider = new GoogleAuthProvider();

    if (forceSelect) {
      customProvider.setCustomParameters({
        prompt: "select_account",
      });
    }

    const result = await signInWithPopup(auth, customProvider);

    console.log("Firebase user:", result.user);

    return result.user;

  } catch (err) {
    console.error("Firebase Login Error:", err);
    throw err;
  }
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  try {
    await signOut(auth);

    // clear app session
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    console.log("User logged out");

  } catch (err) {
    console.error("Logout Error:", err);
  }
};