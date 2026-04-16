import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQR() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyEmail: "", // 🔥 NEW
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // ✅ VALIDATION
      if (
        !form.name ||
        !form.phone ||
        !form.bloodGroup ||
        !form.emergencyContact ||
        !form.emergencyEmail
      ) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

      const res = await fetch("http://192.168.1.2:5000/create-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create QR");
      }

      navigate("/");

    } catch (err) {
      console.log(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white relative flex items-center justify-center p-4">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm transition"
      >
        ← Back
      </button>

      {/* FORM CARD */}
      <div className="bg-[#111827] p-8 rounded-xl shadow w-[400px] border border-gray-800">

        <h2 className="text-xl font-bold mb-6 text-center">
          Create QR Profile
        </h2>

        <input
          placeholder="Name"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Blood Group"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.bloodGroup}
          onChange={(e) =>
            setForm({ ...form, bloodGroup: e.target.value })
          }
        />

        <input
          placeholder="Emergency Contact"
          className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.emergencyContact}
          onChange={(e) =>
            setForm({
              ...form,
              emergencyContact: e.target.value,
            })
          }
        />

        {/* 🔥 NEW FIELD */}
        <input
          placeholder="Emergency Email"
          type="email"
          className="w-full mb-4 p-2 bg-[#0B0F19] border border-gray-700 rounded"
          value={form.emergencyEmail}
          onChange={(e) =>
            setForm({
              ...form,
              emergencyEmail: e.target.value,
            })
          }
        />

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