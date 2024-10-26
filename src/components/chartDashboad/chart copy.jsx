// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts"; // Menggunakan react-apexcharts untuk komponen grafik
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // sesuaikan dengan path file konfigurasi Firebase

const AssetChart = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [categories, setCategories] = useState([]);

  const options = {
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "line",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26,
      },
    },
    xaxis: {
      categories: categories, // Kategori tanggal
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: (value) => Math.round(value), // Menampilkan label y-axis sebagai integer
        style: {
          colors: "#333",
          fontSize: "12px",
        },
      },
    },
  };

  const fetchTransactionData = async () => {
    try {
      const transactionsSnapshot = await getDocs(
        collection(db, "transactions")
      );
      const dataMap = {};

      transactionsSnapshot.forEach((doc) => {
        const data = doc.data();
        const orderDate = data.orderDate; // Pastikan ada field `orderDate` di Firestore
        const orderId = data.orderId;

        if (orderDate && orderId) {
          if (!dataMap[orderDate]) dataMap[orderDate] = new Set();
          dataMap[orderDate].add(orderId); // Menambahkan unique orderId ke set per tanggal
        }
      });

      // Mengonversi dataMap ke dalam array untuk ApexCharts
      const dates = Object.keys(dataMap).sort(); // Urutkan berdasarkan tanggal
      const transactionsPerDate = dates.map((date) => dataMap[date].size); // Menghitung transaksi unik per tanggal

      setCategories(dates);
      setTransactionData(transactionsPerDate);
    } catch (error) {
      console.error("Error fetching transactions data: ", error);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  return (
    <div className="w-full h-auto bg-white rounded-lg shadow-lg dark:bg-neutral-25 dark:shadow-neutral-10 p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <h5 className="text-gray-500 dark:text-gray-400 mb-2">
          Asset Terjual per Tanggal
        </h5>
      </div>
      <Chart
        options={options}
        series={[{ name: "Asset Terjual", data: transactionData }]}
        height="300"
      />
    </div>
  );
};

export default AssetChart;
