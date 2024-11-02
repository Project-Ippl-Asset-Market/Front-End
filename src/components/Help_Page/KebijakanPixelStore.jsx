import React, { useState } from 'react';
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

// Modal component
const Modal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#ECECEC] p-6 rounded-lg shadow-lg text-center max-w-md w-full">
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

const KebijakanPixelStore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal
  const navigate = useNavigate();

  const kebijakanSections = [
    {
      title: 'Kebijakan Umum',
      items: [
        'Syarat Layanan',
        'Kebijakan Privasi',
        'Kebijakan Barang yang Dilarang dan Dibatasi',
        'Kebijakan Pengembalian Barang dan Dana',
        'Peraturan Komunitas',
      ],
    },
    {
      title: 'Program Khusus',
      items: [
        'Syarat Layanan Program Ekspor',
        'Syarat Layanan Tambahan untuk Program Penjualan Luar Negeri',
        'Persyaratan Layanan untuk Mall',
        'Persyaratan Layanan Flash Sale',
        'Persyaratan Layanan untuk Brand Portal',
        'Persyaratan Layanan Jasa KOL',
      ],
    },
    {
      title: 'Program Afiliasi',
      items: [
        'Syarat dan Ketentuan Program Afiliasi untuk Penjual',
        'Syarat dan Ketentuan Program Afiliasi untuk Individu',
        'Syarat dan Ketentuan Program Afiliasi untuk Perusahaan',
      ],
    },
  ];

  const handleSearch = () => {
    const searchKeyword = searchTerm.toLowerCase();
    const found = kebijakanSections.some(section =>
      section.items.some(item => item.toLowerCase().includes(searchKeyword))
    );
    
    if (found) {
      navigate(`/kebijakan-pixelstore?q=${encodeURIComponent(searchKeyword)}`);
    } else {
      setShowModal(true); // Show modal if search result not found
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#212121] text-white py-5 text-center">
        <div className="flex justify-between items-center px-10">
          <img src="PixelStore_LogowithBGandTextBSize.png" alt="Pixel Store" className="h-20" />
          <span className="font-bold text-lg mr-auto">Pusat Bantuan</span>
          <span className="text-sm">Kebijakan PixelStore</span>
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
              className="bg-blue-600 text-white p-2 rounded-r-md flex items-center justify-center"
              onClick={handleSearch}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Kembali ke Bantuan Button */}
      <div className="px-5 py-2">
        <Link to="/">
          <button className="bg-[#2563eb] text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> {/* Tambahkan Icon Kembali */}
            Back
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-5">
          <h2 className="text-lg font-semibold mb-4">Kebijakan PixelStore</h2>
          <ul className="space-y-2">
            {kebijakanSections.map((section, index) => (
              <li key={index}>
                <button
                  className="w-full text-left font-medium"
                  onClick={() => setSelectedSection(selectedSection === index ? null : index)}
                >
                  {section.title}
                </button>
                {selectedSection === index && (
                  <ul className="mt-2 pl-4">
                    {section.items.map((item, subIndex) => (
                      <li
                        key={subIndex}
                        className="text-blue-600 hover:underline cursor-pointer mt-1"
                        onClick={() => navigate(`/kebijakan-pixelstore?q=${encodeURIComponent(item)}`)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Kebijakan Section */}
        <main className="w-3/4 bg-gray-50 p-5">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Kebijakan PixelStore</h2>
            <p>
              Selamat datang di halaman Kebijakan PixelStore. Anda dapat menemukan informasi lengkap mengenai kebijakan
              penggunaan, privasi, pengembalian, dan program khusus kami di sini. Pilih salah satu topik dari menu di sebelah
              kiri untuk mempelajari lebih lanjut.
            </p>

            {/* Menu Kebijakan */}
            <div className="mt-8">
              {kebijakanSections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {section.items.map((item, subIndex) => (
                      <li
                        key={subIndex}
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`/kebijakan-pixelstore?q=${encodeURIComponent(item)}`)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for search not found */}
      {showModal && <Modal onClose={() => setShowModal(false)} />} {/* Tampilkan modal jika pencarian gagal */}
    </div>
  );
};

export default KebijakanPixelStore;
