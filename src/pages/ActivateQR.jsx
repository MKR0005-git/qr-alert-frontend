import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config";

export default function ActivateQR() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirectAfterLogin", `/activate/${id}`);
      navigate("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [id, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (
      !form.name ||
      !form.phone ||
      !form.bloodGroup ||
      !form.emergencyContact
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.phone.length < 10 || form.emergencyContact.length < 10) {
      alert("Enter valid phone numbers");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/activate-qr/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Activation failed");
      }

      alert("QR Activated Successfully ✅");

      localStorage.removeItem("redirectAfterLogin");

      navigate(`/profile/${id}`);

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm"
      >
        ← Back
      </button>

      {/* CARD */}
      <div className="bg-[#111827] p-6 rounded-xl w-[350px] border border-orange-500 shadow-xl">

        <h2 className="text-xl font-bold mb-5 text-center text-orange-400">
          Activate QR
        </h2>

        {/* NAME */}
        <input
          placeholder="Full Name"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Phone Number"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
        />

        {/* BLOOD */}
        <input
          placeholder="Blood Group"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, bloodGroup: e.target.value })
          }
        />

        {/* EMERGENCY CONTACT */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Emergency Contact"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              emergencyContact: e.target.value.replace(/\D/g, ""),
            })
          }
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Emergency Email (optional)"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              emergencyEmail: e.target.value,
            })
          }
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Activating..." : "Activate QR"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Login required to activate QR
        </p>

      </div>
    </div>
  );
}