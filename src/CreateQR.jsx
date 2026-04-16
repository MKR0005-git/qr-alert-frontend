import { useState } from "react";
import { API_URL } from "../config";

export default function CreateQR() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyEmail: ""
  });

  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // 🔥 CREATE QR
      const res = await fetch(`${API_URL}/create-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(form)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to create QR");
      }

      // 🔥 GENERATE QR IMAGE
      const qrRes = await fetch(`${API_URL}/generate-qr/${data.id}`);
      const qrHtml = await qrRes.text();

      setQr(qrHtml);

    } catch (err) {
      console.log(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center text-white bg-[#0B0F19] min-h-screen">
      <h1 className="text-3xl mb-6 font-bold">Create QR</h1>

      <input
        className="border p-2 mb-2 w-64 text-black"
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-64 text-black"
        placeholder="Phone"
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-64 text-black"
        placeholder="Blood Group"
        onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-64 text-black"
        placeholder="Emergency Contact"
        onChange={e =>
          setForm({ ...form, emergencyContact: e.target.value })
        }
      />

      <input
        className="border p-2 mb-4 w-64 text-black"
        placeholder="Emergency Email"
        type="email"
        onChange={e =>
          setForm({ ...form, emergencyEmail: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create QR"}
      </button>

      {/* 🔥 SHOW QR */}
      {qr && (
        <div
          className="mt-8 bg-white p-4 rounded-xl shadow-lg"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
      )}
    </div>
  );
}