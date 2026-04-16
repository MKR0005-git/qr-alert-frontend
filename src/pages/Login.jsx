import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // 🔥 FIX: use popup instead of redirect
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ❗ IMPORTANT: don’t clear everything blindly
      const redirect = localStorage.getItem("redirectAfterLogin");

      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // 🔥 FIX: restore redirect AFTER clearing
      if (redirect) {
        localStorage.setItem("redirectAfterLogin", redirect);
      }

      // 🔥 REDIRECT FLOW
      const finalRedirect = localStorage.getItem("redirectAfterLogin");

      if (finalRedirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(finalRedirect);
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#111827] flex items-center justify-center text-white">

      <div className="bg-[#111827] border border-gray-800 p-8 rounded-2xl shadow-lg w-[360px] text-center">

        <h1 className="text-2xl font-bold mb-2">QR Alert 🚀</h1>
        <p className="text-gray-400 text-sm mb-6">
          Secure emergency QR system
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

      </div>

    </div>
  );
}