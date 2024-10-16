import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import ProtectedRoute from "../private/ProtectedRoute";
import AutoLogout from "../components/auto/autoLogout";
import ErrorPage from "../pages/errorPage";
import SearchResults from "../components/searchResults/SearchResults";
import Register from "../pages/register";
import Login from "../pages/login";
import LupaPassword from "../pages/lupaPassword";
// Import Halaman Dashboard start
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
// import ManageAsset2D from "../components/manageAssetGame/ManageAsset2D";
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
import ManageAsset2D from "../components/daff 2d 3d/ManageAsset2D";
import SaleAssets from "../components/myUserDashboard/SaleAssets";
import Revenue from "../components/myUserDashboard/Revenue";
// Import Halaman Dashboard End

// Import Halaman Website start
import Cart from "../components/payment/Cart";
import HomePage from "../components/website/web_User-LandingPage/HomePage";
import { MapAssetGratis } from "../components/website/Web_User-Gratis/MapAssetGratis";
import { MapAssetVideo } from "../components/website/web_user-AssetVideo/MapAssetVideo";
import { MapAssetImage } from "../components/website/web_User-AssetGambar/MapAssetImage";
import { MapAssetDataset } from "../components/website/web_User-AssetDataset/MapAssetDataset";
import { MapAsset2D } from "../components/website/web_user-AssetGame/asset_2D/MapAsset2D";
import { MapAsset3D } from "../components/website/web_user-AssetGame/asset_3D/MapAsset3D";
import { MapAssetAudio } from "../components/website/web_user-AssetGame/asset_audio/MapAssetAudio";
import { MapAssetGame } from "../components/website/web_user-AssetGame/MapAssetGame";
// Import Halaman Website End

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

          {/* Route halaman web start */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/mapAssetGratis" element={<MapAssetGratis />} />
          <Route path="/mapAssetVideo" element={<MapAssetVideo />} />
          <Route path="/mapAssetImage" element={<MapAssetImage />} />
          <Route path="/mapAssetDataset" element={<MapAssetDataset />} />
          <Route path="/mapAssetGame" element={<MapAssetGame />} />
          <Route path="/AssetGame/mapAsset2D" element={<MapAsset2D />} />
          <Route path="/AssetGame/mapAsset3D" element={<MapAsset3D />} />
          <Route path="/AssetGame/mapAssetAudio" element={<MapAssetAudio />} />
          {/* Route halaman web End */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <Cart onLogout={handleLogout} />
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
            path="/manageAssetDataset/edit/:id"
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
            path="/manageAsset2D/edit/:id"
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
            path="/manageAsset3D/edit/:id"
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
            path="/manageAssetAudio/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <EditAssetAudio onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sale"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <SaleAssets onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue"
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
