import React, { useState } from "react";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SidebarPanduan = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Mendapatkan rute saat ini
  const navigate = useNavigate(); // Fungsi navigasi untuk versi baru

  // Fungsi untuk mengecek apakah tombol sedang aktif
  const isActive = (path) => location.pathname === path;

  // // Fungsi untuk menentukan judul berdasarkan path
  // const getPageTitle = () => {
  //   switch (location.pathname) {
  //     case "/panduan-registrasi":
  //       return "Panduan Registrasi";
  //     case "/panduan-login":
  //       return "Panduan Login";
  //     case "/panduan-lupa-password":
  //       return "Panduan Lupa Password";
  //     case "/panduan-jual-asset":
  //       return "Panduan Jual Asset";
  //     case "/panduan-edit-asset":
  //       return "Panduan Edit Asset";
  //     default:
  //       return "Panduan"; // Judul default
  //   }
  // };

  return (
    <>
      {/* Navbar untuk menampilkan hamburger dan judul di atas kiri */}
      <div className="md:hidden flex items-center p-4 bg-gray-900 text-white fixed top-0 left-0 w-full z-20">
        <FiMenu
          className="text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 min-h-screen p-6 absolute md:relative transition-transform transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } top-0 left-0 z-30`}
        style={{ margin: 0, border: "none", boxShadow: "none", padding: 0 }} // Hilangkan margin, border, dan shadow
      >
        <div className="flex items-center space-x-2 mb-8 p-4">
          <FiArrowLeft
            className="text-2xl cursor-pointer"
            onClick={() => navigate("/")} // Navigasi ke landing page
          />
        </div>
        <div className="flex flex-col space-y-4 p-4">
          {/* Link ke Halaman Registrasi */}
          <Link
            to="/panduan-registrasi"
            className={`text-left text-lg font-medium py-2 px-4 rounded-r-full ${
              isActive("/panduan-registrasi")
                ? "bg-blue-500"
                : "hover:bg-gray-800"
            }`}>
            Registrasi
          </Link>

          {/* Link ke Halaman Login */}
          <Link
            to="/panduan-login"
            className={`text-left text-lg font-medium py-2 px-4 rounded-r-full ${
              isActive("/panduan-login") ? "bg-blue-500" : "hover:bg-gray-800"
            }`}>
            Login
          </Link>

          {/* Link ke Halaman Panduan Lupa Password */}
          <Link
            to="/panduan-lupa-password"
            className={`text-left text-lg font-medium py-2 px-4 rounded-r-full ${
              isActive("/panduan-lupa-password")
                ? "bg-blue-500"
                : "hover:bg-gray-800"
            }`}>
            Lupa Password
          </Link>

          {/* Link ke Halaman Panduan Jual Asset */}
          <Link
            to="/panduan-jual-asset"
            className={`text-left text-lg font-medium py-2 px-4 rounded-r-full ${
              isActive("/panduan-jual-asset")
                ? "bg-blue-500"
                : "hover:bg-gray-800"
            }`}>
            Jual Asset
          </Link>

          {/* Link ke Halaman Panduan Edit Asset */}
          <Link
            to="/panduan-edit-asset"
            className={`text-left text-lg font-medium py-2 px-4 rounded-r-full ${
              isActive("/panduan-edit-asset")
                ? "bg-blue-500"
                : "hover:bg-gray-800"
            }`}>
            Edit Asset
          </Link>
        </div>
      </div>

      {/* Overlay untuk menutup sidebar di tampilan mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default SidebarPanduan;
