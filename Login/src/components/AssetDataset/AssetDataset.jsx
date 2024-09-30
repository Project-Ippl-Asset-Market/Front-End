import React, { useEffect, useState } from 'react';
import IconUser from "../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../assets/icon/logo.png";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.png";
import Dataset from "../../assets/icon/iconSidebar/dataset.png";
import IconLike from "../../assets/icon/iconSidebar/iconLike.png";
import IconClose from "../../assets/icon/iconSidebar/iconClose.png";
import IconMenu from "../../assets/icon/iconSidebar/iconMenu.png";
import IconUnduh from "../../assets/icon/iconSidebar/iconUnduh.png";


function AssetModal({ isOpen, onClose, asset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#5D5F5F] dark:bg-[#171717] p-8 sm:p-12 rounded-lg relative w-[320px] h-[570px] sm:w-[580px] sm:h-[660px] lg:w-[925px] lg:h-[700px] font-poppins">
        <button onClick={onClose} className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <img src={IconClose} alt="X" className="w-5 h-5 sm:w-7 sm:h-7 "/>
        </button>
        <div className="relative flex">
          <div className="-ml-4">
            <img src={asset.image} alt="Asset" className="w-[170px] h-[200px] sm:w-[255px] sm:h-[300px]  lg:w-[450px] lg:h-[530px] object-cover mb-2 "/>
            <p className="w-[170px] sm:w-[255px] lg:w-[450px] text-xs text-white">Semua lisensi Bebas Royalti mencakup hak penggunaan global, perlindungan komprehensif, harga sederhana dengan diskon volume tersedia</p>
          </div>
          <div className="px-3 sm:px-6 flex flex-col text-white">
            <h1 className="text-sm w-[120px] sm:w-[150px] sm:w-full sm:text-xl font-bold font-poppins text-white">{asset.title}</h1>
            <div className="flex text-xs text-white">
              <p className="mr-1">By</p>
              <p className="hover:underline w-[100px] sm:w-[140px] sm:w-full">Glicss Photograph</p>
            </div>
            <div className="sm:flex text-white">
              <p className="text-sm sm:text-xl font-bold mt-2">{asset.price}</p>
              <p className="text-xs sm:mt-4 sm:ml-3">Untuk 1 Asset ini</p>
            </div>
            <p className="text-sm w-[120px] sm:w-full font-bold sm:text-xl pt-4 sm:pt-8 ">Deskripsi Dataset</p>
            <p className="text-xs sm:text-sm w-[110px] sm:w-[260px] lg:w-[330px]">{asset.description}</p>
            <p className="text-xs sm:text-base font-semibold mt-7 sm:mt-16 lg:mt-20">Tipe File: MP4</p>
            <p className="text-xs sm:text-base font-semibold ">Category: Hutan</p>
            <div className="hidden lg:block flex flex-col pt-20 pl-8 space-y-8 text-white">
              <button className="flex w-[320px] h-[50px] items-center bg-[#575859] rounded-md">
                <img src={IconCart} alt="Cart" className="ml-6 mr-8 w-6 filter invert dark:invert" />
                <span className="text-base justify-center">Tambahkan ke Keranjang</span>
              </button>
              <button className="flex mt-8 w-[320px] h-[50px] items-center bg-[#2563EB] rounded-md">
                <img src={IconUnduh} alt="Unduh" className="ml-6 mr-16 w-6" />
                <span className="text-base font-bold ">Beli dan Unduh</span>
              </button>
            </div>
          </div>
        </div>
        <div className="block lg:hidden flex flex-col sm:pt-14 items-center gap-5 text-white mt-4 sm:mt-0">
          <div className="flex-grow"></div> 
          <button className="flex w-[260px] h-[50px] sm:w-[300px] items-center bg-[#575859] rounded-md">
            <img src={IconCart} alt="User" className="ml-6 mr-6 w-6" />
            <span className="text-xs justify-center">Tambahkan ke Keranjang</span>
          </button>
          <button className="flex w-[260px] h-[50px] sm:w-[300px] items-center bg-[#2563EB] rounded-md">
            <img src={IconCart} alt="User" className="ml-6 mr-12 w-6" />
            <span className="text-xs justify-center font-bold ">Beli dan Unduh</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetDataset() {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const assets = [
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Dilantai hutan. Suara gemericik air terjun dan kicau burung menciptakan simfoni alam yang menenangkan.', price: 'Rp. 30.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 50.000,00', image: Logo },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset },
    { title: 'Dataset Ombak Laut', description: 'Sore tenang...', price: 'Rp. 25.000,00', image: Dataset }
    
  ];

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAsset(null);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-white dark:bg-[#212121]">
      {/* Header */}
      <header className="navbar flex justify-between items-center px-4 sm:px-7 lg:px-10 font-roboto bg-[#FFFFFF] text-black dark:bg-[#171717] dark:text-white">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-14 w-14 sm:h-17 sm:w-17 lg:h-20 lg:w-20 mr-2 sm:mr-5 lg:mr-10" />
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">PixelStore</span>
        </div>
        <div className="hidden -mr-10 h-[40px] px-auto md:flex md:max-w-[240px] md:-ml-10 lg:max-w-[440px] xl:max-w-[660px] 2xl:-mr-14 bg-white rounded-[10px] items-center border-2 border-black">
          <p className="ml-4 pr-2 mr-2 w-18 h-[26px] border-r-2 border-[#64748B] dark:text-black">Search</p>
          <input
            type="text"
            placeholder="type"
            className="input input-bordered h-[23px] md:w-[100px] lg:w-[260px] xl:w-[500px] pb-3 pl-1 border-none"
          />
          <div className="h-10 ml-2 -mr-1 md:w-[50px] lg:w-[55px] xl:w-[60px] flex items-center justify-center bg-[#2563EB] rounded-r-[10px] border-2 border-black">
            <img src={IconSearch} alt="Search" className="w-5"/>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 2xl:gap-6 -mr-2">
          <button 
          onClick={toggleDarkMode}
          className="hidden md:block md:w-10 md:h-10 rounded-[5px] flex items-center justify-center border-2 border-black bg-[#F2F2F2]">
            <img src={IconDarkMode} alt="Dark Mode" className="ml-[5px]"/>
          </button>
          <div className="dropdown dropdown-end">
            <button className=" btn-circle flex w-[110px] h-6 md:w-[140px] md:h-[40px] items-center bg-[#F2F2F2] hover:bg-gray-200 rounded-md md:rounded-lg border-2 border-black">
              <img src={IconUser} alt="User" className="ml-2 mr-1 w-4 md:w-6" />
              <span className="text-xs w-[100px] md:text-base pb-0.5 font-semibold truncate dark:text-black">Hello, Sign in</span>
            </button>
            <ul className="menu menu-sm dropdown-content bg-[#F2F2F2] rounded-box z-[1] p-2 shadow w-[140px] mt-2">
              <li>
                <a className="justify-between">
                Profile
                <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
          <button className="block md:hidden">
            <img src={IconSearch} alt="Search" className="w-5 h-5 filter invert dark:filter-none"/>
          </button>
          <button className="block md:hidden">
            <img src={IconMenu} alt="Menu" className="w-6 h-6 filter invert dark:filter-none"/>
          </button>
          <button className="hidden md:block md:flex items-center w-[68px] h-10 rounded-lg px-2 py-1 border-2 border-black bg-[#F2F2F2]">
            <img src={IconCart} alt="Cart" className="h-[18px]" />
            <span className="ml-1 font-semibold dark:text-black">Cart</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex items-center bg-[#ECECEC] text-black dark:bg-[#201E43] dark:text-white h-[50px] pt-1 font-semibold font-roboto shadow-lg">
        <ul className="flex text-xs sm:text-sm lg:text-base gap-x-4 lg:gap-x-10 xl:gap-x-14 2xl:gap-x-16 px-4 sm:px-8 xl:px-10 2xl:px-14 overflow-x-auto whitespace-nowrap w-full">
          <li><a href="#" className="hover:underline pr-3 sm:pr-5 lg:pr-10 xl:pr-14 2xl:pr-16 border-r-2 border-[#000000] dark:border-[#FFFFFF] pb-1">Telusuri Semua</a></li>
          <li><a href="#" className="hover:underline">Asset Video</a></li>
          <li><a href="#" className="hover:underline">Asset Gambar</a></li>
          <li><a href="#" className="flex border-b-4 border-[#2563EB] pb-0.5">Asset Dataset</a></li>
          <li><a href="#" className="hover:underline">Asset Game</a></li>
          <li className="ml-auto"><a href="#" className="hover:underline pl-2 sm:pl-4 lg:pl-10 xl:pl-14 border-l-2 border-[#000000] dark:border-[#FFFFFF] pb-1">Asset Gratis</a></li>
        </ul>
      </nav>

      {/* Content */}
      <main className="bg-white dark:bg-[#212121]">
        <h1 className="bg-white dark:bg-[#212121] text-lg sm:text-xl font-semibold mt-6 mb-4 ml-4 sm:ml-16 font-roboto text-[#000000] dark:text-[#FFFFFF]">All Category</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-10 sm:px-10 font-poppins">
          {assets.map((asset, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-[#202020] shadow-lg w-full h-80 shadow-md rounded-lg p-4 sm:p-6"
              onClick={() => openModal(asset)}>
              <div className="flex justify-center">
                <img src={asset.image} alt="Product" className="w-full h-48 object-cover mb-2" />
              </div>
              <div className="text-sm">
                <p className="text-[#212121] dark:text-[#FFFFFF]">Glicss Photograph</p>
                <h2 className="font-semibold mb-2 text-[#171717] dark:text-[#FFFFFF]">Dataset Ombak Laut - Sore tenang….</h2>
                <div className="flex justify-between items-center ">
                  <span className="flex items-center text-[#212121] dark:text-[#FFFFFF]">
                    <img src={IconLike} alt="Like" className="mr-2 w-5 h-5"/> 2301
                  </span>
                  <span className="font-semibold text-[#212121] dark:text-[#FFFFFF]">Rp. 25.000,00</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AssetModal isOpen={modalOpen} onClose={closeModal} asset={selectedAsset} />

      {/* Pagination */}
      <div className="bg-[#5D5F5F] dark:bg-[#201E43] flex justify-center mt-12 py-4 font-roboto">
        <a href="#" className="px-3 py-1 text-white hover:text-black">««</a>
        <a href="#" className="px-3 py-1 bg-[#454747] dark:bg-[#233876] text-white rounded-full">1</a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">2</a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">3</a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">4</a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">5</a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">…</a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">Last »</a>
      </div>

      {/* Footer */}
      <footer className="bg-[#ECECEC] text-black dark:bg-[#212121] dark:text-white text-sm py-6 font-roboto">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-center font-semibold">
          <a href="#" className="hover:underline">Terms And Conditions</a>
          <a href="#" className="hover:underline">File Licenses</a>
          <a href="#" className="hover:underline">Refund Policy</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        <p className="text-center mt-4">Copyright © 2024 - All rights reserved by ACME Industries Ltd</p>
      </footer>
    </div>
  );
}

export default AssetDataset;
