import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import IconUser from "../../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../../assets/icon/logo.jpg";
import IconSearch from "../../../assets/icon/iconHeader/iconSearch.png";
import IconLike from "../../../assets/icon/iconWebUser/iconLike.png";
import IconClose from "../../../assets/icon/iconWebUser/iconClose.png";
import IconUnduh from "../../../assets/icon/iconWebUser/iconUnduh.png";
import { NavbarSection } from "./NavbarSection";
import Header from "../../headerNavBreadcrumbs/HeaderWebUser";
import DefaultPreview from "../../../assets/icon/iconSidebar/datasetzip.png";

function AssetModal({ isOpen, onClose, asset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#5D5F5F] dark:bg-[#171717] p-8 sm:p-12 rounded-lg relative w-[320px] h-[570px] sm:w-[580px] sm:h-[660px] lg:w-[925px] lg:h-[700px] font-poppins">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <img src={IconClose} alt="X" className="w-5 h-5 sm:w-7 sm:h-7 " />
        </button>
        <div className="relative flex">
          <div className="-ml-4">
            <img
              src={asset.datasetImage || asset.uploadUrlImage || DefaultPreview}
              alt="Asset"
              className="w-[170px] h-[200px] sm:w-[255px] sm:h-[300px]  lg:w-[450px] lg:h-[530px] object-cover mb-2 "
              onError={(e) => {
                e.target.src = DefaultPreview;
              }}
            />
            <p className="w-[170px] sm:w-[255px] lg:w-[450px] text-xs text-white">
              Semua lisensi Bebas Royalti mencakup hak penggunaan global,
              perlindungan komprehensif, harga sederhana dengan diskon volume
              tersedia
            </p>
          </div>
          <div className="px-3 sm:px-6 flex flex-col text-white">
            <h1 className="text-sm w-[120px] sm:w-[150px] sm:text-xl font-bold font-poppins text-white">
              {asset.datasetName}
            </h1>
            <div className="flex text-xs text-white">
              <p className="mr-1">By</p>
              <p className="hover:underline w-[100px] sm:w-[140px]">
                Glicss Photograph
              </p>
            </div>
            <div className="sm:flex text-white">
              <p className="text-sm sm:text-xl font-bold mt-2">
                Rp. {asset.price}
              </p>
              <p className="text-xs sm:mt-4 sm:ml-3">Untuk 1 Asset ini</p>
            </div>
            <p className="text-sm w-[120px] sm:w-full font-bold sm:text-xl pt-4 sm:pt-8 ">
              Deskripsi Dataset
            </p>
            <p className="text-xs sm:text-sm w-[110px] sm:w-[260px] lg:w-[330px]">
              {asset.description}
            </p>
            <p className="text-xs sm:text-base font-semibold mt-7 sm:mt-16 lg:mt-20">
              Tipe File: MP4
            </p>
            <p className="text-xs sm:text-base font-semibold ">
              Category: {asset.category}
            </p>
            <div className="hidden lg:block flex-col pt-20 pl-8 space-y-8 text-white">
              <button className="flex w-[320px] h-[50px] items-center bg-[#575859] rounded-md">
                <img
                  src={IconCart}
                  alt="Cart"
                  className="ml-6 mr-8 w-6 filter invert dark:invert"
                />
                <span className="text-base justify-center">
                  Tambahkan ke Keranjang
                </span>
              </button>
              <button className="flex mt-8 w-[320px] h-[50px] items-center bg-[#2563EB] rounded-md">
                <img src={IconUnduh} alt="Unduh" className="ml-6 mr-16 w-6" />
                <span className="text-base font-bold ">Beli dan Unduh</span>
              </button>
            </div>
          </div>
        </div>
        <div className="block lg:hidden flex-col sm:pt-14 items-center gap-5 text-white mt-4 sm:mt-0">
          <div className="flex-grow"></div>
          <button className="flex w-[260px] h-[50px] sm:w-[300px] items-center bg-[#575859] rounded-md">
            <img src={IconCart} alt="User" className="ml-6 mr-6 w-6" />
            <span className="text-xs justify-center">
              Tambahkan ke Keranjang
            </span>
          </button>
          <button className="flex w-[260px] h-[50px] sm:w-[300px] items-center bg-[#2563EB] rounded-md">
            <img src={IconCart} alt="User" className="ml-6 mr-12 w-6" />
            <span className="text-xs justify-center font-bold ">
              Beli dan Unduh
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetGratis() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState([]);

  // Read
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dari Firestore
        const collections = [
          "assetDatasets",
          "assetVideos",
          "assetImages",
          "assetAudios",
          "assetImage2D",
          "assetImage3D",
        ];

        const allItems = [];

        for (const collectionName of collections) {
          const q = query(
            collection(db, collectionName),
            where("price", "==", 0)
          );
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Susun data ke dalam format assets
            allItems.push({
              collection: collectionName, // Nama koleksi sebagai pengenal
              ...data,
            });
          });
        }

        // Simpan data ke state setelah mengambil dari semua koleksi
        setAssets(allItems);
        console.log("item :", allItems); // Optional: untuk debugging
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

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
    if (localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-white dark:bg-[#212121]">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
        <div className="pt-[80px]  w-full">
          <Header />
        </div>
        <NavbarSection />
      </div>

      {/* Content */}
      <main className="bg-white dark:bg-[#212121] mt-36">
        <h1 className="bg-white dark:bg-[#212121] text-lg sm:text-xl font-semibold mt-6 mb-4 ml-4 sm:ml-16 font-roboto text-[#000000] dark:text-[#FFFFFF]">
          Asset Gratis
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-10 sm:px-10 font-poppins">
          {assets.map((asset, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#202020] shadow-lg w-full h-80 rounded-lg p-4 sm:p-6"
              onClick={() => openModal(asset)}>
              <div className="flex justify-center">
                <img
                  src={
                    asset.uploadUrlVideo ||
                    asset.uploadUrlImage ||
                    DefaultPreview
                  }
                  alt="Product"
                  className="w-full h-48 object-cover mb-2"
                  onError={(e) => {
                    e.target.src = DefaultPreview;
                  }}
                />
              </div>
              <div className="text-sm">
                <p className="text-[#212121] dark:text-[#FFFFFF]">
                  Glicss Photograph
                </p>
                <h2 className="font-semibold mb-2 text-[#171717] dark:text-[#FFFFFF] truncate">
                  {asset.datasetName || asset.imageName} - {asset.description}
                </h2>
                <div className="flex justify-between items-center ">
                  <span className="flex items-center text-[#212121] dark:text-[#FFFFFF]">
                    <img src={IconLike} alt="Like" className="mr-2 w-5 h-5" />{" "}
                    2301
                  </span>
                  <span className="font-semibold text-[#212121] dark:text-[#FFFFFF]">
                    {asset.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AssetModal
        isOpen={modalOpen}
        onClose={closeModal}
        asset={selectedAsset}
      />

      {/* Pagination */}
      <div className="bg-[#5D5F5F] dark:bg-[#201E43] flex justify-center mt-12 py-4 font-roboto">
        <a href="#" className="px-3 py-1 text-white hover:text-black">
          ««
        </a>
        <a
          href="#"
          className="px-3 py-1 bg-[#454747] dark:bg-[#233876] text-white rounded-full">
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
      <footer className="bg-[#ECECEC] text-black dark:bg-[#212121] dark:text-white text-sm py-6 font-roboto">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-center font-semibold">
          <a href="#" className="hover:underline">
            Terms And Conditions
          </a>
          <a href="#" className="hover:underline">
            File Licenses
          </a>
          <a href="#" className="hover:underline">
            Refund Policy
          </a>
          <a href="#" className="hover:underline">
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

export default AssetGratis;
