import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useTheme } from "../../contexts/ThemeContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import IconLightMode from "../../assets/icon/iconDarkMode&LigthMode/ligth_mode.svg";
import IconDarkMode from "../../assets/icon/iconDarkMode&LigthMode/dark_mode.svg";
import IconUserDark from "../../assets/icon/iconDarkMode&LigthMode/iconUserDark.svg";
import IconUserLight from "../../assets/icon/iconDarkMode&LigthMode/iconUserLight.svg";
import IconLogoutDark from "../../assets/icon/iconDarkMode&LigthMode/logOutDark.svg";
import IconLogoutLight from "../../assets/icon/iconDarkMode&LigthMode/logOutLight.svg";
import { useNavigate } from "react-router-dom";

function HeaderSidebar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(
          currentUser.displayName || currentUser.email.split("@")[0] || "User"
        );
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fungsi handleLogout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Menampilkan initial dari nama pengguna menggantikan foto prifile jika tidak tersedia
  const getInitial = (name) => {
    const nameParts = name.split(" ");

    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      const firstInitial = nameParts[0].charAt(0).toUpperCase();
      const secondInitial = nameParts[1].charAt(0).toUpperCase();
      return firstInitial + secondInitial;
    }
  };

  return (
    <section className="navbar h-28 fixed z-40 top-0 left-0 pt-0 text-neutral-10 shadow-md font-poppins font-semibold dark:text-primary-100 bg-neutral-90 dark:bg-neutral-20 dark:shadow-lg dark:shadow-neutral-10 gap-6">
      <div className="flex-1">
        <h2>PixelStore</h2>
      </div>

      <div className="flex-none gap-2">
        {user ? (
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex-none text-neutral-20 dark:text-primary-100">
                <ul className="menu menu-horizontal">
                  <li>
                    <details className="relative ">
                      <summary className="cursor-pointer ">{username}</summary>
                      <ul className="bg-neutral-90 dark:bg-neutral-20 rounded-lg w-48 shadow-lg">
                        <li className="flex  mb-1 w-full h-8  transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                          <div className="flex items-center">
                            <img
                              src={darkMode ? IconUserDark : IconUserLight}
                              alt="User Icon"
                              className="w-5 h-5 me-2"
                            />
                            <button type="button">Profile</button>
                          </div>
                        </li>

                        <li>
                          <div className="flex items-center justify-center p-2 bg-neutral-90 dark:bg-neutral-20 transition-all duration-300 rounded-lg">
                            <div
                              onClick={toggleDarkMode}
                              className="flex gap-4 -ml-4 items-center justify-center w-full h-8  transition-colors duration-300 hover:bg-secondary-40  focus:outline-none">
                              {darkMode ? (
                                <img
                                  src={IconDarkMode}
                                  alt="icon dark mode"
                                  className="w-5 h-5 transition-transform duration-300"
                                />
                              ) : (
                                <img
                                  src={IconLightMode}
                                  alt="icon light mode"
                                  className="w-6 h-6 transition-transform duration-300 "
                                />
                              )}
                              <span
                                className={`text-[13px] font-semibold transition-colors duration-300 hover:text-primary-100 ${
                                  darkMode
                                    ? "text-neutral-100"
                                    : "text-neutral-800"
                                }`}>
                                {darkMode ? "Light Mode" : "Dark Mode"}
                              </span>
                            </div>
                          </div>
                        </li>
                        <li className="flex  mb-1 w-full h-8  transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                          <div
                            className="flex items-center"
                            onClick={handleLogout}>
                            <img
                              src={darkMode ? IconLogoutDark : IconLogoutLight}
                              alt="Logout Icon"
                              className="w-5 h-5 me-2"
                            />
                            <button type="button">Logout</button>
                          </div>
                        </li>
                      </ul>
                    </details>
                  </li>
                </ul>
              </div>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar mx-2 w-14 h-14 rounded-full  -ml-6">
                <div className="w-14 h-14 p-3  rounded-full overflow-hidden bg-neutral-80 flex items-center justify-center text-secondary-40 font-bold text-2xl mx-auto">
                  {user ? (
                    user.photoURL ? (
                      <img
                        alt="Avatar"
                        src={user.photoURL}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-[22px] text-center mx-auto -ml-1">
                        {getInitial(username)}
                      </span>
                    )
                  ) : (
                    <img
                      alt="Default User Icon"
                      src="/path/to/default-user-icon.svg"
                      className="w-10 h-10"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-none text-neutral-20 dark:text-primary-100">
            <ul className="menu menu-horizontal px-1">
              <li>
                <details>
                  <summary className="cursor-pointer">Hello, Sign in</summary>
                  <ul className="bg-neutral-90 dark:bg-neutral-20 rounded-t-none p-2">
                    <li>
                      <a href="/login">Login</a>
                    </li>
                    <li>
                      <a href="/register">Register</a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeaderSidebar;
