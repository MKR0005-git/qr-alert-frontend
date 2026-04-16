import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/my-qrs`, { // 🔥 FIXED
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 FIXED
          },
        });

        let result;
        try {
          result = await res.json();
        } catch {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch alerts");
        }

        setData(result);

      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#111827] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold mb-6">
          Alerts 🚨
        </h1>

        {data.length === 0 ? (
          <div className="bg-[#111827] p-10 rounded-xl text-center border border-gray-800">
            <p className="text-gray-400">No alerts yet</p>
          </div>
        ) : (

          <div className="space-y-6">

            {data.map(qr => (
              <div
                key={qr._id}
                className="bg-[#111827] border border-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
              >

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {qr.name}
                  </h2>

                  <span className="text-sm text-orange-400 font-bold">
                    {qr.scans} scans
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">

                  {qr.scanHistory && qr.scanHistory.length > 0 ? (
                    qr.scanHistory
                      .slice()
                      .reverse()
                      .map((scan, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-[#0B0F19] px-4 py-2 rounded-lg border border-gray-800 text-sm"
                        >
                          <span className="text-gray-400">
                            📱 {scan.device || "Unknown"}
                          </span>

                          <span className="text-gray-500">
                            {new Date(scan.time).toLocaleString()}
                          </span>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No scan history
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}