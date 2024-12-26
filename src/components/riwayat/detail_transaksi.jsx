import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Iconcheck from "../../assets/icon/iconPayment/check.png";
import Header from "../headerNavBreadcrumbs/HeaderWebUser";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memformat waktu
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "Tanggal Tidak Diketahui";
    }

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Mengambil data transaksi dari Firebase
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const transactionRef = doc(db, "transactions", orderId);
        const transactionDoc = await getDoc(transactionRef);

        if (transactionDoc.exists()) {
          setTransaction(transactionDoc.data());
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
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 flex items-center justify-center">
      <div className="bg-white mt-28 rounded-md shadow-lg max-w-lg ">
        <Header />

        <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 p-10   font-poppins bg-primary-100">
          <div className="text-center">
            <div className="text-center font-bold text-4xl leading-loose ">
              <p className="text-success-30">Terima Kasih</p>
            </div>

            <img
              src={Iconcheck}
              alt="icon-check"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-neutral-90 p-10  mb-4">
              {transaction
                ? `Rp.${transaction.grossAmount.toLocaleString("id-ID")}`
                : "Detail Transaksi"}
            </h2>
          </div>

          {loading ? (
            <p>Loading transaction details...</p>
          ) : transaction ? (
            <div className="text-left text-gray-700 dark:text-neutral-90 p-10 ">
              <div className="mb-4">
                <p>
                  <strong>Jumlah Pembayaran:</strong> Rp.
                  {transaction.grossAmount.toLocaleString("id-ID")}
                </p>
                <p className="text-gray-700 dark:text-neutral-90 p-10 ">
                  <strong>Status: </strong> {""} {transaction.status}
                </p>
                <p>
                  <strong>No. Transaksi:</strong> {transaction.orderId}
                </p>
                <p>
                  <strong>Waktu Pembayaran: </strong>
                  {formatDate(transaction.createdAt) || "DD/MM/YYYY 00:00"}
                </p>
                {/* Tampilkan Nama Aset dari Array Assets */}
                {transaction.assets && transaction.assets.length > 0 && (
                  <div className="mt-4">
                    <strong>Nama Asset:</strong>
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
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full">
              Kembali Ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
