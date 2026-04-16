import { useState } from "react";
import { API_URL } from "../config";
export default function CreateQR() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    emergencyContact: ""
  });

  const [qr, setQr] = useState("");

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED"); // debug

    try {
      // 1. Save data
      const res = await fetch("${API_URL}/create-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      // 2. Generate QR
      const qrRes = await fetch(
        `${API_URL}/generate-qr/${data.id}`
      );

      const qrHtml = await qrRes.text();

      // 3. Show QR
      setQr(qrHtml);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-3xl mb-6 font-bold">Create QR</h1>

      <input
        className="border p-2 mb-2 w-64"
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-64"
        placeholder="Phone"
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-64"
        placeholder="Blood Group"
        onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
      />

      <input
        className="border p-2 mb-4 w-64"
        placeholder="Emergency Contact"
        onChange={e => setForm({ ...form, emergencyContact: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-6 py-2 rounded-lg"
      >
        Submit
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