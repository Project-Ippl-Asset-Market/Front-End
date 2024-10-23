import React, { useEffect, useState } from "react";
import Header from "/src/components/headerNavBreadcrumbs/HeaderWebUser";
import Iconcheck from "/src/assets/icon/iconPayment/check.png";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const [transaction, setTransaction] = useState(null); // Untuk menyimpan data transaksi
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil order_id dari query params di URL (bukan orderId)
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id"); // Ubah dari "orderId" menjadi "order_id"

  // Fetch data transaksi dari backend
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/after-pay?orderId=${orderId}`
        );
        const data = await response.json();
        setTransaction(data.transaction);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    if (orderId) {
      fetchTransaction();
    }
  }, [orderId]);

  // Handle button click to navigate
  const handleGoToHome = () => {
    navigate("/cart"); // Ganti dengan URL halaman utama
  };

  const handleViewTransactionDetails = () => {
    navigate(`/transaction-detail/${orderId}`); // Ganti dengan URL halaman detail transaksi
  };

  return (
    <div className="font-poppins">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40">
        <div className="pt-[80px] w-full">
          <Header />
        </div>
      </div>

      <div className="container mx-auto py-40 flex justify-center">
        <div className="bg-gray-800 shadow-lg rounded-md p-20 text-center max-w-2xl w-full border-gray-200">
          <div className="flex justify-center mb-4">
            <img src={Iconcheck} alt="icon-check" className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-semibold mb-4">Pembayaran Berhasil!</h2>

          {transaction ? (
            <div>
              <p className="mb-8">Order ID: {transaction.orderId}</p>
              <p>Total Amount: {transaction.grossAmount}</p>
            </div>
          ) : (
            <p>Memuat detail transaksi...</p>
          )}

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
