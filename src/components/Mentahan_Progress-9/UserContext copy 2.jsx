// import { createContext, useContext, useState } from "react";

// // Membuat konteks
// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState(null);

//   // Fungsi untuk menyimpan peran pengguna
//   const saveUserRole = (role) => {
//     setUserRole(role);
//   };

//   return (
//     <UserContext.Provider value={{ userRole, saveUserRole }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Hook untuk mengakses UserContext dengan mudah
// export const useUserContext = () => useContext(UserContext);


// src/contexts/UserContext.jsx
import { createContext, useContext, useState } from "react";

// Membuat konteks
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  // Fungsi untuk menyimpan peran pengguna
  const saveUserRole = (role) => {
    setUserRole(role);                 // Set the user role
    console.log("User role saved:", role); // Log the role to console
  };

  return (
    <UserContext.Provider value={{ userRole, saveUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook untuk mengakses UserContext dengan mudah
export const useUserContext = () => useContext(UserContext);
