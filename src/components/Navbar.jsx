import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-[#0B0F19] border-b border-gray-800">

      {/* LOGO */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl md:text-2xl font-bold text-white cursor-pointer tracking-wide hover:opacity-80 transition"
      >
        QR Alert 🚀
      </h1>

      {/* MENU */}
      <div className="flex items-center gap-8 text-sm md:text-base">

        <button
          onClick={() => navigate("/alerts")}
          className="text-gray-400 hover:text-white transition"
        >
          Alerts
        </button>

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 transition font-medium"
        >
          Logout
        </button>

      </div>
    </div>
  );
}