import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
export default function Card({ id }) {
  const [data, setData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/qr-data/${id}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setForm(res);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this QR?")) return;

    await fetch(`${API_URL}/delete-qr/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    window.location.reload();
  };

  const handleUpdate = async () => {
    await fetch(`${API_URL}/update-qr/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(form),
    });

    setEditOpen(false);
    window.location.reload();
  };

  if (!data) return null;

  return (
    <>
      {/* CARD */}
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl shadow hover:scale-105 transition text-center">

        {/* QR */}
        <img
          src={`${API_URL}/generate-qr/${id}`}
          className="mx-auto mb-4 w-40 cursor-pointer hover:scale-105 transition"
          onClick={() => setZoomOpen(true)}
        />

        <h3 className="text-lg font-semibold">{data.name}</h3>

        <p className={`text-sm ${data.isActivated ? "text-green-400" : "text-red-400"}`}>
          {data.isActivated ? "Active" : "Inactive"}
        </p>

        <p className="text-gray-400 text-sm mb-3">
          Scans: <span className="text-orange-400">{data.scans}</span>
        </p>

        {/* 🔥 DOWNLOAD SIZES */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Download Size</p>

          <div className="flex justify-center gap-2 text-xs">

            <a
              href={`${API_URL}/download-qr/${id}/6`}
              className="bg-orange-500 px-2 py-1 rounded hover:scale-105 transition"
            >
              6x6
            </a>

            <a
              href={`${API_URL}/download-qr/${id}/8`}
              className="bg-pink-500 px-2 py-1 rounded hover:scale-105 transition"
            >
              8x8
            </a>

            <a
              href={`${API_URL}/download-qr/${id}/12`}
              className="bg-purple-500 px-2 py-1 rounded hover:scale-105 transition"
            >
              12x12
            </a>

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

      {/* 🔍 ZOOM */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={`${API_URL}/generate-qr/${id}`}
            className="w-80 md:w-[400px] bg-white p-4 rounded-xl"
          />
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">

          <div className="bg-[#111827] p-6 rounded-xl w-[350px] border border-gray-700">

            <h2 className="text-lg font-bold mb-4">Edit QR</h2>

            {[
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              { key: "bloodGroup", label: "Blood Group" },
              { key: "emergencyContact", label: "Emergency Contact" },
              { key: "emergencyEmail", label: "Emergency Email" },
            ].map((field) => (
              <input
                key={field.key}
                value={form[field.key] || ""}
                placeholder={field.label}
                type={field.key === "emergencyEmail" ? "email" : "text"}
                className="w-full mb-3 p-2 bg-[#0B0F19] border border-gray-700 rounded"
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
              />
            ))}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditOpen(false)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-orange-500 px-4 py-1 rounded hover:scale-105 transition"
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