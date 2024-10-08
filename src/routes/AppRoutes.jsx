import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import ProtectedRoute from "../private/ProtectedRoute";
import AutoLogout from "../components/auto/autoLogout";
import ErrorPage from "../pages/errorPage";
import Register from "../pages/register";
import Login from "../pages/login";
import LupaPassword from "../pages/lupaPassword";
import HomePage from "../components/website/web_User-LandingPage/HomePage";
import AdminDashboard from "../components/myAdmin/AdminDashboard";
import ManageAssetVideo from "../components/manageAssetVideo/ManageAssetVideo";
import AddFormAssetVideo from "../components/manageAssetVideo/AddFormAssetVideo";
import EditFormAssetVideo from "../components/manageAssetVideo/EditFormAssetVideo";
import ManageAssetImage from "../components/manageAssetImage/ManageAssetImage";
import AddFormAssetImage from "../components/manageAssetImage/AddAssetImage";
import EditFormAssetImage from "../components/manageAssetImage/EditAssetImage";
import ManageAssetDataset from "../components/manageAssetDataset/ManageAssetDataset";
import AddFormAssetDataset from "../components/manageAssetDataset/AddAssetDataset";
import EditFormAssetDataset from "../components/manageAssetDataset/EditAssetDataset";
import ManageAsset2D from "../components/manageAssetGame/ManageAsset2D";
import AddNewAsset2D from "../components/manageAssetGame/addAsset2D/AddAsset2D";
import EditNewAsset2D from "../components/manageAssetGame/addAsset2D/EditAsset2D";
import ManageAsset3D from "../components/manageAssetGame/ManageAsset3D";
import AddNewAsset3D from "../components/manageAssetGame/addAsset3D/AddASset3D";
import EditNewAsset3D from "../components/manageAssetGame/addAsset3D/EditASset3D";
import ManageAssetAudio from "../components/manageAssetGame/ManageAssetAudio";
import AddAssetAudio from "../components/manageAssetGame/addAssetAudio/AddAssetAudio";
import EditAssetAudio from "../components/manageAssetGame/addAssetAudio/EditAssetAudio";
import ManageAdmin from "../components/mySuperAdmin/ManageAdmin";
import AddFormAdmin from "../components/mySuperAdmin/AddAdmin";
import EditFormAdmin from "../components/mySuperAdmin/EditAdmin";
import ManageUsers from "../components/myAdmin/ManageUsers";
import AddUsers from "../components/myAdmin/AddUser";
import EditUsers from "../components/myAdmin/EditUser";
import SaleAssets from "../components/myUserDashboard/SaleAssets";
import Revenue from "../components/myUserDashboard/Revenue";

// eslint-disable-next-line react/prop-types
const AppRoutes = ({ handleLogout }) => {
  return (
    <>
      <ThemeProvider>
        <AutoLogout />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lupaPassword" element={<LupaPassword />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetVideo"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ManageAssetVideo onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetVideo/add"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AddFormAssetVideo onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetVideo/edit"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditFormAssetVideo onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetVideo/edit/:assetId"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditFormAssetVideo onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetImage"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ManageAssetImage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetImage/add"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AddFormAssetImage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetImage/edit"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditFormAssetImage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetImage/edit/:assetId"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditFormAssetImage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetDataset"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ManageAssetDataset onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetDataset/add"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AddFormAssetDataset onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetDataset/edit"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditFormAssetDataset onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetDataset/edit/:assetId"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditFormAssetDataset onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset2D"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ManageAsset2D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset2D/add"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AddNewAsset2D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset2D/edit"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditNewAsset2D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset3D"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ManageAsset3D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset3D/add"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AddNewAsset3D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAsset3D/edit"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditNewAsset3D onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetAudio"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <ManageAssetAudio onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetAudio/add"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AddAssetAudio onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageAssetAudio/edit"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditAssetAudio onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageUsers/sale"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <SaleAssets onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageUsers/revenue"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <Revenue onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageUsers"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ManageUsers onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageUsers/add"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AddUsers onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageUsers/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <EditUsers onLogout={handleLogout} />
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

          {/* <Route
            path="/manageAdmin/edit"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <EditFormAdmin onLogout={handleLogout} />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/manageAdmin/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <EditFormAdmin onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default AppRoutes;
