import { RouterProvider } from "react-router-dom";
// import router from "./routes/routes";
import { createBrowserRouter } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import LupaPassword from "./pages/lupaPassword";
import LandingPage from "./pages/landingPage";
import AddAdmin from "./components/manageAdmin/AddAdmin";
import AdminDashboard from "./components/manageAdmin/AdminDashboard";
import SuperAdminDashboard from "./components/mySuperAdmin/SuperAdminDashboard";
import ErrorPage from "./pages/errorPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "*",
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
      element: <AddAdmin />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/adminDashboard",
      element: <AdminDashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/superAdminDashboard",
      element: <SuperAdminDashboard />,
      errorElement: <ErrorPage />,
    },

    {
      path: "/",
      element: <ErrorPage />,
    },
  ]);
  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
}
