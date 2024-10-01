import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import ProtectedRoute from "../private/ProtectedRoute";
import AutoLogout from "../components/auto/autoLogout";
import ErrorPage from "../pages/errorPage";
import Register from "../pages/register";
import Login from "../pages/login";
import LupaPassword from "../pages/lupaPassword";
import HomePage from "../components/web/web_User-LandingPage/HomePage";
import LandingPage from "../pages/landingPage";
import AdminDashboard from "../components/myAdmin/AdminDashboard";
import ManageAssetVideo from "../components/manageAssetVideo/ManageAssetVideo";
import ManageAssetImage from "../components/manageAssetImage/ManageAssetImage";
import ManageAssetDataset from "../components/manageAssetDataset/ManageAssetDataset";
import ManageAsset2D from "../components/manageAssetGame/ManageAsset2D";
import ManageAsset3D from "../components/manageAssetGame/ManageAsset3D";
import ManageAssetAudio from "../components/manageAssetGame/ManageAssetAudio";
import ManageAdmin from "../components/mySuperAdmin/ManageAdmin";
import AddFormAssetVideo from "../components/manageAssetVideo/AddFormAssetVideo";
import AddFormAssetImage from "../components/manageAssetImage/AddAssetImage";
import AddFormAssetDataset from "../components/manageAssetDataset/AddAssetDataset";
import AddFormAdmin from "../components/mySuperAdmin/AddAdmin";
import EditFormAdmin from "../components/mySuperAdmin/EditAdmin";

// eslint-disable-next-line react/prop-types
const AppRoutes = ({ handleLogout }) => {
  return (
    <>
      <ThemeProvider>
        <AutoLogout />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lupaPassword" element={<LupaPassword />} />
          <Route path="/homaPage" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetImage"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageAssetImage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetImage/add"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AddFormAssetImage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetVideo"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageAssetVideo onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetVideo/add"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AddFormAssetVideo onLogout={handleLogout} />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetDataset"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageAssetDataset onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetDataset/add"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AddFormAssetDataset onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset2D"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageAsset2D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset3D"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageAsset3D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetAudio"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageAssetAudio onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAdmin"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <ManageAdmin onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAdmin/add"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <AddFormAdmin onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAdmin/edit"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <EditFormAdmin onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default AppRoutes;
