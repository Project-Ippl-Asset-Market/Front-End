import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../config/config";

const LoginAdmin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const createAdminDocument = async (uid, email, role) => {
    try {
      await setDoc(doc(db, "admins", uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      });
      console.log("Admin document created successfully");
    } catch (error) {
      console.error("Error creating admin document:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", loginData.email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;
      console.log("User authenticated:", user.uid);

      // Query admins collection for the user's email
      const adminsRef = collection(db, "admins");
      const q = query(adminsRef, where("email", "==", loginData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists in admins collection
        const adminDoc = querySnapshot.docs[0];
        const adminData = adminDoc.data();

        if (adminData.role === "superadmin") {
          console.log("Logging in as Superadmin");
          alert("Login sebagai Superadmin berhasil!");
          navigate("/superAdminDashboard");
        } else if (adminData.role === "admin") {
          console.log("Logging in as Admin");
          alert("Login sebagai Admin berhasil!");
          navigate("/adminDashboard");
        } else {
          console.log("Invalid role:", adminData.role);
          setError("Role tidak valid");
        }
      } else {
        // User not found in admins collection, create new admin document
        console.log("Admin document not found. Creating new admin document.");
        await createAdminDocument(user.uid, user.email, "admin");
        alert("Login sebagai Admin berhasil!");
        navigate("/adminDashboard");
      }
    } catch (error) {
      console.error("Error during login process:", error);
      if (error.code === "auth/user-not-found") {
        setError("Pengguna dengan email ini tidak ditemukan.");
      } else if (error.code === "auth/wrong-password") {
        setError("Password salah.");
      } else {
        setError(`Terjadi kesalahan saat login: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-admin-container">
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="register-link">
        <p>Belum punya akun?</p>
        <Link to="/addAdmin">Daftar sekarang</Link>
      </div>
    </div>
  );
};

export default LoginAdmin;
