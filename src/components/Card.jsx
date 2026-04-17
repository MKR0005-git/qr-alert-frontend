import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Card({ id, onDelete }) {
  const [data, setData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/qr-data/${id}`);
      const result = await res.json();
      setData(result);
      setForm(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (size) => {
    try {
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
  const handleDelete = async () => {
    if (!window.confirm("Delete this QR?")) return;

    try {
      const res = await fetch(`${API_URL}/delete-qr/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      if (onDelete) onDelete(id);

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/update-qr/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      setEditOpen(false);
      fetchData();

    } catch (err) {
      alert(err.message);
    }
  };

  if (!data) return null;

  return (
    <>
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition text-center">

        {/* 🔥 PREMIUM QR BOX */}
        <div className="bg-white p-3 rounded-xl inline-block shadow-md hover:scale-105 transition">
          <img
            src={`${API_URL}/generate-qr/${id}`}
            className="w-40 cursor-pointer"
            onClick={() => setZoomOpen(true)}
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">{data.name}</h3>

        <p className={`text-sm ${data.isActivated ? "text-green-400" : "text-red-400"}`}>
          {data.isActivated ? "Active" : "Inactive"}
        </p>

        <p className="text-gray-400 text-sm mb-3">
          Scans: <span className="text-orange-400">{data.scans}</span>
        </p>

        {/* DOWNLOAD */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Download Size</p>

          <div className="flex justify-center gap-2 text-xs">
            <button onClick={() => handleDownload(6)} className="bg-orange-500 px-2 py-1 rounded">6x6</button>
            <button onClick={() => handleDownload(8)} className="bg-pink-500 px-2 py-1 rounded">8x8</button>
            <button onClick={() => handleDownload(12)} className="bg-purple-500 px-2 py-1 rounded">12x12</button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2">

          <button
            onClick={() => navigate(`/profile/${id}`)}
            className="text-blue-400 text-sm"
          >
            View Profile
          </button>

          <div className="flex justify-between mt-2 text-xs">
            <button
              onClick={() => setEditOpen(true)}
              className="text-yellow-400"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="text-red-400"
            >
              Delete
            </button>
          </div>

        </div>
      </div>

      {/* 🔍 ZOOM VIEW */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setZoomOpen(false)}
        >
          <div className="bg-white p-6 rounded-xl">
            <img
              src={`${API_URL}/generate-qr/${id}`}
              className="w-80 md:w-[420px]"
            />
          </div>
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">

          <div className="bg-[#111827] p-6 rounded-xl w-[350px] border border-gray-700">

            <h2 className="text-lg font-bold mb-4">Edit QR</h2>

            <input
              value={form.name || ""}
              placeholder="Name"
              className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              value={form.phone || ""}
              placeholder="Phone"
              className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <input
              value={form.bloodGroup || ""}
              placeholder="Blood Group"
              className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            />

            <input
              value={form.emergencyContact || ""}
              placeholder="Emergency Contact"
              className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
              onChange={(e) =>
                setForm({
                  ...form,
                  emergencyContact: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <input
              value={form.emergencyEmail || ""}
              placeholder="Emergency Email"
              type="email"
              className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
              onChange={(e) =>
                setForm({ ...form, emergencyEmail: e.target.value })
              }
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditOpen(false)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-orange-500 px-4 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}