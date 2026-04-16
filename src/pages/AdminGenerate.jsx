import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
export default function AdminGenerate() {
  const navigate = useNavigate();

  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState([]);

  const token = localStorage.getItem("token");

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const res = await fetch("${API_URL}/bulk-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ count }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setGenerated(data);

    } catch (err) {
      alert(err.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        Generate Blank QR Codes
      </h1>

      {/* INPUT */}
      <div className="flex gap-4 items-center mb-6">

        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="bg-[#111827] border border-gray-700 px-4 py-2 rounded w-32"
          min="1"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

      </div>

      {/* RESULT */}
      {generated.length > 0 && (
        <div>

          <h2 className="text-lg mb-4">
            Generated QR Codes ({generated.length})
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {generated.map((qr) => (
              <div
                key={qr._id}
                className="bg-[#111827] p-4 rounded-xl text-center border border-gray-800"
              >

                <img
                  src={`${API_URL}/generate-qr/${qr._id}`}
                  className="mx-auto mb-3 w-32 bg-white p-2 rounded"
                />

                <p className="text-xs text-gray-400 break-all">
                  {qr._id}
                </p>

                <p className="text-red-400 text-xs mt-1">
                  Not Activated
                </p>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}