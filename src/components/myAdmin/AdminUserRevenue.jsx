import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";

function AdminUserRevenue() {
  const db = getFirestore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [revenues, setRevenues] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const [showPPNModal, setShowPPNModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // ID pengguna yang dipilih
  const [totalPendapatanUser, setTotalPendapatanUser] = useState(0); // Total pendapatan pengguna
  const [ppnAmount, setPpnAmount] = useState(0); // Jumlah PPN yang akan dipotong
  const [finalTotal, setFinalTotal] = useState(0); // Total final setelah potongan

  const toggleDropdown = async (userId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));

    // Ambil detail rekening jika dropdown dibuka
    if (!dropdownOpen[userId]) {
      const accountData = await fetchAccountDetails(userId);
      setAccountDetails((prev) => ({
        ...prev,
        [userId]: accountData || {},
      }));
    }
  };

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const revenueSnapshot = await getDocs(collection(db, "revenue"));
        const revenueData = revenueSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRevenues(revenueData);

        const total = revenueData.reduce((sum, revenue) => {
          return sum + (revenue.totalPendapatan || 0);
        }, 0);
        setTotalRevenue(total);
      } catch (error) {
        setError("Error fetching revenue data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenues();
  }, [db]);

  const fetchAccountDetails = async (userId) => {
    const accountDocRef = doc(db, "aturBayaran", userId);
    const accountDoc = await getDoc(accountDocRef);
    if (accountDoc.exists()) {
      return accountDoc.data(); // Mengembalikan data rekening
    } else {
      console.log("Tidak ada data rekening untuk userId:", userId);
      return null;
    }
  };

  const handleWithdraw = async (userId) => {
    try {
      const accountDocRef = doc(db, "revenue", userId);
      const accountDoc = await getDoc(accountDocRef);

      if (accountDoc.exists()) {
        const currentData = accountDoc.data();
        const newTotal = currentData.totalPendapatan - amount; // Mengurangi total

        await updateDoc(accountDocRef, {
          totalPendapatan: newTotal,
        });

        setRevenues((prev) =>
          prev.map((revenue) =>
            revenue.id === userId
              ? { ...revenue, totalPendapatan: newTotal }
              : revenue
          )
        );

        console.log("Withdrawal successful: new total is", newTotal);
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    }
  };

  const handlePPNClick = (userId, totalPendapatan) => {
    setSelectedUserId(userId);
    setTotalPendapatanUser(totalPendapatan); // Set total pendapatan untuk pengguna yang dipilih
    const ppn = totalPendapatan * 0.1; // Menghitung PPN 10%
    setPpnAmount(ppn); // Simpan total PPN
    setFinalTotal(totalPendapatan - ppn); // Hitung total final
    setShowPPNModal(true); // Tampilkan modal
  };

  const confirmPPN = async () => {
    if (!selectedUserId) return;

    const accountDocRef = doc(db, "revenue", selectedUserId);
    const accountDoc = await getDoc(accountDocRef);

    if (accountDoc.exists()) {
      const currentData = accountDoc.data();
      const newTotal = currentData.totalPendapatan - ppnAmount; // Mengurangi PPN
      await updateDoc(accountDocRef, {
        totalPendapatan: newTotal,
      });

      // Update state setelah pemotongan PPN
      setRevenues((prev) =>
        prev.map((revenue) =>
          revenue.id === selectedUserId
            ? { ...revenue, totalPendapatan: newTotal }
            : revenue
        )
      );

      console.log("PPN applied successfully: new total is", newTotal);
      setShowPPNModal(false); // Tutup modal
    }
  };

  return (
    <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
      <HeaderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={setIsSidebarOpen}
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

      <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen pt-24">
        <h1 className="text-2xl font-semibold mb-6">
          Daftar Pengguna dan Pendapatan
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-60 w-60 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Total Pendapatan: Rp. {totalRevenue.toLocaleString()}
            </h2>
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Username</th>
                  <th className="py-3 px-6 text-left">Total Pendapatan</th>
                  <th className="py-3 px-6 text-left">Aksi</th>
                  <th className="py-3 px-6 text-left">PPN</th>{" "}
                  {/* Tambahkan kolom PPN */}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {revenues.length > 0 ? (
                  revenues.map((revenue) => (
                    <tr
                      key={revenue.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6">{revenue.username}</td>
                      <td className="py-3 px-6">
                        Rp. {revenue.totalPendapatan.toLocaleString()}
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleWithdraw(revenue.id, 50000)}
                          className={`bg-blue-500 text-white px-4 py-1 rounded ${
                            revenue.totalPendapatan < 50000
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={revenue.totalPendapatan < 50000}
                        >
                          Riset
                        </button>
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() =>
                            handlePPNClick(revenue.id, revenue.totalPendapatan)
                          } // Tampilkan modal PPN
                          className="bg-yellow-500 text-white px-4 py-1 rounded"
                        >
                          PPN
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-3 px-6 text-center">
                      Tidak ada data pendapatan yang tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Modal PPN */}
        {showPPNModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Konfirmasi PPN</h2>
              <p>
                Total Pendapatan: Rp. {totalPendapatanUser.toLocaleString()}
              </p>
              <p>PPN (10%): Rp. {ppnAmount.toLocaleString()}</p>
              <p>Total Setelah PPN: Rp. {finalTotal.toLocaleString()}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={confirmPPN} // Konfirmasi penerapan PPN
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Ya, lakukan pemotongan
                </button>
                <button
                  onClick={() => setShowPPNModal(false)} // Tutup modal
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUserRevenue;
