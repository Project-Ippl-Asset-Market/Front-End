// import { createBrowserRouter } from "react-router-dom";
// import Register from "../pages/register";
// import Login from "../pages/login";
// import LupaPassword from "../pages/lupaPassword";
// import LandingPage from "../pages/landingPage";
// import AddAdmin from "../components/manageAdmin/AddAdmin";
// import AdminDashboard from "../components/manageAdmin/AdminDashboard";
// import SuperAdminDashboard from "../components/mySuperAdmin/SuperAdminDashboard";
// import ErrorPage from "../pages/NotFound";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/landingPage",
//     element: <LandingPage />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//   },

//   {
//     path: "/lupaPassword",
//     element: <LupaPassword />,
//   },

//   { path: "/addAdmin", element: <AddAdmin /> },

//   { path: "/adminDashboard", element: <AdminDashboard /> },
//   { path: "/superAdminDashboard", element: <SuperAdminDashboard /> },
// ]);

// export default router;

// import { createBrowserRouter } from "react-router-dom";
// import Register from "../pages/register";
// import Login from "../pages/login";
// import LupaPassword from "../pages/lupaPassword";
// import LandingPage from "../pages/landingPage";
// import AddAdmin from "../components/manageAdmin/AddAdmin";
// import AdminDashboard from "../components/manageAdmin/AdminDashboard";
// import SuperAdminDashboard from "../components/mySuperAdmin/SuperAdminDashboard";
// import ErrorPage from "../pages/errorPage";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/landingPage",
//     element: <LandingPage />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/lupaPassword",
//     element: <LupaPassword />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/addAdmin",
//     element: <AddAdmin />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/adminDashboard",
//     element: <AdminDashboard />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/superAdminDashboard",
//     element: <SuperAdminDashboard />,
//     errorElement: <ErrorPage />,
//   },

//   {
//     path: "*",
//     element: <ErrorPage />,
//   },
// ]);

// export default router;

import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register";
import Login from "../pages/login";
import LupaPassword from "../pages/lupaPassword";
import LandingPage from "../pages/landingPage";
import AddAdmin from "../components/manageAdmin/AddAdmin";
import AdminDashboard from "../components/manageAdmin/AdminDashboard";
import SuperAdminDashboard from "../components/mySuperAdmin/SuperAdminDashboard";
import ErrorPage from "../pages/errorPage";
import ProtectedRoute from "../components/auth/ProtectedRoute"; // Import ProtectedRoute

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/landingPage",
    element: <LandingPage />,
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
      <ProtectedRoute element={<AddAdmin />} roles={["admin", "superadmin"]} />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/adminDashboard",
    element: <ProtectedRoute element={<AdminDashboard />} roles={["admin"]} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/superAdminDashboard",
    element: (
      <ProtectedRoute
        element={<SuperAdminDashboard />}
        roles={["superadmin"]}
      />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
