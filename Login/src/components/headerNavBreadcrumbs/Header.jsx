import { useTheme } from "../../contexts/ThemeContext";
import IconLightMode from "../../assets/icon/iconDarkMode&LigthMode/ligth_mode.svg";
import IconDarkMode from "../../assets/icon/iconDarkMode&LigthMode/dark_mode.svg";
import { nameMap } from "../breadcrumbs/PathMap";
import { useLocation } from "react-router-dom";

function HeaderNav() {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation(); // Kita akan mengambil lokasi saat ini dari router
  const currentPath = location.pathname; // Path aktif saat ini

  // Ambil nama halaman berdasarkan currentPath dari nameMap
  const pageName = nameMap[currentPath] || "Unknown Page";

  return (
    <section className="navbar h-20 fixed z-40 top-0 left-0 pt-0 text-neutral-10  shadow-md font-poppins font-semibold dark:text-primary-100 bg-neutral-90 dark:bg-neutral-20 dark:shadow-lg dark:shadow-neutral-10 gap-6">
      <div className="flex-1">
        <ul className="breadcrumb text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px] ">
          <li className="breadcrumb-item active ml-6" aria-current="page">
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

export default HeaderNav;
