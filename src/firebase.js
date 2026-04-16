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

/* 🔥 IMPORTANT: helps mobile + language handling */
auth.useDeviceLanguage();

/* ================= PROVIDER ================= */
export const provider = new GoogleAuthProvider();

/* ================= LOGIN ================= */
export const loginWithGoogle = async (forceSelect = false) => {
  try {
    const customProvider = new GoogleAuthProvider();

    // 🔥 force account selection if needed
    if (forceSelect) {
      customProvider.setCustomParameters({
        prompt: "select_account",
      });
    }

    // 🔥 ALWAYS use popup (fixes mobile crash)
    const result = await signInWithPopup(auth, customProvider);

    if (!result || !result.user) {
      throw new Error("Google login failed");
    }

    console.log("Firebase user:", result.user);

    return result.user;

  } catch (err) {
    console.error("Firebase Login Error:", err);

    // 🔥 better error messages
    if (err.code === "auth/popup-blocked") {
      throw new Error("Popup blocked. Please allow popups and try again.");
    }

    if (err.code === "auth/cancelled-popup-request") {
      throw new Error("Login cancelled");
    }

    throw new Error(err.message || "Google login failed");
  }
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  try {
    await signOut(auth);

    // 🔥 clear only required data (safe)
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    console.log("User logged out");

  } catch (err) {
    console.error("Logout Error:", err);
  }
};