import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

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

        {/* 🔥 SHOW ALERTS ONLY FOR USER */}
        {role !== "admin" && (
          <button
            onClick={() => navigate("/alerts")}
            className={`transition ${
              isActive("/alerts")
                ? "text-white font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Alerts
          </button>
        )}

        {/* DASHBOARD */}
        <button
          onClick={() => navigate("/")}
          className={`transition ${
            isActive("/")
              ? "text-white font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Dashboard
        </button>

        {/* LOGOUT */}
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