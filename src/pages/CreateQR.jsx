import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function CreateQR() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyEmail: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // ✅ VALIDATION
      if (
        !form.name.trim() ||
        !form.phone ||
        !form.bloodGroup.trim() ||
        !form.emergencyContact
      ) {
        alert("Please fill all required fields");
        return;
      }

      if (form.phone.length !== 10 || form.emergencyContact.length !== 10) {
        alert("Phone numbers must be 10 digits");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API_URL}/create-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ CORRECT
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          bloodGroup: form.bloodGroup.trim(),
          emergencyContact: form.emergencyContact,
          emergencyEmail: form.emergencyEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create QR");
      }

      // ✅ SUCCESS
      alert("QR Created Successfully ✅");

      // 🔥 IMPORTANT: force refresh flow
      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white relative flex items-center justify-center p-4">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm"
      >
        ← Back
      </button>

      {/* CARD */}
      <div className="bg-[#111827] p-8 rounded-xl shadow w-[400px] border border-gray-800">

        <h2 className="text-xl font-bold mb-6 text-center">
          Create QR Profile
        </h2>

        {/* NAME */}
        <input
          placeholder="Name"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Phone"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.phone}
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
          value={form.bloodGroup}
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
          value={form.emergencyContact}
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
          className="w-full mb-4 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.emergencyEmail}
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
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create QR"}
        </button>

      </div>
    </div>
  );
}