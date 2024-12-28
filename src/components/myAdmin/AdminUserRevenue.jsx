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
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

function AdminUserRevenue() {
  const db = getFirestore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [revenues, setRevenues] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const toggleDropdown = async (userId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));

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

        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = {};
        usersSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          usersData[data.uid] = data.username;
        });

        const enrichedRevenueData = revenueData.map((revenue) => ({
          ...revenue,
          username: usersData[revenue.id] || "Tidak Diketahui",
        }));

        setRevenues(enrichedRevenueData);

        const total = enrichedRevenueData.reduce((sum, revenue) => {
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
      return accountDoc.data();
    } else {
      console.log("Tidak ada data rekening untuk userId:", userId);
      return null;
    }
  };

  const handleWithdraw = async (userId) => {
    const revenueData = revenues.find((revenue) => revenue.id === userId);
    if (!revenueData) {
      console.error("Data pendapatan tidak ditemukan untuk pengguna ini.");
      return;
    }

    const amountToWithdraw = revenueData.totalPendapatan;

    if (amountToWithdraw < 50000) {
      console.error("Jumlah penarikan tidak mencukupi.");
      return;
    }

    try {
      const revenueDocRef = doc(db, "revenue", userId);
      const currentData = await getDoc(revenueDocRef);

      if (currentData.exists()) {
        const newTotal = currentData.data().totalPendapatan - amountToWithdraw;

        // Update totalPendapatan setelah penarikan
        await updateDoc(revenueDocRef, {
          totalPendapatan: newTotal,
        });

        // Perbarui data yang ditampilkan
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
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {revenues.length > 0 ? (
                  revenues.map((revenue) => (
                    <React.Fragment key={revenue.id}>
                      <tr className="border-b border-gray-200 hover:bg-gray-100">
                        <td
                          className="py-3 px-6"
                          onClick={() => toggleDropdown(revenue.id)}
                        >
                          {revenue.username}{" "}
                          {dropdownOpen[revenue.id] ? "▲" : "▼"}
                        </td>
                        <td className="py-3 px-6">
                          Rp. {revenue.totalPendapatan.toLocaleString()}
                        </td>
                        <td className="py-3 px-6">
                          <button
                            onClick={() => handleWithdraw(revenue.id)}
                            className={`bg-blue-500 text-white px-4 py-1 rounded ${
                              revenue.totalPendapatan < 50000
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={revenue.totalPendapatan < 50000}
                          >
                            Cairkan Dana
                          </button>
                        </td>
                      </tr>
                      {dropdownOpen[revenue.id] &&
                        accountDetails[revenue.id] && (
                          <tr>
                            <td colSpan="3">
                              <div className="bg-gray-100 p-4 rounded">
                                <h3 className="font-semibold">
                                  Detail Rekening:
                                </h3>
                                <p>
                                  Nama Bank:{" "}
                                  {accountDetails[revenue.id].namaBank}
                                </p>
                                <p>
                                  Nama Pemilik Rekening:{" "}
                                  {
                                    accountDetails[revenue.id]
                                      .namaPemilikRekening
                                  }
                                </p>
                                <p>
                                  Nomor Rekening:{" "}
                                  {accountDetails[revenue.id].nomorRekening}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-3 px-6 text-center">
                      Tidak ada data pendapatan yang tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminUserRevenue;
