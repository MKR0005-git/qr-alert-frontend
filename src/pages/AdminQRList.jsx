import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AdminQRList() {
  const [activated, setActivated] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchQrs = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        alert("Access denied");
        navigate("/");
        return;
      }

      const res = await fetch(`${API_URL}/all-qrs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch QRs");
      }

      setActivated(data.filter(q => q.isActivated));
      setUnassigned(data.filter(q => !q.isActivated));

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
    const interval = setInterval(fetchQrs, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (id, size) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/download-qr/${id}/${size}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `QR-${id}-${size}.png`;
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!confirm("Delete this QR permanently?")) return;

      const res = await fetch(`${API_URL}/delete-qr/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setActivated(prev => prev.filter(q => q._id !== id));
      setUnassigned(prev => prev.filter(q => q._id !== id));

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= CARD ================= */
  const renderCard = (qr) => (
    <div
      key={qr._id}
      className="bg-[#111827] p-5 rounded-xl border border-gray-800 text-center shadow-lg hover:shadow-2xl transition"
    >

      {/* 🔥 PREMIUM QR BOX */}
      <div className="bg-white p-3 rounded-xl inline-block shadow-md hover:scale-105 transition">
        <img
          src={`${API_URL}/generate-qr/${qr._id}`}
          className="w-32 cursor-pointer"
          onClick={() =>
            window.open(`${API_URL}/generate-qr/${qr._id}`, "_blank")
          }
        />
      </div>

      {/* NAME */}
      <p className="text-sm font-semibold mt-4">
        {qr.name || "UNASSIGNED"}
      </p>

      {/* STATUS */}
      <p className={`text-xs mt-1 font-semibold ${
        qr.isActivated ? "text-green-400" : "text-red-400"
      }`}>
        {qr.isActivated ? "Activated" : "Not Activated"}
      </p>

      {/* EMAIL */}
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
        <button onClick={() => handleDownload(qr._id, 6)} className="bg-orange-500 px-2 py-1 rounded">6x6</button>
        <button onClick={() => handleDownload(qr._id, 8)} className="bg-pink-500 px-2 py-1 rounded">8x8</button>
        <button onClick={() => handleDownload(qr._id, 12)} className="bg-purple-500 px-2 py-1 rounded">12x12</button>
      </div>

      {/* ACTIONS */}
      <button
        onClick={() => navigate(`/profile/${qr._id}`)}
        className="text-blue-400 text-xs mt-3"
      >
        View Profile
      </button>

      <button
        onClick={() => handleDelete(qr._id)}
        className="text-red-400 text-xs mt-2"
      >
        Delete
      </button>

      {/* ID */}
      <p className="text-gray-500 text-[10px] mt-2 break-all">
        {qr._id}
      </p>

    </div>
  );

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

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <button
          onClick={fetchQrs}
          className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        >
          Refresh
        </button>
      </div>

      {/* ACTIVATED */}
      <h2 className="text-2xl font-bold mb-4 text-green-400">
        Activated QRs
      </h2>

      {activated.length === 0 ? (
        <p className="text-gray-400 mb-10">No activated QRs</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {activated.map(renderCard)}
        </div>
      )}

      {/* UNASSIGNED */}
      <h2 className="text-2xl font-bold mb-4 text-red-400">
        Unassigned QRs
      </h2>

      {unassigned.length === 0 ? (
        <p className="text-gray-400">No unassigned QRs</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {unassigned.map(renderCard)}
        </div>
      )}

    </div>
  );
}