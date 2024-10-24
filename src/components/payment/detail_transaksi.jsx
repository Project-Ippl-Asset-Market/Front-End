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
      <div className="bg-white mt-28 rounded-md shadow-lg p-6 w-full max-w-lg">
        <Header />

        <div className="text-center">
          <div className="text-center font-bold text-4xl leading-loose ">
            <p className="text-success-30">Terima Kasih</p>
          </div>

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
              <p>Nama Pengakuisisi: AsetMarket {transaction.assets?.name}</p>
              <p>
                <strong>Metode Pembayaran:</strong>{" "}
                {transaction.paymentMethod || "VirtualAccount"}
              </p>
              <p>
                <strong>Jumlah Pembayaran:</strong> Rp.
                {transaction.grossAmount.toLocaleString("id-ID")}
              </p>
              <p className="text-gray-700">
                <strong>Status: </strong> {""} {transaction.status}
              </p>
              <p>
                <strong>No. Transaksi:</strong> {transaction.orderId}
              </p>
              <p>
                <strong>Waktu Pembayaran: </strong>
                {transaction.paymentDetails?.paymentTime || "DD/MM/YYYY 00:00"}
              </p>
              {/* Tampilkan Nama Aset dari Array Assets */}
              {transaction.assets && transaction.assets.length > 0 && (
                <div className="mt-4">
                  <strong>Daftar Aset:</strong>
                  <ul>
                    {transaction.assets.map((asset, index) => (
                      <li key={index}>{asset.name}</li>
                    ))}
                  </ul>
                </div>
              )}
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
