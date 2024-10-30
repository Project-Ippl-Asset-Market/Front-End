// src/components/Panduan/Panduan.js
import React, { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { RiMoonLine } from "react-icons/ri";
import { BiSun } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import PanduanRegistrasi from './PanduanRegistrasi';
import PanduanLogin from './PanduanLogin';
import PanduanLupaPassword from './PanduanLupaPassword';
import PanduanJualAsset from './PanduanJualAsset';
import PanduanEditAsset from './PanduanEditAsset';

const Panduan = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const navigate = useNavigate();

  // Function to get the page title based on activePage
  const getPageTitle = () => {
    switch (activePage) {
      case 'registrasi':
        return 'Panduan Registrasi';
      case 'login':
        return 'Panduan Login';
      case 'lupapassword':
        return 'Panduan Lupa Password';
      case 'jualaset':
        return 'Panduan Jual Asset';
      case 'editaset':
        return 'Panduan Edit Asset';
      default:
        return 'Panduan';
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'registrasi':
        return <PanduanRegistrasi />;
      case 'login':
        return <PanduanLogin />;
      case 'lupapassword':
        return <PanduanLupaPassword />;
      case 'jualaset':
        return <PanduanJualAsset />;
      case 'editaset':
        return <PanduanEditAsset />;
      default:
        return (
          <div>
            <h1 className="text-4xl font-bold mb-6">Selamat Datang di Panduan!</h1>
            <p className="text-lg mb-4">
              Gunakan sidebar di sebelah kiri untuk memilih panduan yang Anda butuhkan. Klik pada item menu seperti Registrasi, Login, Lupa Password, Jual Asset, atau Edit Asset untuk memulai.
            </p>
            <p className="text-lg">
              Jika Anda menggunakan perangkat mobile, tekan ikon <FiMenu className="inline-block text-2xl" /> di bagian atas untuk membuka menu.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-64 min-h-screen p-6 absolute md:relative transition-transform transform md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } top-0 left-0 z-30`}
      >
        {/* Back Button */}
        <div className="flex items-center space-x-4 mb-4">
          <IoArrowBack
            className="text-2xl cursor-pointer hover:text-gray-500 dark:hover:text-gray-400"
            onClick={() => navigate('/')} // Navigate back to the main page
          />
          <span className="text-xl font-semibold">Kembali</span>
        </div>
        <div className="space-y-4">
          <button onClick={() => setActivePage('registrasi')} className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Registrasi
          </button>
          <button onClick={() => setActivePage('login')} className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Login
          </button>
          <button onClick={() => setActivePage('lupapassword')} className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Lupa Password
          </button>
          <button onClick={() => setActivePage('jualaset')} className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Jual Asset
          </button>
          <button onClick={() => setActivePage('editaset')} className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Edit Asset
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="min-h-[44px] w-[40px] bg-[#F2F2F2] text-black rounded-[5px] border-[1px] border-black flex items-center justify-center gap-1"
          >
            {darkMode ? (
              <BiSun className="text-xl text-black drop-shadow-sm cursor-pointer" />
            ) : (
              <RiMoonLine className="text-xl text-black drop-shadow-sm cursor-pointer" />
            )}
          </button>

          {/* Page Title */}
          <h1 className="text-2xl font-bold flex-1 text-center">{getPageTitle()}</h1>

          {/* Sidebar Toggle Icon for Mobile */}
          <FiMenu className="text-2xl cursor-pointer md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Render Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Panduan;
