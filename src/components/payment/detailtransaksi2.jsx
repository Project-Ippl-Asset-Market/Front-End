// src/pages/DetailTransaksi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DetailTransaksi = () => {
  const { orderId } = useParams(); // Dapatkan orderId dari URL
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/transaction-detail/${orderId}`
        );
        setTransactionDetails(response.data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [orderId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!transactionDetails) {
    return <p>Transaction not found</p>;
  }

  return (
    <div>
      <h2>Detail Transaksi</h2>
      <p>Order ID: {transactionDetails.orderId}</p>
      <p>
        Nama: {transactionDetails.customerDetails.first_name}{" "}
        {transactionDetails.customerDetails.last_name}
      </p>
      <p>Email: {transactionDetails.customerDetails.email}</p>
      <p>Nomor Telepon: {transactionDetails.customerDetails.phone}</p>
      <p>Status Pembayaran: {transactionDetails.status}</p>
      <p>Total Pembayaran: {transactionDetails.grossAmount}</p>
      <h3>Items:</h3>
      <ul>
        {transactionDetails.items.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} x {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailTransaksi;
