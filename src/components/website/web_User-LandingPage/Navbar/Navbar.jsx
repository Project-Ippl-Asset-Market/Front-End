import React, { useState } from "react";
import Logo from "../../../../assets/icon/logo.jpg";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import DarkMode from "./DarkMode";

const Navbar = ({ handleOrderPopup }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-[153px] shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40 ">
      {/* upper Navbar */}
      <div className="min-h-[103px] bg-blackNavy py-2 flex justify-start items-center gap-1">
        <div className="container flex justify-start items-center">
          <div>
            <a
              href="#"
              className="font-bold text-xl sm:text-3xl flex justify-center items-center gap-2 mr-5 text-white">
              <img src={Logo} alt="Logo" className="w-[80px] h-[80px]" />
              <p>PixelStore</p>
            </a>
          </div>
        </div>

        <div className="relative group sm:block justify-center items-center ml-5">
          <input
            type="text"
            placeholder={!isFocused ? "search | type" : ""}
            className="min-h-[29px] w-[40px] sm:w-[100px] md:w-[150px] lg:w-[500px] xl:w-[650px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800  "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <IoMdSearch className=" text-gray-500 group-hover:text-black absolute top-1/2 -translate-y-1/2 right-3" />
        </div>

        <div className="container flex justify-end items-center mr-5 gap-2">
          {/* search bar */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <DarkMode />
            </div>
          </div>

          <button
            onClick={() => handleOrderPopup()}
            className="min-h-[29px] w-12 md:w-40 bg-gradient-to-r from-white to-gray-50 transition-all duration-200 text-black  py-1 px-4 rounded-full flex items-center gap-1 group">
            <FaUser className="text-xl text-black drop-shadow-sm cursor-pointer" />
            <span className="hidden md:inline sm:text-xxs">Hello, Sign In</span>
          </button>

          <button
            onClick={() => handleOrderPopup()}
            className="min-h-[29px] w-30 bg-gradient-to-r from-white to-gray-50 transition-all duration-200 text-black  py-1 px-4 rounded-full flex items-center gap-1 group">
            <FaCartShopping className="text-xl text-black drop-shadow-sm cursor-pointer" />
            <span className="hidden md:inline sm:text-xxs">Order</span>
          </button>
        </div>
      </div>

      {/* lower Navbar */}
      <nav className="bg-navy text-white min-h-[50px] p-1 text-xs flex items-center">
        <ul className="mx-4">
          <li className="mx-2 flex justify-between items-center">
            <div className="flex space-x-10 justify-center items-center">
              <a href="#home">Telusuri Semua</a>
              <p className="text-xl flex items-center"> | </p>
              <a href="#about">Asset Video</a>
              <a href="#product">Asset Gambar</a>
              <a href="#">Asset Dataset</a>
              <a href="#">Asset Game</a>
            </div>
            <div className="flex space-x-5 justify-center items-center">
              <p className="text-xl flex items-center"> | </p>
              <a href="#">Asset Gratis</a>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
