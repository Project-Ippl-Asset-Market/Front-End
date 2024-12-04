/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Membuat konteks
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  // Fungsi untuk menyimpan peran pengguna
  const saveUserRole = (role) => {
    setUserRole(role); // Set the user role
    Cookies.set("userRole", JSON.stringify(role), {
      secure: true,
      sameSite: "Strict",
    });
  };

  // Fungsi login untuk menyimpan role pengguna setelah autentikasi
  const login = async (userCredentials) => {
    const role = await mockLoginService(userCredentials);
    saveUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
    Cookies.remove("userRole");
  };

  useEffect(() => {
    const savedRole = Cookies.get("userRole");
    if (savedRole) {
      setUserRole(JSON.parse(savedRole));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userRole, saveUserRole, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Mock service to simulate fetching role from auth service
const mockLoginService = async (userCredentials) => {
  // Simulate fetching user role based on credentials
  if (userCredentials.username === "admin") {
    return { role: "admin" };
  } else if (userCredentials.username === "user") {
    return { role: "user" };
  }
  return null;
};

export const useUserContext = () => useContext(UserContext);
