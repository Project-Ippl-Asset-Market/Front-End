import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function WithdrawRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountOwnerName, setAccountOwnerName] = useState(""); // State for account owner name
  const [withdrawalStatus, setWithdrawalStatus] = useState("");
  const [file, setFile] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        console.log("Authenticated User ID:", user.uid);

        // Menggunakan onSnapshot untuk mendapatkan totalRevenue secara real-time
        const unsubscribeTransactions = onSnapshot(
          collection(db, "transactions"),
          (snapshot) => {
            let total = 0;

            snapshot.forEach((doc) => {
              const data = doc.data();
              console.log("Transaction Data:", data); // Log Data Transaksi
              console.log("grossAmount:", data.grossAmount); // Log grossAmount untuk memastikan ini ada
              // Cek apakah grossAmount, assetOwnerID dan status sesuai
              if (
                typeof data.grossAmount === "number" &&
                // data.assetOwnerID === user.uid &&
                data.status.toLowerCase() === "success"
              ) {
                total += data.grossAmount; // Hitung total pendapatan
              }
            });
            console.log("Total Revenue:", total); // Log total yang dihitung
            setTotalRevenue(total); // Update totalRevenue
          }
        );

        return () => {
          unsubscribeTransactions();
        };
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!amount || !accountNumber || !bankName || !accountOwnerName) {
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
          `withdrawRequests/${currentUserId}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      // Simpan permintaan pencairan ke Firestore
      await setDoc(doc(db, "withdrawRequests", currentUserId), {
        amount,
        accountNumber,
        bankName,
        accountOwnerName, // Simpan nama pemilik rekening juga
        userId: currentUserId, // Menyimpan ID pengguna
        status: "Pending",
        timestamp: new Date(),
        fileUrl,
      });

      setWithdrawalStatus("Pengajuan pencairan dana berhasil diajukan.");
      setAmount("");
      setAccountNumber(""); // Reset nomor rekening
      setBankName(""); // Reset nama bank
      setAccountOwnerName(""); // Reset nama pemilik rekening
      setFile(null);
    } catch (error) {
      console.error("Error saat mengajukan pencairan dana:", error);
      setWithdrawalStatus("Gagal mengajukan pencairan dana.");
    }
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
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 mt-20">
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
          />

          {/* Tambahkan Input untuk Nama Pemilik Rekening */}
          <label
            className="block mb-2 font-medium"
            htmlFor="account-owner-name"
          >
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            id="account-owner-name"
            value={accountOwnerName}
            onChange={(e) => setAccountOwnerName(e.target.value)}
            required
            className="mb-4 w-full p-2 border rounded"
            placeholder="Nama pemilik rekening"
          />

          <label className="block mb-2 font-medium" htmlFor="file-upload">
            Upload Bukti Pendapatan (Screenshot)
          </label>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 w-full text-gray-600 border rounded p-2"
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
  );
}

export default WithdrawRequest;
