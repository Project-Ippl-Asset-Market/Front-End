import React, { useState } from "react";
import IconUser from "../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../assets/icon/logo.jpg";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.svg";
import Dataset from "../../assets/icon/iconSidebar/dataset.png";
import IconLike from "../../assets/icon/iconSidebar/iconLike.png";

// Modal Component
function AssetModal({ isOpen, onClose, asset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg relative w-[600px] h-[712px]">
        <button onClick={onClose} className="absolute top-2 right-4 text-black">
          X
        </button>
        <h1 className="text-center font-semibold">{asset.title}</h1>
        <div className="relative">
          <img
            src={asset.image}
            alt="Asset"
            className="w-full h-64 object-cover mt-4 mb-4"
          />
          <p className="absolute bottom-0 right-0 bg-[#D9D9D9A6] opacity-85 font-bold text-black px-3 py-1 rounded-tl-[10px]">
            {asset.price}
          </p>
        </div>

        <h1 className="font-bold text-xl ml-4">Deskripsi Dataset</h1>
        <p className="text-gray-700 ml-4">{asset.description}</p>

        <div className="flex flex-col mt-4 items-center justify-end h-[280px]">
          <button className="bg-[#575859] text-white py-2 px-4 w-[400px] h-[50px] rounded-[15px] mb-5">
            Tambahkan ke Keranjang
          </button>
          <button className="bg-[#2563EB] font-bold text-white py-2 px-4 w-[400px] h-[50px] rounded-[15px] mb-5 ">
            Beli dan Download
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
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 30.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 50.000,00",
      image: Logo,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
    {
      title: "Dataset Ombak Laut",
      description: "Sore tenang...",
      price: "Rp. 25.000,00",
      image: Dataset,
    },
  ];

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div>
      {/* Header */}
      <header className="navbar bg-[#171717] flex justify-between items-center py-8">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-14 w-14 mr-10 ml-10" />
          <span className="text-2xl font-semibold text-white">PixelStore</span>
        </div>
        <div className="ml-28 w-[660px] h-[40px] bg-[#FFFFFF] rounded-[5px]">
          <p className="ml-4 w-16 h-[43.93px] pt-2">Search |</p>
          <input
            type="text"
            placeholder="type"
            className="input input-bordered w-[510px] h-[23px] ml-2 pt-1 bg-[#FFFFFF] border-none"
          />
          <div className="w-[59.96px] h-[40px] bg-[#2563EB] pt-2 ml-12 rounded-r  -[5px] ">
            <img className="w-[25px] h-[28px] ml-4" src={IconSearch} />
          </div>
        </div>
        <div className="flex gap-2 space-x-4">
          <div className="w-10 h-10 bg-[#F2F2F2] rounded-[5px] flex items-center justify-center -mr-6">
            <img src={IconDarkMode} alt=""></img>
          </div>
        </div>
        <div className="bg-[#F2F2F2] w-[75.95] h-[40px] flex rounded-[5px] pl-2 pr-2 -mr-6">
          <img alt="" src={IconCart} />
          <h1 className="ml-2">Cart</h1>
        </div>
        <div className="dropdown dropdown-end ">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar flex-col mr-6 w-[140px] h-[40px] rounded-[7px] bg-[#F2F2F2] hover:bg-[white]">
            <div className="w-[24.98px] h-[25px] rounded-full ml-2 ">
              <img alt="" src={IconUser} />
            </div>
            <div className="w-[130px] h-[30px] pt-2 -ml-7">Hello, Sign in</div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#F2F2F2] rounded-box z-[1] mt-3 w-52 p-2 shadow ">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#201E43] text-white py-4">
        <ul className="flex justify-start">
          <li className="ml-10">
            <a href="#" className="hover:underline">
              Telusuri Semua
            </a>
          </li>
          <li className="ml-8">
            <a> | </a>
          </li>
          <li className="ml-10">
            <a href="#" className="hover:underline">
              Asset Video
            </a>
          </li>
          <li className="ml-10">
            <a href="#" className="hover:underline">
              Asset Gambar
            </a>
          </li>
          <li className="ml-10">
            <a href="#" className="border-b-4 border-[#2563EB] pb-1">
              Asset Dataset
            </a>
          </li>
          <li className="ml-10">
            <a href="#" className="hover:underline">
              Asset Game
            </a>
          </li>
          <li className="ml-auto ">
            <a> | </a>
          </li>
          <li className="ml-8 mr-10">
            <a href="#" className="hover:underline">
              Asset Gratis
            </a>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <main className="mt-6">
        <h1 className="text-xl font-semibold mb-4 ml-16">All Category</h1>
        <div className="ml-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {assets.map((asset, index) => (
            <div
              key={index}
              className="bg-[#D9D9D9] w-full h-[335px] shadow-md rounded-lg p-6 cursor-pointer"
              onClick={() => openModal(asset)}>
              <div className="flex justify-center">
                <img
                  src={asset.image}
                  alt="Product"
                  className="w-53 h-48 object-cover mb-4"
                />
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Glicss Photograph</p>
                <h2 className="font-semibold mb-2">{asset.title}</h2>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center">
                    <img src={IconLike} className="mr-2 w-5 h-5" alt="Like" />{" "}
                    2301
                  </span>
                  <span className="font-semibold">{asset.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      <AssetModal
        isOpen={modalOpen}
        onClose={closeModal}
        asset={selectedAsset}
      />

      {/* Pagination */}
      <div className="bg-[#201E43] flex justify-center mt-16 py-5">
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          ««
        </a>
        <a href="#" className="px-3 py-1 bg-[#2563EB] text-white rounded-full">
          1
        </a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          2
        </a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          3
        </a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          4
        </a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          5
        </a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          …
        </a>
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          Last »
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-[#212121] text-white text-sm py-6">
        <div className="container mx-auto flex justify-center">
          <a href="#" className="hover:underline">
            Teams And Conditions
          </a>
          <a href="#" className="hover:underline ml-12">
            File Licenses
          </a>
          <a href="#" className="hover:underline ml-12">
            Refund Policy
          </a>
          <a href="#" className="hover:underline ml-12">
            Privacy Policy
          </a>
        </div>
        <p className="text-center mt-4">
          Copyright © 2024 - All rights reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
}

export default AssetDataset;
