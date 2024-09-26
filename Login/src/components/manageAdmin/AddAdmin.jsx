import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    role: "admin", // Default role is 'admin'
  });

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        admin.email,
        admin.password
      );
      const user = userCredential.user;

      // 2. Save user details along with role to Firestore
      await addDoc(collection(db, "admins"), {
        uid: user.uid, // Store the Firebase Authentication UID
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        role: admin.role, // Save the selected role (admin or superadmin)
      });

      alert("Admin successfully created and data saved to Firestore");
      navigate("/loginAdmin");
    } catch (error) {
      console.error("Error creating admin: ", error);
      alert("Error creating admin");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={admin.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>

      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={admin.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={admin.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={admin.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={admin.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select name="role" value={admin.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>
      <button type="submit">Create Admin</button>
    </form>
  );
};

export default AddAdmin;
