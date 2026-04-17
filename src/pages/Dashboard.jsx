import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
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

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch");
        }

        setQrs(data);

      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (role !== "admin") {
      fetchData();
    } else {
      setLoading(false);
    }

  }, [navigate, role]);

  /* 🔥 HANDLE DELETE (IMPORTANT FIX) */
  const handleDelete = (id) => {
    setQrs(prev => prev.filter(q => q._id !== id));
  };

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
                ? "Manage system QR codes"
                : "Manage your QR profiles"}
            </p>
          </div>

          {role !== "admin" && (
            <button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              + Create QR
            </button>
          )}
        </div>

        {/* ADMIN ACTIONS */}
        {role === "admin" && (
          <div className="flex flex-wrap gap-4 mb-6">

            <button
              onClick={() => navigate("/admin/generate")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              + Generate QR
            </button>

            <button
              onClick={() => navigate("/admin/qrs")}
              className="bg-blue-500 px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              View All QR
            </button>

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
                {qrs.map((qr) => (
                  <Card
                    key={qr._id}
                    id={qr._id}
                    onDelete={handleDelete} // 🔥 FIX CONNECTED
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}