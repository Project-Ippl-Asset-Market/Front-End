import React, { useEffect } from "react";
import Header from "/src/components/headerNavBreadcrumbs/HeaderWebUser";
//import { NavbarSection } from "./NavbarSection";
import Iconcheck from "/src/assets/icon/iconPayment/check.png";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  // useEffect to load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-QM4rGhnfcyjCT3LL"); // Client Key kamu
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle button click to navigate
  const handleGoToHome = () => {
    window.location.href = "/cart"; // Ganti dengan URL halaman utama
  };

  const handleViewTransactionDetails = () => {
    window.location.href = "/transaction-details"; // Ganti dengan URL halaman detail transaksi
  };

  return (
    <div className="font-poppins">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40">
        <div className="pt-[80px] w-full">
          <Header />
        </div>
        /
      </div>

      <div className="container mx-auto py-40 flex justify-center">
        <div className="bg-gray-800 shadow-lg rounded-md p-20 text-center max-w-2xl w-full border-gray-200">
          <div className="flex justify-center mb-4">
            <img src={Iconcheck} alt="icon-check" className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-semibold mb-4">Pembayaran Berhasil!</h2>
          <p className="mb-8">Terima kasih telah melakukan pembayaran.</p>

          <div className="flex justify-center space-x-5">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
              onClick={handleGoToHome}
            >
              Kembali ke Halaman Utama
            </button>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded-md"
              onClick={handleViewTransactionDetails}
            >
              Lihat Detail Transaksi
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-darknavy text-white min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[10px] sm:text-[12px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All right reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
};

export default PaymentSuccess;
