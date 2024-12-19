import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, getFirestore } from "firebase/firestore";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";

function AdminTotalRevenue() {
  const db = getFirestore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [revenues, setRevenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        // Ambil total pendapatan dari koleksi revenue
        const revenueSnapshot = await getDocs(collection(db, "revenue"));
        const revenueData = revenueSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRevenues(revenueData);
      } catch (error) {
        setError("Error fetching revenue data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenues();
  }, [db]);

  const handleWithdraw = async (username) => {
    try {
      const revenueDocRef = doc(db, "revenue", username);
      await updateDoc(revenueDocRef, {
        totalPendapatan: 0, // Set total pendapatan menjadi 0
      });

      // Perbarui state untuk mencerminkan perubahan
      setRevenues((prev) =>
        prev.map((revenue) =>
          revenue.username === username ? { ...revenue, totalPendapatan: 0 } : revenue
        )
      );
    } catch (error) {
      console.error("Error processing withdrawal:", error);
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
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen pt-24">
        <h1 className="text-2xl font-semibold mb-6">Total Pendapatan Semua Pengguna</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-60 w-60 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
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
                  <tr key={revenue.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{revenue.username}</td>
                    <td className="py-3 px-6">
                      Rp. {revenue.totalPendapatan ? revenue.totalPendapatan.toLocaleString() : "0"}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleWithdraw(revenue.username)}
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Cairkan Dana
                      </button>
                    </td>
                  </tr>
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
        )}
      </div>
    </div>
  );
}

export default AdminTotalRevenue;
