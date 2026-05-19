import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const {
    token,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate to="/login" replace />
    );
  }

  return <Outlet />;
}