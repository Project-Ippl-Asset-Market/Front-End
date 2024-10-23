import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Iconcheck from "/src/assets/icon/iconPayment/check.png"; // Sesuaikan jalur file jika perlu
import Header from "../../components/headerNavBreadcrumbs/HeaderWebUser";
import { db } from "../../firebase/firebaseConfig"; // Pastikan untuk mengimpor konfigurasi Firebase Anda
import { doc, getDoc } from "firebase/firestore";

const PaymentSuccess = () => {
  const { orderId } = useParams(); // Mengambil orderId dari URL
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null); // Menyimpan data transaksi
  const [loading, setLoading] = useState(true);

  // Mengambil data transaksi dari Firebase
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const transactionRef = doc(db, "transactions", orderId); // Pastikan koleksi Firestore adalah "transactions"
        const transactionDoc = await getDoc(transactionRef);

        if (transactionDoc.exists()) {
          setTransaction(transactionDoc.data()); // Set data transaksi ke state
        } else {
          console.error("Transaksi tidak ditemukan");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [orderId]);

  // Navigasi ke halaman utama saat tombol ditekan
  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="font-poppins bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
        <Header />

        <div className="text-center">
          <img
            src={Iconcheck}
            alt="icon-check"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {transaction
              ? `Rp.${transaction.grossAmount.toLocaleString("id-ID")}`
              : "Detail Transaksi"}
          </h2>
        </div>

        {loading ? (
          <p>Loading transaction details...</p>
        ) : transaction ? (
          <div className="text-left text-gray-700">
            <div className="mb-4">
              {/* <p>Pembayaran Ke: Pulsa MyXL</p> */}
              <p>Nama Pengakuisisi: AsetMarket</p>
              <p>
                <strong>Metode Pembayaran:</strong>{" "}
                {transaction.paymentMethod || "VirtualAccount"}
              </p>
              <p>
                <strong>Jumlah Pembayaran:</strong> Rp.
                {transaction.grossAmount.toLocaleString("id-ID")}
              </p>
              <p className="text-gray-700">
                <strong>Status: </strong> {""} {"Paid"}
              </p>
              <p>
                <strong>No. Transaksi:</strong> {transaction.orderId}
              </p>
              <p>
                <strong>No. Referensi:</strong> XXXXXXXX
              </p>
              <p>
                Waktu Selesai:{" "}
                {transaction.transaction_time || "DD/MM/YYYY 00:00"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Transaksi tidak ditemukan.</p>
        )}

        <div className="text-center mt-6">
          <button
            onClick={handleGoToHome}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
          >
            Kembali Ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
