import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AdminQRList() {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchQrs = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
          navigate("/login");
          return;
        }

        // 🔥 extra safety: only admin allowed
        if (role !== "admin") {
          alert("Access denied");
          navigate("/");
          return;
        }

        const res = await fetch(`${API_URL}/all-qrs`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ CORRECT
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch QRs");
        }

        setQrs(data || []);

      } catch (err) {
        console.error(err);
        alert(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQrs();
  }, [navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">
        All QR Codes
      </h1>

      {/* EMPTY */}
      {qrs.length === 0 && (
        <p className="text-gray-400">No QR codes found</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {qrs.map((qr) => (
          <div
            key={qr._id}
            className="bg-[#111827] p-5 rounded-xl border border-gray-800 text-center"
          >

            {/* QR IMAGE */}
            <img
              src={`${API_URL}/generate-qr/${qr._id}`}
              className="mx-auto mb-4 w-32 bg-white p-2 rounded cursor-pointer hover:scale-105 transition"
              onClick={() => window.open(`${API_URL}/generate-qr/${qr._id}`, "_blank")}
            />

            {/* NAME */}
            <p className="text-sm font-semibold">
              {qr.name || "UNASSIGNED"}
            </p>

            {/* STATUS */}
            <p
              className={`text-xs mt-1 font-semibold ${
                qr.isActivated ? "text-green-400" : "text-red-400"
              }`}
            >
              {qr.isActivated ? "Activated" : "Not Activated"}
            </p>

            {/* USER EMAIL (DEBUG / ADMIN VIEW) */}
            {qr.userEmail && (
              <p className="text-[10px] text-gray-500 mt-1">
                {qr.userEmail}
              </p>
            )}

            {/* SCANS */}
            <p className="text-gray-400 text-xs mt-1">
              Scans: {qr.scans || 0}
            </p>

            {/* DOWNLOAD */}
            <div className="flex justify-center gap-2 mt-3 text-xs">
              <a href={`${API_URL}/download-qr/${qr._id}/6`} className="bg-orange-500 px-2 py-1 rounded">6x6</a>
              <a href={`${API_URL}/download-qr/${qr._id}/8`} className="bg-pink-500 px-2 py-1 rounded">8x8</a>
              <a href={`${API_URL}/download-qr/${qr._id}/12`} className="bg-purple-500 px-2 py-1 rounded">12x12</a>
            </div>

            {/* ACTION */}
            <button
              onClick={() => navigate(`/profile/${qr._id}`)}
              className="text-blue-400 text-xs mt-3"
            >
              View Profile
            </button>

            {/* ID */}
            <p className="text-gray-500 text-[10px] mt-2 break-all">
              {qr._id}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}