import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/qr-data/${id}`);
        if (!res.ok) throw new Error("Fetch failed");

        const json = await res.json();
        setData(json);

      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchData();
  }, [id]);

  /* ================= LOCATION ================= */
  const getLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      return `https://maps.google.com/?q=${latitude},${longitude}`;
    } catch {
      return "Location not available";
    }
  };

  /* ================= WHATSAPP ================= */
  const sendWhatsApp = async () => {
    const location = await getLocation();

    const phone = (data?.emergencyContact || "").replace(/\D/g, "");

    const message = `🚨 EMERGENCY ALERT 🚨

Name: ${data?.name}
Blood Group: ${data?.bloodGroup}

📍 Location:
${location}

⚠️ Please contact immediately`;

    if (phone) {
      window.location.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    } else {
      alert("No emergency contact number");
    }
  };

  /* ================= EMAIL ================= */
  const sendEmail = async () => {
    const location = await getLocation();

    const subject = encodeURIComponent("🚨 Emergency Alert");

    const body = encodeURIComponent(`EMERGENCY ALERT

Name: ${data?.name}
Blood Group: ${data?.bloodGroup}

📍 Location:
${location}

Please contact immediately`);

    if (data?.emergencyEmail) {
      window.location.href =
        `mailto:${data.emergencyEmail}?subject=${subject}&body=${body}`;
    } else {
      alert("No emergency email available");
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
            This QR is not linked yet.
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-4">

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400"
      >
        ← Back
      </button>

      <div className="w-full max-w-md bg-[#111827] border border-red-500 rounded-2xl p-6">

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

          {/* WHATSAPP */}
          <button
            onClick={sendWhatsApp}
            className="bg-red-600 py-4 rounded-xl font-bold text-lg"
          >
            🚨 Send Emergency Alert (WhatsApp)
          </button>

          {/* CALL */}
          {data.emergencyContact && (
            <a
              href={`tel:${data.emergencyContact}`}
              className="bg-orange-500 py-3 rounded-xl text-center font-semibold"
            >
              📞 Call Emergency
            </a>
          )}

          {/* EMAIL */}
          {data.emergencyEmail && (
            <button
              onClick={sendEmail}
              className="bg-blue-500 py-3 rounded-xl font-semibold"
            >
              📧 Send Emergency Alert (Email)
            </button>
          )}

        </div>

        <p className="text-xs text-gray-500 text-center mt-5">
          ⚠️ Tap alert button to share live location
        </p>

      </div>
    </div>
  );
}