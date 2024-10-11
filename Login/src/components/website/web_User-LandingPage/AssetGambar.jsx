import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebaseConfig'
import { getDocs, collection, doc, addDoc, getDoc } from 'firebase/firestore';
import IconUser from "../../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../../assets/icon/logo.jpg";
import IconSearch from "../../../assets/icon/iconHeader/iconSearch.png";
import IconLike from "../../../assets/icon/iconWebUser/iconLike.png";
import IconClose from "../../../assets/icon/iconWebUser/iconClose.png";
import IconUnduh from "../../../assets/icon/iconWebUser/iconUnduh.png";
import {NavbarSection} from "./NavbarSection";
import Header from "../../headerNavBreadcrumbs/HeaderWebUser";


function AssetModal({ isOpen, onClose, asset }) {
  if (!isOpen) return null;

  const handleAddCart = async (assetId) => {
    try {
      console.log(assetId);
      if (typeof assetId !== "string") {
        throw new Error("Invalid assetId: it must be a string.");
      }
  
      // Cek apakah aset sudah ada di cartPopUp
      const cartQuerySnapshot = await getDocs(collection(db, "cartPopUp"));
      const existingCartItem = cartQuerySnapshot.docs.find(doc => doc.data().assetId === assetId);
  
      if (existingCartItem) {
        console.error("Asset already in cart!");
        return; // Stop jika aset sudah ada di keranjang
      }
  
      // Function to get the asset from any collection
      const getAssetFromCollections = async (collections, assetId) => {
        for (const collectionName of collections) {
          const assetDocRef = doc(db, collectionName, assetId);
          const assetDocSnap = await getDoc(assetDocRef);
          
          if (assetDocSnap.exists()) {
            return assetDocSnap.data(); // Return asset data if found
          }
        }
        return null; // Return null if asset not found in any collection
      };
  
      // List of collections to search
      const collections = [
        "assetDatasets",
        "assetVideos",
        "assetImages",
        "assetAudios",
        "assetImage2D",
        "assetImage3D"
      ];
  
      // Search the collections for the asset
      const assetData = await getAssetFromCollections(collections, assetId);
  
      if (assetData) {
        // Add the asset to cartPopUp if found
        await addDoc(collection(db, "cartPopUp"), {
          ...assetData, // Copy all asset data
          assetId: assetId, // Add asset ID for reference
          addedAt: new Date() // Add timestamp
        });
  
        console.log("Item successfully added to cart");
      } else {
        console.error("No such asset in any collection!");
      }
    } catch (error) {
      console.error("Error adding item to cart: ", error);
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#5D5F5F] dark:bg-[#171717] p-8 sm:p-12 rounded-lg relative w-[320px] h-[570px] sm:w-[580px] sm:h-[660px] lg:w-[925px] lg:h-[700px] font-poppins">
        <button onClick={onClose} className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <img src={IconClose} alt="X" className="w-5 h-5 sm:w-7 sm:h-7 "/>
        </button>
        <div className="relative flex">
          <div className="-ml-4">
            <img src={asset.uploadUrlImage} alt="Asset" className="w-[170px] h-[200px] sm:w-[255px] sm:h-[300px]  lg:w-[450px] lg:h-[530px] object-cover mb-2 "/>
            <p className="w-[170px] sm:w-[255px] lg:w-[450px] text-xs text-white">Semua lisensi Bebas Royalti mencakup hak penggunaan global, perlindungan komprehensif, harga sederhana dengan diskon volume tersedia</p>
          </div>
          <div className="px-3 sm:px-6 flex flex-col text-white">
            <h1 className="text-sm w-[120px] sm:w-[150px] sm:text-xl font-bold font-poppins text-white">{asset.imageName}</h1>
            <div className="flex text-xs text-white">
              <p className="mr-1">By</p>
              <p className="hover:underline w-[100px] sm:w-[140px]">Glicss Photograph</p>
            </div>
            <div className="sm:flex text-white">
              <p className="text-sm sm:text-xl font-bold mt-2">{asset.price}</p>
              <p className="text-xs sm:mt-4 sm:ml-3">Untuk 1 Asset ini</p>
            </div>
            <p className="text-sm w-[120px] sm:w-full font-bold sm:text-xl pt-4 sm:pt-8 ">Deskripsi Dataset</p>
            <p className="text-xs sm:text-sm w-[110px] sm:w-[260px] lg:w-[330px]">{asset.description}</p>
            <p className="text-xs sm:text-base font-semibold mt-7 sm:mt-16 lg:mt-20">Tipe File: MP4</p>
            <p className="text-xs sm:text-base font-semibold ">Category: Hutan</p>
            <div className="hidden lg:block flex-col pt-20 pl-8 space-y-8 text-white">
              <button 
              className="flex w-[320px] h-[50px] items-center bg-[#575859] rounded-md"
              onClick={() => handleAddCart(asset.assetId)}>
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
        <div className="block lg:hidden flex-col sm:pt-14 items-center gap-5 text-white mt-4 sm:mt-0">
          <div className="flex-grow"></div> 
          <button className="flex w-[260px] h-[50px] sm:w-[300px] items-center bg-[#575859] rounded-md"
          onClick={() => handleAddCart(asset.assetId)}>
            <img src={IconCart} alt="User" className="ml-6 mr-6 w-6 filter invert dark:invert" />
            <span className="text-xs justify-center">Tambahkan ke Keranjang</span>
          </button>
          <button className="flex w-[260px] h-[50px] sm:w-[300px] items-center bg-[#2563EB] rounded-md">
            <img src={IconUnduh} alt="User" className="ml-6 mr-12 w-6" />
            <span className="text-xs justify-center font-bold ">Beli dan Unduh</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetGambar() {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState([]);

  // Read
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dari Firestore
        const querySnapshot = await getDocs(collection(db, 'assetImages')); // Ganti 'nama_koleksi' dengan nama koleksi di Firestore
        const items = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();

        // Susun data ke dalam format assets
          items.push({
            assetId: doc.id,
            category: data.category,           // Kategori dataset (opsional, jika ingin ditambahkan)
            imageName: data.imageName,       // Nama dataset dari Firestore
            description: data.description,      // Deskripsi dataset dari Firestore
            price: `Rp. ${data.price}`,         // Harga dataset dari Firestore
            uploadUrlImage: data.uploadUrlImage,   // URL gambar dataset dari Firestore
          });

          console.log(data)
          
        };
        setAssets(items);  // Simpan data ke state
      } catch (error) {
        console.error('Error fetching data: ', error);
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
      <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
        <div className="pt-[80px]  w-full">
          <Header />
        </div>
        <NavbarSection />
      </div>
    {/* <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
      <a class="flex items-center space-x-3 text-black dark:text-white">
          <img src={Logo} alt="Logo" className="h-14 w-14 sm:h-17 sm:w-17 lg:h-20 lg:w-20 mr-2 sm:mr-5 lg:mr-10" />
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">PixelStore</span>
      </a>
      <div class="flex md:order-1">
        <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
          <span class="sr-only">Search</span>
        </button>
        <div className="hidden -mr-10 h-[40px] px-auto md:flex md:max-w-[240px] md:-ml-10 lg:max-w-[440px] xl:max-w-[660px] 2xl:-mr-14 bg-white rounded-[10px] items-center border-2 border-black">
          <p className="ml-4 pr-2 mr-2 w-18 h-[26px] border-r-2 border-[#64748B] dark:text-black">Search</p>
          <input
            type="text"
            placeholder="type"
            className="input input-bordered h-[23px] md:w-[100px] lg:w-[260px] xl:w-[500px] pb-2.5 pl-1 border-none dark:text-black"
          />
          <div className="h-10 ml-2 -mr-1 md:w-[50px] lg:w-[55px] xl:w-[60px] flex items-center justify-center bg-[#2563EB] rounded-r-[10px] border-2 border-black">
            <img src={IconSearch} alt="Search" className="w-5"/>
          </div>
        </div>
        <button data-collapse-toggle="navbar-search" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
      </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
          <div class="relative mt-3 md:hidden">
            <div className='flex px-auto mt-2 h-10 bg-white rounded-[10px] items-center border-2 border-black'>
              <p className="ml-3 pr-2 mr-2 w-18 h-[26px] border-r-2 border-[#64748B] dark:text-black">Search</p>
              <input
                type="text"
                placeholder="type"
                className="input input-bordered block h-[23px] w-full pb-2.5 pl-1 border-none dark:text-black"
              />
              <div className="w-[60px] h-10  ml-2 -mr-0.5 flex items-center justify-center bg-[#2563EB] rounded-r-[10px] border-2 border-black">
                <img src={IconSearch} alt="Search" className="w-5"/>
              </div> 
            </div>
             
          </div>
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border gap-4 border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <button 
              onClick={toggleDarkMode}
              className="hidden md:block md:w-10 md:h-10 rounded-[5px] items-center justify-center border-2 border-black bg-[#F2F2F2]">
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
            <button className="hidden md:flex items-center w-[68px] h-10 rounded-lg px-2 py-1 border-2 border-black bg-[#F2F2F2]">
              <img src={IconCart} alt="Cart" className="h-[18px]" />
              <span className="ml-1 font-semibold dark:text-black">Cart</span>
            </button>
            <li>
              <a href="#" class="block md:hidden py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
            </li>
            <li>
              <a href="#" class="block md:hidden  py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
            </li>
          </ul>
        </div>
      </div>
    </nav> */}

      {/* Navigation */}
      {/* <nav className="flex items-center bg-[#ECECEC] text-black dark:bg-[#201E43] dark:text-white h-[50px] pt-1 font-semibold font-roboto shadow-lg">
        <ul className="flex text-xs sm:text-sm lg:text-base gap-x-4 lg:gap-x-10 xl:gap-x-14 2xl:gap-x-16 px-4 sm:px-8 xl:px-10 2xl:px-14 overflow-x-auto whitespace-nowrap w-full">
          <li><a href="#" className="hover:underline pr-3 sm:pr-5 lg:pr-10 xl:pr-14 2xl:pr-16 border-r-2 border-[#000000] dark:border-[#FFFFFF] pb-1">Telusuri Semua</a></li>
          <li><a href="#" className="hover:underline">Asset Video</a></li>
          <li><a href="#" className="hover:underline">Asset Gambar</a></li>
          <li><a href="#" className="flex border-b-4 border-[#2563EB] pb-0.5">Asset Dataset</a></li>
          <li><a href="#" className="hover:underline">Asset Game</a></li>
          <li className="ml-auto"><a href="#" className="hover:underline pl-2 sm:pl-4 lg:pl-10 xl:pl-14 border-l-2 border-[#000000] dark:border-[#FFFFFF] pb-1">Asset Gratis</a></li>
        </ul>
      </nav> */}

      {/* Content */}
      <main className="bg-white dark:bg-[#212121] mt-36">
        <h1 className="bg-white dark:bg-[#212121] text-lg sm:text-xl font-semibold mt-6 mb-4 ml-4 sm:ml-16 font-roboto text-[#000000] dark:text-[#FFFFFF]">Asset Gambar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-10 sm:px-10 font-poppins">
          {assets.map((asset, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-[#202020] shadow-lg w-full h-80 rounded-lg p-4 sm:p-6"
              onClick={() => openModal(asset)}>
              <div className="flex justify-center">
                <img src={asset.uploadUrlImage} alt="Product" className="w-full h-48 object-cover mb-2" />
              </div>
              <div className="text-sm">
                <p className="text-[#212121] dark:text-[#FFFFFF]">Glicss Photograph</p>
                <h2 className="font-semibold mb-2 text-[#171717] dark:text-[#FFFFFF] truncate">{asset.imageName} - {asset.description}</h2>
                <div className="flex justify-between items-center ">
                  <span className="flex items-center text-[#212121] dark:text-[#FFFFFF]">
                    <img src={IconLike} alt="Like" className="mr-2 w-5 h-5"/> 2301
                  </span>
                  <span className="font-semibold text-[#212121] dark:text-[#FFFFFF]">{asset.price}</span>
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

export default AssetGambar;
