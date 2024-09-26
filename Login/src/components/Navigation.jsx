import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        )}
        {user && (user.role === "admin" || user.role === "superAdmin") && (
          <li>
            <NavLink to="/admin">Admin Dashboard</NavLink>
          </li>
        )}
        {user && user.role === "superAdmin" && (
          <li>
            <NavLink to="/superadmin">Super Admin Dashboard</NavLink>
          </li>
        )}
        {user && (
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
