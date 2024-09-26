// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const userRole = localStorage.getItem("userRole"); // Get the role from local storage
//   if (!allowedRoles.includes(userRole)) {
//     return <Navigate to="/errorPage" />;
//   }
//   return children;
// };

// export default ProtectedRoute;

// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const userRole = localStorage.getItem("userRole");
//   if (!userRole || !allowedRoles.includes(userRole)) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; // Pastikan jalur ini benar
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user] = useAuthState(auth);
  const userRole = user ? localStorage.getItem("userRole") : null;

  if (!user) {
    return <Navigate to="/errorPage" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/errorPage" />;
  }

  return children;
};

export default ProtectedRoute;
