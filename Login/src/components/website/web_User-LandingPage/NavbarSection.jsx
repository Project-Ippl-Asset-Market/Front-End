import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export const NavbarSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const handleClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate("/login", { state: { from: "/dashboard" } });
    }
  };

  return (
    <>
      <nav className="dark:bg-neutral-5 dark:text-primary-100 text-neutral-10 w-full fixed font-poppins  bg-neutral-90 bg-opacity-90">
        <div className="mx-[20px] flex justify-between items-center mt-0 w-full  ">
          <div className="flex-grow " />
          <button
            onClick={toggleNavbar}
            className="p-2 pr-14 focus:outline-none mt-8 mb-2 sm:flex md:hidden lg:hidden 2xl:hidden ">
            {isOpen ? (
              <FaTimes className="text-2xl text-primary-30" />
            ) : (
              <FaBars className="text-2xl text-secondary-40" />
            )}
          </button>
        </div>

        {/* Navbar Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden sm:flex navbar-hidden "
          } absolute top-full left-0 w-full sm:relative sm:w-auto bg-neutral-90 dark:bg-neutral-5 dark:text-primary-100 text-neutral-10 shadow-lg  `}>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 text-right mx-2 mt-0 sm:mt-4 md:mt-4 lg:mt-6 xl:mt- 2xl:mt-10">
            {/* Telusuri Semua */}
            <div className="relative group mt-4 flex">
              <Link
                to="/t"
                className={`relative flex text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px]
                w-full text-start rounded-md h-10 p-2
                ${
                  isLinkActive("/t")
                    ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                    : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                }

                hover:bg-secondary-40 sm:hover:bg-secondary-40 md:hover:bg-secondary-40 lg:hover:bg-transparent xl:hover:bg-transparent 2xl:hover:bg-transparent 
                dark:hover:bg-secondary-40 sm:dark:hover:bg-secondary-40 md:dark:hover:bg-secondary-40 lg:dark:hover:bg-transparent xl:dark:hover:bg-transparent 2xl:dark:hover:bg-transparent 
                text-neutral-10 group-hover:no-underline`}>
                Telusuri Semua
                <span className="hidden sm:flex items-center text-[24px] ml-4 mt-0 sm:-mt-2 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  |
                </span>
                <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] ">
                  <span
                    className={`absolute bottom-0 left-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
      ${
        isLinkActive("/1")
          ? "w-0 sm:w-16 md:w-18 lg:w-20 xl:w-24 2xl:w-14 sm:-ml-10 md:-ml-8 lg:-ml-10 xl:-ml-12 2xl:-ml-8"
          : "hidden sm:w-1/2"
      }`}></span>

                  <span
                    className={`absolute bottom-0 right-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
      ${isLinkActive("/2") ? "hidden" : "hidden sm:group-hover:w-1/2"}`}></span>
                </span>
              </Link>
            </div>

            {/* Asset Video */}
            <div className="relative group">
              <Link
                to="/v"
                className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
                w-full text-start rounded-md h-10 p-2
                ${
                  isLinkActive("/t")
                    ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                    : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                }

                hover:bg-secondary-40 sm:hover:bg-secondary-40 md:hover:bg-secondary-40 lg:hover:bg-transparent xl:hover:bg-transparent 2xl:hover:bg-transparent 
                dark:hover:bg-secondary-40 sm:dark:hover:bg-secondary-40 md:dark:hover:bg-secondary-40 lg:dark:hover:bg-transparent xl:dark:hover:bg-transparent 2xl:dark:hover:bg-transparent 
                text-neutral-10 group-hover:no-underline`}>
                Asset Video
                <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] ">
                  <span
                    className={`absolute bottom-0 left-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/1")
                ? "w-0 sm:w-16 md:w-18 lg:w-20 xl:w-24 2xl:w-14 sm:-ml-8 md:-ml-8 lg:-ml-10 xl:-ml-12 2xl:-ml-8"
                : "hidden sm:w-1/2"
            }`}></span>

                  <span
                    className={`absolute bottom-0 right-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/1") ? "hidden" : "hidden sm:group-hover:w-1/2"
            }`}></span>
                </span>
              </Link>
            </div>

            {/* Asset Gambar */}
            <div className="relative group">
              <Link
                to="/a"
                className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px]
              w-full text-start rounded-md h-10 p-2
              ${
                isLinkActive("/t")
                  ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                  : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
              }

                hover:bg-secondary-40 sm:hover:bg-secondary-40 md:hover:bg-secondary-40 lg:hover:bg-transparent xl:hover:bg-transparent 2xl:hover:bg-transparent 
                dark:hover:bg-secondary-40 sm:dark:hover:bg-secondary-40 md:dark:hover:bg-secondary-40 lg:dark:hover:bg-transparent xl:dark:hover:bg-transparent 2xl:dark:hover:bg-transparent 
                text-neutral-10 group-hover:no-underline`}>
                Asset Image
                <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] ">
                  <span
                    className={`absolute bottom-0 left-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/1")
                ? "w-0 sm:w-16 md:w-18 lg:w-20 xl:w-24 2xl:w-14 sm:-ml-8 md:-ml-8 lg:-ml-10 xl:-ml-12 2xl:-ml-8"
                : "hidden sm:w-1/2"
            }`}></span>

                  <span
                    className={`absolute bottom-0 right-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/2") ? "hidden" : "hidden sm:group-hover:w-1/2"
            }`}></span>
                </span>
              </Link>
            </div>

            {/* Asset Dataset */}
            <div className="relative group">
              <Link
                to="/a"
                className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
            w-full text-start rounded-md h-10 p-2
            ${
              isLinkActive("/t")
                ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
            }

                hover:bg-secondary-40 sm:hover:bg-secondary-40 md:hover:bg-secondary-40 lg:hover:bg-transparent xl:hover:bg-transparent 2xl:hover:bg-transparent 
                dark:hover:bg-secondary-40 sm:dark:hover:bg-secondary-40 md:dark:hover:bg-secondary-40 lg:dark:hover:bg-transparent xl:dark:hover:bg-transparent 2xl:dark:hover:bg-transparent 
                text-neutral-10 group-hover:no-underline`}>
                Asset Dataset
                <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] ">
                  <span
                    className={`absolute bottom-0 left-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/q")
                ? "w-0 sm:w-16 md:w-18 lg:w-20 xl:w-24 2xl:w-14 sm:-ml-8 md:-ml-8 lg:-ml-10 xl:-ml-12 2xl:-ml-8"
                : "hidden sm:w-1/2"
            }`}></span>

                  <span
                    className={`absolute bottom-0 right-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/2") ? "hidden" : "hidden sm:group-hover:w-1/2"
            }`}></span>
                </span>
              </Link>
            </div>

            {/* Asset Game */}
            <div className="relative group ">
              <Link
                to="/2"
                className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
            w-full text-start rounded-md h-10 p-2
            ${
              isLinkActive("/t")
                ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
            }

                hover:bg-secondary-40 sm:hover:bg-secondary-40 md:hover:bg-secondary-40 lg:hover:bg-transparent xl:hover:bg-transparent 2xl:hover:bg-transparent 
                dark:hover:bg-secondary-40 sm:dark:hover:bg-secondary-40 md:dark:hover:bg-secondary-40 lg:dark:hover:bg-transparent xl:dark:hover:bg-transparent 2xl:dark:hover:bg-transparent 
                text-neutral-10 group-hover:no-underline`}>
                Asset Game
                <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] ">
                  <span
                    className={`absolute bottom-0 left-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/q")
                ? "w-0 sm:w-16 md:w-18 lg:w-20 xl:w-24 2xl:w-14 sm:-ml-8 md:-ml-8 lg:-ml-10 xl:-ml-12 2xl:-ml-8"
                : "hidden sm:w-1/2"
            }`}></span>

                  <span
                    className={`absolute bottom-0 right-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/2") ? "hidden" : "hidden sm:group-hover:w-1/2"
            }`}></span>
                </span>
              </Link>
            </div>

            {/* Asset Gratis */}
            <div className="relative group">
              <nav className=" dark:bg-neutral-20  text-primary-100 dark:text-primary-100 h-full relative">
                <div className="flex flex-col space-y-4 ">
                  <Link
                    to="/"
                    className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
          w-full text-start rounded-md h-10 p-2
          ${
            isLinkActive("/t")
              ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
              : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
          }

                hover:bg-secondary-40 sm:hover:bg-secondary-40 md:hover:bg-secondary-40 lg:hover:bg-transparent xl:hover:bg-transparent 2xl:hover:bg-transparent 
                dark:hover:bg-secondary-40 sm:dark:hover:bg-secondary-40 md:dark:hover:bg-secondary-40 lg:dark:hover:bg-transparent xl:dark:hover:bg-transparent 2xl:dark:hover:bg-transparent 
                text-neutral-10 group-hover:no-underline`}>
                    Asset Gratis
                    <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] ">
                      <span
                        className={`absolute bottom-0 left-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/")
                ? "w-0 sm:w-16 md:w-18 lg:w-20 xl:w-24 2xl:w-14 sm:-ml-7 md:-ml-8 lg:-ml-10 xl:-ml-12 2xl:-ml-8"
                : "hidden sm:w-1/2"
            }`}></span>

                      <span
                        className={`absolute bottom-0 right-1/2 w-0 h-[3px] bg-secondary-40 transition-all duration-500 ease-in-out 
            ${
              isLinkActive("/") ? "hidden" : "hidden sm:group-hover:w-1/2"
            }`}></span>
                    </span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>

          {/* Jual Asset */}
          <div className="flex flex-col space-y-4 sm:flex-row mb-6 sm:-space-x-3 text-right mx-2 sm:ml-6 md:-ml-0 lg:ml-auto xl:ml-auto 2xl:ml-auto mt-0 sm:mt-1 md:mt-3 lg:mt-6 xl:mt-6 2xl:mt-8">
            <span className="hidden sm:flex items-center text-[24px]  mt-4 ml-4">
              |
            </span>
            <div className="relative group w-[120px] sm:w-auto -ml-5">
              <div className="dropdown bg-none">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn text-neutral-10 dark:text-primary-100 flex items-center bg-transparent border-none font-normal hover:bg-transparent text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px]">
                  Jual Asset
                  <svg
                    className="w-4 h-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </div>
                <div
                  tabIndex={0}
                  className="dropdown-content bg-neutral-90 dark:bg-neutral-20 card card-compact text-start text-primary-content z-[1] w-[200px] min-sm:w-full p-2 shadow -pr-20 ml-0 md:-ml-20 lg:-ml-24 xl:-ml-24 2xl:-ml-14  rounded-none">
                  <div className="card-body ">
                    <Link
                      to={isLoggedIn ? "/dashboard" : "/login"}
                      onClick={handleClick}
                      className="hover:bg-secondary-40 hover:rounded-md hover:text-primary-100 sm:hover:text-primary-100 dark:hover:bg-secondary-40 dark:text-primary-100 dark:hover:text-primary-100 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px] xl:text-[14px] 2xl:text-[14px] h-10 p-3 transition-all duration-200 ">
                      Mulai Jual Asset
                    </Link>
                    <Link
                      to=""
                      className="hover:bg-secondary-40 hover:rounded-md hover:text-primary-100 sm:hover:text-primary-100 dark:hover:bg-secondary-40 dark:text-primary-100 dark:hover:text-primary-100 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px] h-10 p-3 transition-all duration-200 ">
                      Halaman Bantuan
                    </Link>
                    <Link
                      to=""
                      className="hover:bg-secondary-40 hover:rounded-md hover:text-primary-100 sm:hover:text-primary-100 dark:hover:bg-secondary-40 dark:text-primary-100 dark:hover:text-primary-100 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px] xl:text-[14px] 2xl:text-[14px] h-10 p-3 transition-all duration-200 ">
                      Panduan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};