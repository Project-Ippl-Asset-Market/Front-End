/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function SaleAssets() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const assetId = auth.currentUser;

    if (assetId) {
      setCurrentUserId(assetId.uid);

      // Mendengarkan perubahan data secara real-time menggunakan onSnapshot
      const unsubscribe = onSnapshot(
        collection(db, "transactions"),
        (snapshot) => {
          const orderIds = new Set();
          let totalPrice = 0;
          const assetsOwnedByUser = [];

          snapshot.forEach((doc) => {
            const data = doc.data();

            // Filter transaksi berdasarkan status "Success"
            if (data.status === "Success" && data.assets) {
              data.assets.forEach((asset) => {
                if (asset.assetOwnerID === assetId.uid) {
                  assetsOwnedByUser.push({
                    ...asset,
                    docId: doc.id, // Menambahkan docId ke data aset
                  });
                  if (asset.price) {
                    totalPrice += Number(asset.price);
                  }
                }
              });
              orderIds.add(data.orderId);
            }
          });

          setUserAssets(assetsOwnedByUser);
          setTransactionCount(orderIds.size);
          setTotalRevenue(totalPrice);
        }
      );

      return () => unsubscribe();
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div className="dark:bg-neutral-20 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
        <HeaderSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <aside
          ref={sidebarRef}
          id="sidebar-multi-level-sidebar"
          className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
            <NavigationItem />
          </div>
        </aside>

        <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Total Pendapatan</h3>
              <p className="text-2xl font-bold">
                Rp. {totalRevenue.toLocaleString()}
              </p>
              <span className="text-green-500">
                +21.6% dari 7 Hari yang lalu
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Aset Terjual</h3>
              <p className="text-2xl font-bold">{userAssets.length}</p>
              <span className="text-green-500">
                +21.6% dari 7 Hari yang lalu
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Jumlah Disukai</h3>
              <p className="text-2xl font-bold">+1240</p>
              <span className="text-green-500">
                +21.6% dari 7 Hari yang lalu
              </span>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold">Total Transaksi</h3>
            <p className="text-2xl font-bold">{transactionCount}</p>{" "}
            {/* Tampilkan jumlah transaksi yang berhasil */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleAssets;
