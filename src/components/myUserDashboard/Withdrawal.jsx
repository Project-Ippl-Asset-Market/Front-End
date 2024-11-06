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
