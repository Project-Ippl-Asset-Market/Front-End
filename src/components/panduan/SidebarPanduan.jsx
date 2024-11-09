import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { RiMoonLine } from "react-icons/ri";
import { BiSun } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import PanduanRegistrasi from './PanduanRegistrasi';
import PanduanLogin from './PanduanLogin';
import PanduanLupaPassword from './PanduanLupaPassword';
import PanduanJualAsset from './PanduanJualAsset';
import PanduanEditAsset from './PanduanEditAsset';
import Logo from '../../assets/logo/logoLogin.png';

const Panduan = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const navigate = useNavigate();

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
              Gunakan sidebar di sebelah kiri untuk memilih panduan yang Anda butuhkan.
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
        {/* Logo di tengah sidebar dengan posisi lebih ke atas */}
        <div className="flex items-center justify-center mt-2 mb-8">
          <img
            src={Logo}
            alt="Logo"
            className="h-12 w-12 cursor-pointer hover:opacity-80 transition duration-200"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Menu Sidebar */}
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
      <div className="flex-grow">
        {/* Sticky Navbar (Full Width) */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-30 flex items-center justify-between py-4 px-6 border-b border-gray-200 dark:border-gray-700 shadow-md w-full">
          {/* FiMenu Icon for Mobile (Left-aligned) */}
          <div className="md:hidden flex items-center">
            <FiMenu
              className="text-2xl cursor-pointer mr-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-bold flex-1 text-center">{getPageTitle()}</h1>

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
        </div>

        {/* Render Content */}
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Panduan;
