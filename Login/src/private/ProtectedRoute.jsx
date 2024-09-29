import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default ProtectedRoute;
