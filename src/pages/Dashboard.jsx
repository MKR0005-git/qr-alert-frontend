import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Dashboard() {
  const navigate = useNavigate();

  const [qrs, setQrs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    unassigned: 0,
    scans: 0,
  });

  const role = localStorage.getItem("role");

  /* ================= USER FETCH ================= */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/my-qrs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setQrs(data);

      } catch (err) {
        alert(err.message);
      }
    };

    if (role !== "admin") {
      fetchUserData();
    }
  }, [navigate, role]);

  /* ================= ADMIN ANALYTICS ================= */
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/all-qrs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        const total = data.length;
        const activated = data.filter(q => q.isActivated).length;
        const unassigned = data.filter(q => !q.isActivated).length;
        const scans = data.reduce((sum, q) => sum + (q.scans || 0), 0);

        setStats({ total, activated, unassigned, scans });

      } catch (err) {
        console.log(err);
      }
    };

    if (role === "admin") {
      fetchAdminStats();
    }
  }, [role]);

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setQrs(prev => prev.filter(q => q._id !== id));
  };

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (size) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/download-unassigned/${size}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `unassigned-qrs-${size}.zip`;
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#111827] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {role === "admin" ? "Admin Dashboard" : "My Dashboard"}
          </h1>

          <p className="text-gray-400 mt-1">
            {role === "admin"
              ? "Manage system QR codes"
              : "Manage your QR profiles"}
          </p>
        </div>

        {/* ================= ADMIN ANALYTICS ================= */}
        {role === "admin" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-xl text-center shadow">
              <p className="text-sm opacity-80">Total QRs</p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 rounded-xl text-center shadow">
              <p className="text-sm opacity-80">Activated</p>
              <h2 className="text-2xl font-bold">{stats.activated}</h2>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-5 rounded-xl text-center shadow">
              <p className="text-sm opacity-80">Unassigned</p>
              <h2 className="text-2xl font-bold">{stats.unassigned}</h2>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-5 rounded-xl text-center shadow">
              <p className="text-sm opacity-80">Total Scans</p>
              <h2 className="text-2xl font-bold">{stats.scans}</h2>
            </div>

          </div>
        )}

        {/* ================= ADMIN ACTIONS ================= */}
        {role === "admin" && (
          <>
            <div className="flex gap-4 mb-6">

              <button
                onClick={() => navigate("/admin/generate")}
                className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 rounded-lg hover:scale-105 transition"
              >
                + Generate QR
              </button>

              <button
                onClick={() => navigate("/admin/qrs")}
                className="bg-blue-500 px-5 py-2 rounded-lg hover:scale-105 transition"
              >
                View All QR
              </button>

            </div>

            {/* DOWNLOAD */}
            <div className="bg-[#111827] p-6 rounded-xl mb-10 border border-gray-800">

              <h2 className="mb-4 font-semibold">
                Download Unassigned QRs (Bulk)
              </h2>

              <div className="flex gap-3">
                <button onClick={() => handleDownload(3)} className="bg-green-500 px-4 py-2 rounded">3x3</button>
                <button onClick={() => handleDownload(6)} className="bg-orange-500 px-4 py-2 rounded">6x6</button>
                <button onClick={() => handleDownload(8)} className="bg-purple-500 px-4 py-2 rounded">8x8</button>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Download all unassigned QR codes as ZIP for selling/printing
              </p>

            </div>
          </>
        )}

        {/* ================= USER ================= */}
        {role !== "admin" && (
          <>
            <h2 className="text-xl mb-4">My QR Codes</h2>

            {qrs.length === 0 ? (
              <div className="bg-[#111827] p-8 rounded-xl text-center border border-gray-800">
                <p className="text-gray-400 mb-3">No QR codes yet</p>
                <button
                  onClick={() => navigate("/create")}
                  className="bg-orange-500 px-5 py-2 rounded"
                >
                  Create QR
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {qrs.map(qr => (
                  <Card key={qr._id} id={qr._id} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}