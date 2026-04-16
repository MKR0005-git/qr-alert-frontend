import { loginWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const user = await loginWithGoogle();

      const res = await fetch("http://192.168.1.2:5000/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
        }),
      });

      const data = await res.json();

      /* 🔥 CLEAR + SAVE SESSION */
      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      /* 🔥 REDIRECT BACK LOGIC */
      const redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log(err);
      alert("Login failed");
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