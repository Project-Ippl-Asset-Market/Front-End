// AkunDanKeamanan.jsx
import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import HeaderSidebar from "../HeaderNav/HeaderNav";

// Modal component for error handling
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

const AkunDanKeamanan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // State untuk pertanyaan yang dipilih
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
      setShowModal(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const akunQuestions = [
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer: (
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Buka halaman <strong>Pengaturan Akun</strong>.
          </li>
          <li>
            Pilih opsi <strong>Ubah Kata Sandi</strong>.
          </li>
          <li>Masukkan kata sandi lama dan yang baru.</li>
          <li>
            Klik <strong>Simpan</strong> untuk menyimpan perubahan.
          </li>
        </ol>
      ),
    },
    {
      question: "Apa yang harus saya lakukan jika akun saya dibajak?",
      answer: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Segera ubah kata sandi Anda.</li>
          <li>Periksa aktivitas login terbaru.</li>
          <li>Hubungi pusat bantuan jika ada aktivitas mencurigakan.</li>
        </ul>
      ),
    },
    {
      question: "Bagaimana cara mengamankan akun saya?",
      answer: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Aktifkan autentikasi dua faktor (2FA).</li>
          <li>Gunakan kata sandi yang kuat dan unik.</li>
          <li>Jangan pernah membagikan kata sandi Anda.</li>
          <li>Periksa dan perbarui pengaturan keamanan secara rutin.</li>
        </ul>
      ),
    },
    {
      question: "Apa yang harus saya lakukan jika saya lupa kata sandi?",
      answer: (
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Buka halaman <strong>Lupa Password</strong>.
          </li>
          <li>
            Masukkan email Anda dan klik <strong>Kirim</strong>.
          </li>
          <li>Cek email untuk tautan pemulihan kata sandi.</li>
          <li>Ikuti petunjuk dalam email untuk mengganti kata sandi.</li>
        </ol>
      ),
    },
  ];

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index === selectedQuestion ? null : index);
  };

  return (
    <div>
      <header className="bg-[#212121] text-white py-5 text-center">
        <HeaderSidebar />
      </header>

      <main className="bg-gray-100 py-10 px-5 min-h-screen mt-10">
        <div className="px-5 py-2">
          <Link to="/mainHelp_Page">
            <button className="bg-[#2563eb] text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
          </Link>
        </div>
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Pertanyaan Akun dan Keamanan
            </h2>
            <ul className="space-y-2">
              {akunQuestions.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleQuestionClick(index)}>
                  {item.question}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selectedQuestion !== null && (
          <div className="max-w-md mx-auto mt-8">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                {akunQuestions[selectedQuestion].question}
              </h2>
              {akunQuestions[selectedQuestion].answer}
            </div>
          </div>
        )}
      </main>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AkunDanKeamanan;
