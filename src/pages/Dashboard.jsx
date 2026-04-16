import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
export default function Dashboard() {
  const navigate = useNavigate();
  const [qrs, setQrs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "admin") {
      fetch("${API_URL}/admin-analytics", {
        headers: { Authorization: token },
      })
        .then(res => res.json())
        .then(setStats)
        .finally(() => setLoading(false));
    } else {
      fetch("${API_URL}/my-qrs", {
        headers: { Authorization: token },
      })
        .then(res => res.json())
        .then(setQrs)
        .finally(() => setLoading(false));
    }
  }, [navigate, role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#111827] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {role === "admin" ? "Admin Dashboard" : "My Dashboard"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {role === "admin"
                ? "System analytics overview"
                : "Manage your QR profiles"}
            </p>
          </div>

          {/* USER BUTTON */}
          {role !== "admin" && (
            <button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              + Create QR
            </button>
          )}
        </div>

        {/* 🔥 ADMIN ACTIONS */}
        {role === "admin" && (
          <>
            <div className="flex flex-wrap gap-4 mb-6">

              {/* GENERATE */}
              <button
                onClick={() => navigate("/admin/generate")}
                className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                + Generate QR
              </button>

              {/* VIEW */}
              <button
                onClick={() => navigate("/admin/qrs")}
                className="bg-blue-500 px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                View All QR
              </button>

            </div>

            {/* 🔥 PDF DOWNLOAD SECTION */}
            <div className="flex flex-wrap gap-4 mb-8">

              <button
                onClick={() =>
                  window.open("${API_URL}/download-all-qrs/6")
                }
                className="bg-green-500 px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                📄 PDF 6x6
              </button>

              <button
                onClick={() =>
                  window.open("${API_URL}/download-all-qrs/8")
                }
                className="bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                📄 PDF 8x8
              </button>

              <button
                onClick={() =>
                  window.open("${API_URL}/download-all-qrs/12")
                }
                className="bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                📄 PDF 12x12
              </button>

            </div>
          </>
        )}

        {/* ADMIN STATS */}
        {role === "admin" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Total QR Codes", value: stats?.totalQR },
              { label: "Total Scans", value: stats?.totalScans },
              { label: "Active QR", value: stats?.activeQR },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#111827] p-6 rounded-xl border border-gray-800 shadow"
              >
                <p className="text-gray-400 text-sm mb-2">{item.label}</p>
                <h2 className="text-3xl font-bold text-orange-400">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>
        )}

        {/* USER SECTION */}
        {role !== "admin" && (
          <>
            <h2 className="text-xl font-semibold mb-4">My QR Codes</h2>

            {qrs.length === 0 ? (
              <div className="bg-[#111827] p-10 rounded-xl text-center border border-gray-800">
                <p className="text-gray-400 mb-4">No QR codes yet</p>
                <button
                  onClick={() => navigate("/create")}
                  className="bg-orange-500 px-6 py-2 rounded-lg"
                >
                  Create your first QR
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {qrs.map(qr => (
                  <Card key={qr._id} id={qr._id} />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}