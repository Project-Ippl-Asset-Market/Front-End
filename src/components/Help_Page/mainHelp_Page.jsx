import React from "react";
import { Link } from "react-router-dom";
import HeaderWebUser from "../headerNavBreadcrumbs/HeaderWebProfile";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function MainHelp_Page() {
  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-r dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <HeaderWebUser />

      <div className="relative">
        <div className="absolute top-0 left-0 -ml-[550px] -mt-10">
          <Link to="/">
            <button className="bg-[#2563eb] text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
          </Link>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">
        Bantuan dan Dukungan
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/2">
        <ul className="space-y-4">
          <li>
            <Link
              to="/halaman-bantuan"
              className="block text-lg text-center text-blue-600 hover:underline transition duration-200">
              Halaman Bantuan
            </Link>
          </li>
          <li>
            <Link
              to="/akun-dan-keamanan"
              className="block text-lg text-center text-blue-600 hover:underline transition duration-200">
              Akun dan Keamanan
            </Link>
          </li>

          <li>
            <Link
              to="/penjualan-asset"
              className="block text-lg text-center text-blue-600 hover:underline transition duration-200">
              Penjualan Asset
            </Link>
          </li>
          <li>
            <Link
              to="/layanan"
              className="block text-lg text-center text-blue-600 hover:underline transition duration-200">
              Layanan
            </Link>
          </li>
          <li>
            <Link
              to="/kebijakan-pixel-store"
              className="block text-lg text-center text-blue-600 hover:underline transition duration-200">
              Kebijakan Pixel Store
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainHelp_Page;
