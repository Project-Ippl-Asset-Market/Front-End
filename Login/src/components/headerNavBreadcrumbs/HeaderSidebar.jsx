import { useTheme } from "../../contexts/ThemeContext";
import IconLightMode from "../../assets/icon/iconDarkMode&LigthMode/ligth_mode.svg";
import IconDarkMode from "../../assets/icon/iconDarkMode&LigthMode/dark_mode.svg";
import { nameMap } from "../breadcrumbs/PathMap";
import { useLocation } from "react-router-dom";
import IconToggelMenu from "../../assets/icon/iconHeader/iconMenu.svg";

function HeaderSidebar({ toggleSidebar }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

  const pageName = nameMap[currentPath] || "Unknown Page";

  return (
    <section className="navbar h-24 fixed z-40 top-0 left-0 pt-0 text-neutral-10 shadow-md font-poppins font-semibold dark:text-primary-100 bg-neutral-90 dark:bg-neutral-20 dark:shadow-lg dark:shadow-neutral-10 gap-6">
      <div className="flex-1">
        <button
          onClick={toggleSidebar}
          type="button"
          className="inline-flex items-center p-2 ms-3 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-neutral-90 dark:bg-neutral-10 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <img
            src={IconToggelMenu}
            alt="iconToggelMenu"
            className="w-10 h-5 mx-auto"
          />
        </button>
        <ul className="breadcrumb text-xl">
          <li
            className="breadcrumb-item active hidden md:block text-xl text-neutral-20 dark:text-primary-100 font-semibold sm:ml-[200px] md:ml-[240px] lg:ml-[240px] xl:ml-[230px]"
            aria-current="page">
            {pageName}
          </li>
        </ul>
      </div>
      <div>
        <button
          onClick={toggleDarkMode}
          className="btn btn-ghost bg-neutral-80 border-neutral-70 rounded-full hover:bg-neutral-80">
          {darkMode ? (
            <img src={IconDarkMode} alt="icon dark mode" />
          ) : (
            <img src={IconLightMode} alt="icon light mode" />
          )}
        </button>
      </div>
      <button className="flex-none gap-2">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar">
          <div className="w-28 h-18 rounded-full">
            <img
              alt="Avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <div className="flex-none text-neutral-20 dark:text-primary-100">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>Ardhy</summary>
                <ul className="bg-neutral-90 dark:bg-neutral-20 rounded-t-none p-2">
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </button>
    </section>
  );
}

export default HeaderSidebar;
