import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register";
import Login from "../pages/login";
import LupaPassword from "../pages/lupaPassword";
import LandingPage from "../pages/landingPage";
import AddAdmin from "../components/manageAdmin/AddAdmin";
import AdminDashboard from "../components/manageAdmin/AdminDashboard";
import SuperAdminDashboard from "../components/mySuperAdmin/SuperAdminDashboard";
import ErrorPage from "../pages/errorPage";
import PrivateRoute from "../components/PrivateRoute";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/landingPage",
    element: (
      <PrivateRoute>
        <LandingPage />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/lupaPassword",
    element: <LupaPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addAdmin",
    element: (
      <PrivateRoute>
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
          <AddAdmin />
        </ProtectedRoute>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/adminDashboard",
    element: (
      <PrivateRoute>
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/superAdminDashboard",
    element: (
      <PrivateRoute>
        <ProtectedRoute allowedRoles={["superadmin"]}>
          <SuperAdminDashboard />
        </ProtectedRoute>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
