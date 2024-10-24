// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const authToken = localStorage.getItem("authToken");
//   const userRole = localStorage.getItem("userRole");

//   if (!authToken) {
//     return <Navigate to="*s" replace />;
//   }

//   if (!allowedRoles.includes(userRole)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext"; // Import UserContext

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");
  const { userRole } = useUserContext(); // Akses userRole dari UserContext

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
