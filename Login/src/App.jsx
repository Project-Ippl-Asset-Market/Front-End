import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./components/manageAdmin/AdminDashboard";
import SuperAdminDashboard from "./components/mySuperAdmin/SuperAdminDashboard";
import LandingPage from "./pages/landingPage";
import ErrorPage from "./pages/errorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import AutoLogout from "./components/auto/autoLogout";
import Register from "./pages/register";
import LupaPassword from "./pages/lupaPassword";

const App = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      // nnati kita ubah/ganti (/) jadi (/login) mengarah ke halman login jika sudah membuat home pagenya
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      <AutoLogout />
      <Routes>
        {/*nnati kita ubah/ganti (/) jadi (/login) mengarah ke halman login jika sudah membuat home pagenya */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupaPassword" element={<LupaPassword />} />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superAdminDashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
