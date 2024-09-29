import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { auth } from "./firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const App = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      <AppRoutes handleLogout={handleLogout} />
    </Router>
  );
};

export default App;
