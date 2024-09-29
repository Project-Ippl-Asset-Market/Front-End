import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Spinner saat masih loading
  }

  // Jika pengguna belum login, redirect ke halaman login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
