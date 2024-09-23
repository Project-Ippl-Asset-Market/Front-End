import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Silakan login terlebih dahulu</div>;

  switch (user.role) {
    case "superAdmin":
      return <SuperAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "user":
      return <UserDashboard />;
    default:
      return <div>Peran tidak dikenal</div>;
  }
}

export default Dashboard;
