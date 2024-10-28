import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

// Modal component
const Modal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#ECECEC] p-6 rounded-lg shadow-lg text-center max-w-md w-full"> {/* Background lebih samar */}
        <div className="flex flex-col items-center">
          <div className="bg-red-600 p-4 rounded-full">
            <span className="text-white text-4xl">✖</span>
          </div>
          <h2 className="text-xl font-bold mt-4">Hasil pencarian tidak ditemukan.</h2>
          <p className="text-sm mt-2">Coba gunakan kata kunci yang lebih umum atau periksa ejaan Anda.</p>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={onClose}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

const Bantuan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // State untuk modal
  const navigate = useNavigate();

  const searchMapping = {
    'kata sandi': '/akun-dan-keamanan',
    'keamanan': '/akun-dan-keamanan',
    'pembelian': '/pembelian',
    'penjualan': '/penjualan-asset',
    'asset': '/penjualan-asset',
    'apa yang saya buat kalau transaksi gagal': '/pembelian',
    'transaksi gagal': '/pembelian',
    'layanan': '/layanan',
    'kebijakan': '/kebijakan-pixel-store',
  };

  const handleSearch = () => {
    const searchKeyword = searchTerm.toLowerCase();
    if (searchMapping[searchKeyword]) {
      navigate(searchMapping[searchKeyword]);
    } else {
      setShowModal(true); // Tampilkan modal jika pencarian gagal
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <header className="bg-[#212121] text-white py-5 text-center">
        <div className="flex justify-between items-center px-10">
          <img src="PixelStore_LogowithBGandTextBSize.png" alt="Shopee" className="h-20" />
          <span className="font-bold text-lg mr-auto">Pusat Bantuan</span>
          <Link to="/kebijakan-pixel-store" className="text-sm cursor-pointer">
            Kebijakan PixelStore
          </Link>
        </div>
        <div className="mt-5">
          <h1 className="text-2xl mb-5">Hai, ada yang bisa kami bantu?</h1>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Mencari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-96 p-2 rounded-l-md border border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="bg-blue-600 text-black p-4 rounded-r-md flex items-center justify-center"
              onClick={handleSearch}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="bg-gray-100 py-10 px-5">
        <div className="max-w-md mx-auto space-y-4">
          <Link to="/akun-dan-keamanan">
            <button className="w-full bg-white text-left px-5 py-3 my-2 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
              Akun dan Keamanan
            </button>
          </Link>

          <Link to="/pembelian">
            <button className="w-full bg-white text-left px-5 py-3 my-2 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
              Pembelian
            </button>
          </Link>

          <Link to="/penjualan-asset">
            <button className="w-full bg-white text-left px-5 py-3 my-2 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
              Penjualan Asset
            </button>
          </Link>

          <Link to="/layanan">
            <button className="w-full bg-white text-left px-5 py-3 my-2 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
              Layanan
            </button>
          </Link>
        </div>
      </main>

      {showModal && <Modal onClose={() => setShowModal(false)} />} {/* Tampilkan modal jika diperlukan */}
    </div>
  );
};

export default Bantuan;
