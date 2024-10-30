import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import HeaderSidebar from "../HeaderNav/HeaderNav";

// Modal component
const Modal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#ECECEC] p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="bg-red-600 p-4 rounded-full">
            <span className="text-white text-4xl">✖</span>
          </div>
          <h2 className="text-xl font-bold mt-4">
            Hasil pencarian tidak ditemukan.
          </h2>
          <p className="text-sm mt-2">
            Coba gunakan kata kunci yang lebih umum atau periksa ejaan Anda.
          </p>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={onClose}>
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

const Pembelian = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal
  const navigate = useNavigate();

  const searchMapping = {
    "kata sandi": "/akun-dan-keamanan",
    keamanan: "/akun-dan-keamanan",
    pembelian: "/pembelian",
    penjualan: "/penjualan-asset",
    asset: "/penjualan-asset",
    "apa yang saya buat kalau transaksi gagal": "/pembelian",
    "transaksi gagal": "/pembelian",
    layanan: "/layanan",
  };

  const handleSearch = () => {
    const searchKeyword = searchTerm.toLowerCase();
    if (searchMapping[searchKeyword]) {
      navigate(searchMapping[searchKeyword]);
    } else {
      setShowModal(true); // Show modal if search result not found
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const pembelianQuestions = [
    "Bagaimana cara melakukan pembelian?",
    "Apa yang harus saya lakukan jika transaksi gagal?",
    "Bagaimana cara melacak pesanan saya?",
    "Apa saja metode pembayaran yang diterima?",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#212121] text-white py-5 text-center">
        <div className="mt-5 p-4">
          <HeaderSidebar />
        </div>
      </header>
      {/* Kembali ke Bantuan Button */}
      <div className="px-5 py-2">
        <Link to="/">
          <button className="bg-[#2563eb] text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> {/* Icon Back */}
            Back
          </button>
        </Link>
      </div>
      {/* Main Content */}
      <main className="bg-gray-100 py-10 px-5">
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pertanyaan Pembelian</h2>
            <ul className="space-y-2">
              {pembelianQuestions.map((question, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-600 hover:underline">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      {/* Modal for search not found */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}{" "}
      {/* Tampilkan modal jika pencarian gagal */}
    </div>
  );
};

export default Pembelian;
