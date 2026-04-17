import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/qr-data/${id}`);
        if (!res.ok) throw new Error("Fetch failed");

        const json = await res.json();
        setData(json);

        if (json?.isActivated) {
          setTimeout(() => setShowPopup(true), 1500);
        }

      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchData();
  }, [id]);

  /* ================= EMERGENCY ================= */
  const handleEmergency = async () => {
    let locationText = "Location not available";

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      locationText = `https://maps.google.com/?q=${latitude},${longitude}`;
    } catch {
      console.log("Location denied");
    }

    const phone = (data?.emergencyContact || "").replace(/\D/g, "");

    const message = `🚨 EMERGENCY ALERT 🚨
Name: ${data?.name}
Blood Group: ${data?.bloodGroup}

Location:
${locationText}`;

    // ✅ FIX: direct redirect (mobile safe)
    if (phone) {
      window.location.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      return;
    }

    // fallback email
    if (data?.emergencyEmail) {
      window.location.href =
        `mailto:${data.emergencyEmail}?subject=Emergency Alert&body=${encodeURIComponent(message)}`;
    }
  };

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        Failed to load data ❌
      </div>
    );
  }

  /* ================= LOADING ================= */
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  /* ================= NOT ACTIVATED ================= */
  if (!data.isActivated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-400"
        >
          ← Back
        </button>

        <div className="bg-[#111827] p-6 rounded-xl border border-orange-500 text-center w-[320px]">
          <h2 className="text-xl font-bold text-orange-400 mb-3">
            QR Not Activated
          </h2>

          <p className="text-gray-400 text-sm mb-5">
            This QR is not linked yet. Please activate to use emergency features.
          </p>

          <button
            onClick={() => navigate(`/activate/${id}`)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded"
          >
            Activate Now
          </button>
        </div>
      </div>
    );
  }

  /* ================= ACTIVATED ================= */
  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-4">

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm"
      >
        ← Back
      </button>

      <div className="w-full max-w-md bg-[#111827] border border-red-500 rounded-2xl shadow-xl p-6">

        <div className="text-center mb-6">
          <h1 className="text-red-500 font-bold text-lg">
            🚑 EMERGENCY PROFILE
          </h1>
        </div>

        <div className="bg-[#0B0F19] p-4 rounded-xl text-center mb-5">
          <h2 className="text-xl font-bold">{data.name || "Unknown"}</h2>
          <p className="text-red-400 mt-1">🩸 {data.bloodGroup || "NA"}</p>
        </div>

        <div className="flex flex-col gap-3">

          <button
            onClick={handleEmergency}
            className="bg-red-600 py-4 rounded-xl text-center font-bold text-lg hover:scale-105 transition"
          >
            🚨 SEND EMERGENCY ALERT
          </button>

          {data.emergencyContact && (
            <a
              href={`tel:${data.emergencyContact}`}
              className="bg-orange-500 py-3 rounded-xl text-center font-semibold"
            >
              📞 Call Emergency
            </a>
          )}

          {data.emergencyEmail && (
            <a
              href={`mailto:${data.emergencyEmail}`}
              className="bg-blue-500 py-3 rounded-xl text-center font-semibold"
            >
              📧 Send Email
            </a>
          )}

        </div>

        <p className="text-xs text-gray-500 text-center mt-5">
          ⚠️ Tap alert button to share live location
        </p>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">

          <div className="bg-[#111827] p-6 rounded-xl border border-red-500 w-[300px] text-center">

            <h2 className="text-lg font-bold mb-4 text-red-400">
              🚨 Send Emergency Alert?
            </h2>

            <p className="text-sm text-gray-400 mb-5">
              This will send your location via WhatsApp
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-gray-700 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  handleEmergency();
                }}
                className="w-full bg-red-600 py-2 rounded font-semibold"
              >
                YES
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}