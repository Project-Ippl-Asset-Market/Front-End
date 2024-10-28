import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { Link, Routes, Route, useLocation } from 'react-router-dom'; 
import DarkMode from '../website/web_User-LandingPage/DarkMode'; 
import PanduanRegistrasi from './PanduanRegistrasi';
import PanduanLogin from './PanduanLogin';
import PanduanLupaPassword from './PanduanLupaPassword';
import PanduanJualAsset from './PanduanJualAsset';
import PanduanEditAsset from './PanduanEditAsset';

const Panduan = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/panduanregistrasi':
        return 'Panduan Registrasi';
      case '/panduanlogin':
        return 'Panduan Login';
      case '/panduanlupapassword':
        return 'Panduan Lupa Password';
      case '/panduanjualaset':
        return 'Panduan Jual Asset';
      case '/panduaneditaset':
        return 'Panduan Edit Asset';
      default:
        return 'Panduan';
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
        <div className="space-y-4">
          <Link to="/panduanregistrasi" className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Registrasi
          </Link>
          <Link to="/panduanlogin" className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Login
          </Link>
          <Link to="/panduanlupapassword" className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Lupa Password
          </Link>
          <Link to="/panduanjualaset" className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Jual Asset
          </Link>
          <Link to="/panduaneditaset" className="text-lg font-medium py-2 px-4 block rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            Edit Asset
          </Link>
        </div>
      </div>

      {/* Halaman utama dengan routing */}
      <div className="flex-grow p-8">
        <div className="md:hidden flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <FiMenu className="text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <DarkMode />
        </div>

        {/* Define Routes for different guides */}
        <Routes>
          <Route path="/panduanregistrasi" element={<PanduanRegistrasi />} />
          <Route path="/panduanlogin" element={<PanduanLogin />} />
          <Route path="/panduanlupapassword" element={<PanduanLupaPassword />} />
          <Route path="/panduanjualaset" element={<PanduanJualAsset />} />
          <Route path="/panduaneditaset" element={<PanduanEditAsset />} />
          <Route
            path="*"
            element={
              <div>
                <h1 className="text-4xl font-bold mb-6">Selamat Datang di Panduan!</h1>
                <p className="text-lg mb-4">
                  Gunakan sidebar di sebelah kiri untuk memilih panduan yang Anda butuhkan. Klik pada item menu seperti Registrasi, Login, Lupa Password, Jual Asset, atau Edit Asset untuk memulai.
                </p>
                <p className="text-lg">
                  Jika Anda menggunakan perangkat mobile, tekan ikon <FiMenu className="inline-block text-2xl" /> di bagian atas untuk membuka menu.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Panduan;