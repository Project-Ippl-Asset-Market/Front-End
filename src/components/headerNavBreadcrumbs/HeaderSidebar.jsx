import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import { useTheme } from "../../contexts/ThemeContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import { nameMap } from "../breadcrumbs/PathMap";
import { useNavigate } from "react-router-dom";
import IconToggelMenu from "../../assets/icon/iconHeader/iconMenu.svg";
import IconLightMode from "../../assets/icon/iconDarkMode&LigthMode/ligth_mode.svg";
import IconDarkMode from "../../assets/icon/iconDarkMode&LigthMode/dark_mode.svg";
import IconUserDark from "../../assets/icon/iconDarkMode&LigthMode/iconUserDark.svg";
import IconUserLight from "../../assets/icon/iconDarkMode&LigthMode/iconUserLight.svg";
import IconLogoutDark from "../../assets/icon/iconDarkMode&LigthMode/logOutDark.svg";
import IconLogoutLight from "../../assets/icon/iconDarkMode&LigthMode/logOutLight.svg";
import IconStoreLight from "../../assets/icon/iconHeaderDashboard/iconStoreLight.svg";
import IconStoreDark from "../../assets/icon/iconHeaderDashboard/iconStoreDark.svg";

// eslint-disable-next-line react/prop-types
function HeaderSidebar({ toggleSidebar }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [, setUserProfile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    if (currentUserId) {
      const fetchUserProfile = async () => {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("uid", "==", currentUserId));

        const unsubscribeUser = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setUserProfile(userData);

            if (userData.profileImageUrl) {
              setProfileImageUrl(userData.profileImageUrl);
            } else {
              fetchImageFromStorage();
            }
            console.log("Data ditemukan di koleksi users:", userData);
          } else {
            console.log(
              "Pengguna tidak ditemukan, mencoba mencari di koleksi admins"
            );

            const adminsCollectionRef = collection(db, "admins");
            const adminsQuery = query(
              adminsCollectionRef,
              where("uid", "==", currentUserId)
            );

            const unsubscribeAdmin = onSnapshot(adminsQuery, (snapshot) => {
              if (!snapshot.empty) {
                const userData = snapshot.docs[0].data();
                setUserProfile(userData);

                if (userData.profileImageUrl) {
                  setProfileImageUrl(userData.profileImageUrl);
                } else {
                  fetchImageFromStorage();
                }
                console.log("Data ditemukan di koleksi admins:", userData);
              } else {
                console.log("Profil tidak ditemukan di kedua koleksi.");
              }
            });

            return unsubscribeAdmin;
          }
        });

        return unsubscribeUser;
      };

      const fetchImageFromStorage = () => {
        const storage = getStorage();
        const imageRef = ref(storage, `images-user/${currentUserId}.jpg`);

        getDownloadURL(imageRef)
          .then((url) => {
            setProfileImageUrl(url);
          })
          .catch((error) => {
            console.error("Error saat mengambil URL gambar profil:", error);
            setProfileImageUrl("https://placehold.co/80x80");
          });
      };

      fetchUserProfile();
    }
  }, [currentUserId]);

  return (
    <section className="navbar h-24 fixed z-40 top-0 left-0 pt-0 text-neutral-10 shadow-md font-poppins font-semibold dark:text-primary-100 bg-neutral-90 dark:bg-neutral-20 dark:shadow-lg dark:shadow-neutral-10 gap-6">
      <div className="flex-1">
        <button
          onClick={toggleSidebar}
          type="button"
          className="inline-flex items-center p-2 ms-3 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-neutral-90 dark:bg-neutral-10 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <img
            src={IconToggelMenu}
            alt="iconToggelMenu"
            className="w-10 h-5 mx-auto"
          />
        </button>
        {/* <ul className="breadcrumb text-xl">
          <li
            className="breadcrumb-item active hidden md:block text-xl text-neutral-20 dark:text-primary-100 font-semibold sm:ml-[200px] md:ml-[240px] lg:ml-[240px] xl:ml-[230px]"
            aria-current="page">
            {pageName}
          </li>
        </ul> */}
      </div>

      <div className="flex-none gap-2">
        {user ? (
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex-none text-neutral-20 dark:text-primary-100">
                <ul className="menu menu-horizontal">
                  <li>
                    <details className="relative">
                      <summary className="cursor-pointer">{username}</summary>
                      <ul className="bg-neutral-90 dark:bg-neutral-20 rounded-lg w-48 shadow-lg">
                        <li className="flex  mb-1 w-full h-8  transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                          <div className="flex items-center">
                            <img
                              src={darkMode ? IconUserDark : IconUserLight}
                              alt="Logout Icon"
                              className="w-5 h-5 me-2"
                            />
                            <Link to="/Profil" type="button">
                              Profile
                            </Link>
                          </div>
                        </li>

                        <li className="flex  mb-1 w-full h-8  transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                          <div className="flex items-center">
                            <img
                              src={darkMode ? IconStoreLight : IconStoreDark}
                              alt="Logout Icon"
                              className="w-6 h-6 me-2"
                            />
                            <Link to="/" alt="ast">
                              Asset Store
                            </Link>
                          </div>
                        </li>

                        <li>
                          <div className="flex items-center justify-center p-2 bg-neutral-90 dark:bg-neutral-20 transition-all duration-300 rounded-lg">
                            <div
                              onClick={toggleDarkMode}
                              className="flex gap-4 -ml-4 sm:ml-0 md:ml-0 lg:-ml-4 xl:-ml-6 2x:-ml-10 items-center justify-center w-full h-8  transition-colors duration-300 hover:bg-secondary-40  focus:outline-none"
                            >
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
                                className={`text-[12px] font-semibold transition-colors duration-300 hover:text-primary-100 ${
                                  darkMode
                                    ? "text-neutral-100"
                                    : "text-neutral-800"
                                }`}
                              >
                                {darkMode ? "Light Mode" : "Dark Mode"}
                              </span>
                            </div>
                          </div>
                        </li>
                        <li className="flex  mb-1 w-full h-8  transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                          <div className="flex items-center">
                            <img
                              src={darkMode ? IconLogoutDark : IconLogoutLight}
                              alt="Logout Icon"
                              className="w-5 h-5 me-2"
                            />
                            <button type="button" onClick={handleLogout}>
                              Logout
                            </button>
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
                className="btn btn-ghost btn-circle avatar mx-2 w-14 h-14 rounded-full  -ml-3"
              >
                <div className="w-[100%] h-[100%] rounded-full bg-neutral-80 flex items-center justify-center text-secondary-40 font-bold text-2xl mx-auto ">
                  <img
                    src={profileImageUrl || "https://placehold.co/80x80"}
                    alt="Profile"
                    className="h-[100%] w-[100%] rounded-full cursor-pointer"
                  />
                  <span className="text-[22px] text-center mx-auto -ml-1">
                    {getInitial(username)}
                  </span>
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
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/register">Register</Link>
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
