import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateQR from "./pages/CreateQR";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Alerts from "./pages/Alerts";
import ActivateQR from "./pages/ActivateQR";

// 🔥 ADMIN PAGES
import AdminGenerate from "./pages/AdminGenerate";
import AdminQRList from "./pages/AdminQRList";

/* 🔒 USER AUTH */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

/* 🔐 ADMIN AUTH */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/activate/:id" element={<ActivateQR />} />
        <Route path="/login" element={<Login />} />

        {/* ================= USER ================= */}

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateQR />
            </PrivateRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <PrivateRoute>
              <Alerts />
            </PrivateRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/generate"
          element={
            <AdminRoute>
              <AdminGenerate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/qrs"
          element={
            <AdminRoute>
              <AdminQRList />
            </AdminRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
              <h1 className="text-3xl font-bold mb-2">404</h1>
              <p className="text-gray-400 mb-4">Page Not Found</p>

              <button
                onClick={() => window.location.href = "/"}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Go Home
              </button>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}