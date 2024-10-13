import { Link } from "react-router-dom";
import HeaderNav from "../../HeaderNav/HeaderNav";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
export function MapAssetGame() {
  return (
    <>
      <div className=" dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
        <div className="w-full shadow-md bg-primary-100 dark:bg-neutral-20 text-primary-100 dark:text-primary- relative z-40 ">
          <div className="pt-[70px]  w-full">
            <HeaderNav />
          </div>
          <NavbarSection />
        </div>
        <div className="pt-[100px]">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="text-primary-  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button">
            Dropdown button{" "}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
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
          </button>

          <div
            id="dropdown"
            className="z-10 hidden bg-primary- divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton">
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-primary-">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-primary-">
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-primary-">
                  Earnings
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-primary-">
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
    </>
  );
}

