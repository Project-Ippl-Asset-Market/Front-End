<<<<<<< HEAD
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Tambahkan ke imports
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function WithdrawRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [withdrawalStatus, setWithdrawalStatus] = useState(""); // Status pengajuan
  const [file, setFile] = useState(null); // Untuk menangani file yang diupload
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage(); // Inisialisasi Firebase Storage

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        // Ambil total revenue berdasarkan assetOwnerID dari koleksi transactions
        const fetchTotalRevenue = async () => {
          let total = 0;
          const transactionsSnapshot = await getDocs(
            collection(db, "transactions")
          );

          transactionsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (
              data.grossAmount &&
              data.assetOwnerID === user.uid &&
              data.status === "Success"
            ) {
              total += data.grossAmount;
            }
          });

          setTotalRevenue(total); // Set total revenue
        };

        fetchTotalRevenue();

        // Ambil data pengguna dari koleksi accountSettings
        const userDocRef = doc(db, "accountSettings", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setAccountNumber(data.nomorRekening || "");
          setBankName(data.namaBank || "");
        } else {
          console.error("Dokumen pengguna tidak ditemukan.");
        }
      } else {
        console.error("Pengguna tidak terautentikasi");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!amount || !accountNumber || !bankName) {
      setWithdrawalStatus("Semua field harus diisi!");
      return;
    }

    if (amount <= 0 || amount > totalRevenue) {
      setWithdrawalStatus("Jumlah pencairan tidak valid.");
      return;
    }

    try {
      // Upload file jika ada
      let fileUrl = null;
      if (file) {
        const storageRef = ref(
          storage,
          `withdraws/${currentUserId}/${file.name}`
        ); // Path upload
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef); // Dapatkan URL file setelah upload
      }

      // Simpan permintaan pencairan ke Firestore
      await setDoc(doc(db, "withdrawRequests", currentUserId), {
        amount,
        accountNumber,
        bankName,
        status: "Pending",
        timestamp: new Date(),
        fileUrl, // Simpan URL file jika ada
      });

      setWithdrawalStatus("Pengajuan pencairan dana berhasil diajukan.");
      // Reset nilai setelah sukses
      setAmount("");
      setFile(null); // Reset file input
    } catch (error) {
      console.error("Error saat mengajukan pencairan dana:", error);
      setWithdrawalStatus("Gagal mengajukan pencairan dana.");
    }
  };

  return (
    <>
      <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
        <HeaderSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <aside
          id="sidebar-multi-level-sidebar"
          className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100">
            <NavigationItem />
          </div>
        </aside>

        <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen mt-24">
          <h1 className="text-2xl font-semibold mb-6">
            Pengajuan Pencairan Dana
          </h1>

          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold">Total Pendapatan</h2>
            <p className="text-2xl font-bold">
              Rp. {totalRevenue.toLocaleString()}
            </p>
          </div>

          {withdrawalStatus && (
            <p className="text-green-500 mb-4">{withdrawalStatus}</p>
          )}

          <form
            className="shadow-lg p-6 bg-white rounded-lg"
            onSubmit={handleWithdrawSubmit}
          >
            <label className="block mb-2 font-medium" htmlFor="amount">
              Jumlah Pencairan
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mb-4 w-full p-2 border rounded"
              placeholder="Masukkan jumlah"
            />

            <label className="block mb-2 font-medium" htmlFor="account-number">
              Nomor Rekening
            </label>
            <input
              type="text"
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="mb-4 w-full p-2 border rounded"
              placeholder="Nomor rekening"
              readOnly
            />

            <label className="block mb-2 font-medium" htmlFor="bank-name">
              Nama Bank
            </label>
            <input
              type="text"
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              className="mb-4 w-full p-2 border rounded"
              placeholder="Nama bank"
              readOnly
            />

            <label className="block mb-2 font-medium" htmlFor="file-upload">
              <p>Upload File Tambahan (Screenshot)</p>
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*" // Hanya menerima file gambar
              onChange={(e) => setFile(e.target.files[0])} // Ambil file pertama
              className="mb-4"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Ajukan Pencairan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default WithdrawRequest;
=======
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Sesuaikan dengan path Anda
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function WithdrawRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [nomorRekening, setNomorRekening] = useState("");
  const [namaBank, setNamaBank] = useState("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState("");
  const [jumlahPenarikan, setJumlahPenarikan] = useState("");
  const [requestStatus, setRequestStatus] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setCurrentUserId(user.uid);

      // Ambil total revenue dari koleksi transactions
      const fetchTotalRevenue = async () => {
        let total = 0;
        const transactionsSnapshot = await getDocs(
          collection(db, "transactions")
        );

        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();

          // Pastikan data memiliki field grossAmount dan status
          if (data.grossAmount && data.status === "Success") {
            total += data.grossAmount;
          }
        });

        setTotalRevenue(total);
      };

      fetchTotalRevenue();
    }
  }, []);

  const handleRequestWithdraw = async (e) => {
    e.preventDefault();

    if (!currentUserId) {
      console.error("User ID tidak ditemukan.");
      return;
    }

    if (jumlahPenarikan <= 0 || jumlahPenarikan > totalRevenue) {
      console.error("Jumlah penarikan tidak valid.");
      setRequestStatus("Jumlah penarikan tidak valid.");
      return;
    }

    // Simpan permintaan penarikan ke Firestore
    const requestDocRef = doc(db, "withdrawRequests", currentUserId); // Menggunakan currentUserId sebagai ID dokumen
    try {
      await setDoc(requestDocRef, {
        nomorRekening,
        namaBank,
        namaPemilikRekening,
        jumlahPenarikan,
        status: "Pending", // Status awal permintaan penarikan
        userId: currentUserId,
        createdAt: new Date(), // Menyimpan timestamp permintaan
      });

      setRequestStatus("Permintaan penarikan berhasil diajukan.");
      // Reset form setelah berhasil
      setNomorRekening("");
      setNamaBank("");
      setNamaPemilikRekening("");
      setJumlahPenarikan("");
    } catch (error) {
      console.error("Error saat mengajukan permintaan penarikan:", error);
      setRequestStatus("Gagal mengajukan permintaan penarikan.");
    }

    setTimeout(() => setRequestStatus(""), 3000);
  };

  return (
    <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
      <HeaderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen pt-24">
        <h1 className="text-2xl font-semibold mb-6">
          Permintaan Penarikan Dana
        </h1>

        <div className="mb-4 p-4 bg-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold">Total Pendapatan</h2>
          <p className="text-2xl font-bold">
            Rp. {totalRevenue.toLocaleString() || "0"}
          </p>
        </div>

        {requestStatus && (
          <p className="text-green-500 mb-4">{requestStatus}</p>
        )}

        <form
          className="shadow-lg p-6 bg-white rounded-lg"
          onSubmit={handleRequestWithdraw}
        >
          <label className="block mb-2 font-medium" htmlFor="nomor-rekening">
            Nomor Rekening
          </label>
          <input
            type="text"
            id="nomor-rekening"
            value={nomorRekening}
            onChange={(e) => setNomorRekening(e.target.value)}
            required
            className="mb-4 w-full p-2 border rounded"
          />

          <label className="block mb-2 font-medium" htmlFor="nama-bank">
            Nama Bank
          </label>
          <input
            type="text"
            id="nama-bank"
            value={namaBank}
            onChange={(e) => setNamaBank(e.target.value)}
            required
            className="mb-4 w-full p-2 border rounded"
          />

          <label
            className="block mb-2 font-medium"
            htmlFor="nama-pemilik-rekening"
          >
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            id="nama-pemilik-rekening"
            value={namaPemilikRekening}
            onChange={(e) => setNamaPemilikRekening(e.target.value)}
            required
            className="mb-4 w-full p-2 border rounded"
          />

          <label className="block mb-2 font-medium" htmlFor="jumlah-penarikan">
            Jumlah Penarikan
          </label>
          <input
            type="number"
            id="jumlah-penarikan"
            value={jumlahPenarikan}
            onChange={(e) => setJumlahPenarikan(e.target.value)}
            required
            className="mb-4 w-full p-2 border rounded"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Ajukan Penarikan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WithdrawRequest;
>>>>>>> e8cbd468b9830bafad75ff1dbd9fd4fecbebc75e
