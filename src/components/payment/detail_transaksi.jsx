// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/headerNavBreadcrumbs/HeaderWebUser";
import { NavbarSection } from "../../components/website/web_User-LandingPage/NavbarSection";

const TransactionDetails = () => {
  const { orderId } = useParams();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/transaction-details/${orderId}`
        );
        const data = await response.json();

        setTransactionDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [orderId]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="bg-primary-100 dark:bg-neutral-20 font-poppins h-full min-h-screen">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40">
        <div className="pt-[80px] w-full">
          <Header />
        </div>
        <NavbarSection />
      </div>

      <div className="container mx-auto py-40">
        <h2 className="text-2xl font-semibold mb-6">Detail Transaksi</h2>

        {transactionDetails ? (
          <div className="bg-gray-200 p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              <strong>Order ID:</strong> {transactionDetails.orderId}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong> {transactionDetails.status}
            </p>
            <p className="text-gray-700">
              <strong>Payment Type:</strong> {transactionDetails.payment_type}
            </p>
            <p className="text-gray-700">
              <strong>Transaction Time:</strong>{" "}
              {transactionDetails.transaction_time}
            </p>
            <p className="text-gray-700">
              <strong>Total Amount:</strong> Rp.{" "}
              {transactionDetails.gross_amount.toLocaleString("id-ID")}
            </p>
          </div>
        ) : (
          <p className="text-red-500">Transaksi tidak ditemukan.</p>
        )}
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

export default TransactionDetails;
