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

/* 🔒 AUTH CHECK */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/activate/:id" element={<ActivateQR />} />
        <Route path="/login" element={<Login />} />

        {/* ================= PROTECTED ================= */}

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

        {/* 🔥 ADMIN ROUTES */}

        <Route
          path="/admin/generate"
          element={
            <PrivateRoute>
              <AdminGenerate />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/qrs"
          element={
            <PrivateRoute>
              <AdminQRList />
            </PrivateRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
              <h1 className="text-2xl font-bold mb-2">404</h1>
              <p className="text-gray-400">Page Not Found</p>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}