import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavigationItem from "../sidebarDashboardSuperAdmin/navigationItems";
import IconDarkMode from "../../assets/icon/iconDarkMode&LigthMode/dark_mode.svg";
import IconLightMode from "../../assets/icon/iconDarkMode&LigthMode/ligth_mode.svg";
import IconTambah from "../../assets/icon/iconHeader/iconTambah.png";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.svg";

function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <div className="bg-primary-10 dark:bg-gray-900 min-h-screen font-poppins">
        <section className="bg-primary-6 dark:bg-gray-800 h-[100px] w-full z-40 fixed top-0 left-0 pt-0 flex items-center justify-between">
          <div>
            <button
              data-drawer-target="sidebar-multi-level-sidebar"
              data-drawer-toggle="sidebar-multi-level-sidebar"
              aria-controls="sidebar-multi-level-sidebar"
              type="button"
              className="inline-flex items-center p-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ">
              <svg
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z"
                  fill="primary-12"
                />
              </svg>
            </button>
            <button className="text-2xl text-primary-12 dark:text-primary-12 font-bold sm:ml-0 md:ml-[250px] lg:ml-[270px] xl:ml-[260px]">
              SuperAdminDashboard
            </button>
          </div>

          <div className="flex items-center mr-4 gap-4">
            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost bg-primary-12 w-14 h-10 rounded-[8px] hover:bg-primary-12">
              {darkMode ? (
                <img src={IconDarkMode} alt="iconDarkMode" />
              ) : (
                <img src={IconLightMode} alt="iconLightMode" />
              )}
            </button>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar flex-wrap w-auto h-auto ">
                <div className="w-10 rounded-full">
                  <img
                    alt="Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
                <p className="font-semibold ml-2 text-primary-12 dark:text-primary-12">
                  Hello,
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 ml-1 text-primary-12 dark:text-primary-12">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 dark:bg-gray-700 rounded-box mt-3 w-52 p-2 shadow">
                <li>
                  <a className="justify-between">Profile</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <aside
          id="sidebar-multi-level-sidebar"
          className="fixed top-0 left-0 z-40 w-[280px] h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar">
          <div className="bg-primary-5 h-[80px] flex items-center justify-center gap-4 pt-20">
            <img
              alt="Logo"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              className="w-20 h-20 rounded-full"
            />
            <h1 className="text-2xl text-center font-bold text-primary-12 dark:text-primary-12 py-8">
              LOGO
            </h1>
          </div>
          <div className="h-full px-3 py-4 overflow-y-auto bg-primary-5 dark:bg-gray-900 pt-10">
            {/* simpan di sini Sidebarnya */}
            <NavigationItem />
          </div>
        </aside>

        {/* Isi Konten */}
        <div className="p-4 sm:ml-[280px] h-full bg-primary-12 dark:bg-gray-800 min-h-screen pt-36">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Manage Admin</a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-6 p-4">
            <div className="flex items-center">
              <div className="flex bg-primary-2 rounded-lg items-center p-2 w-40">
                <img
                  src={IconTambah}
                  alt="iconTambah"
                  className="w-4 h-4 mx-auto"
                />
                <Link
                  to=""
                  className="btn btn-ghost text-[14px] text-primary-12 dark:text-primary-12 mx-auto">
                  Add Admin
                </Link>
              </div>
            </div>
            <div className="form-control w-full flex-grow">
              <div className="relative">
                <img
                  src={IconSearch}
                  alt="iconSearch"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered border-primary-8 bg-primary-12 dark:bg-gray-800 text-primary-5 dark:text-primary-5 pl-10 h-[50px] focus:outline-none focus:border-primary-2 w-full"
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Color
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-primary-12 dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-primary-12 primary-12space-nowrap">
                    Apple MacBook Pro_17
                  </th>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">$2999</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      Edit
                    </a>
                  </td>
                </tr>
                <tr className="bg-primary-12 dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-primary-12 primary-12space-nowrap">
                    Apple MacBook Pro_17
                  </th>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">$2999</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      Edit
                    </a>
                  </td>
                </tr>
                <tr className="bg-primary-12 dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-primary-12 primary-12space-nowrap">
                    Apple MacBook Pro_17
                  </th>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">$2999</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      Edit
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex join pt-72 justify-end ">
            <button className="join-item btn bg-primary-10 border-primary-10 hover:bg-primary-2 hover:border-primary-2">
              «
            </button>
            <button className="join-item btn bg-primary-10 border-primary-10 ">
              Page 1
            </button>
            <button className="join-item btn bg-primary-10 border-primary-10 hover:bg-primary-2 hover:border-primary-2">
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
