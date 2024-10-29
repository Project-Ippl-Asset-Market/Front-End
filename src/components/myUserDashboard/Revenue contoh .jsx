/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Adjust path as necessary
import { getAuth } from "firebase/auth";
import { FaChartLine, FaDollarSign, FaThumbsUp } from "react-icons/fa";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function Revenue() {
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
    const user = auth.currentUser;

    if (user) {
      setCurrentUserId(user.uid);

      // Subscribe to Firestore collection for real-time updates
      const unsubscribe = onSnapshot(
        collection(db, "transactions"),
        (snapshot) => {
          const orderIds = new Set();
          let totalPrice = 0;
          const filteredAssets = [];

          snapshot.forEach((doc) => {
            const data = doc.data();

            // Filter transactions with status "Success" and matching assetOwnerID
            if (data.status === "Success" && data.assets) {
              data.assets.forEach((asset) => {
                if (asset.assetOwnerID === user.uid) {
                  filteredAssets.push({
                    ...asset,
                    docId: doc.id, // Include docId for reference
                  });
                  if (asset.price) {
                    totalPrice += Number(asset.price); // Sum up asset prices
                  }
                }
              });
              orderIds.add(data.orderId);
            }
          });

          setUserAssets(filteredAssets); // Update state with filtered assets
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
      <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
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

        <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg p-6 flex items-center">
              <FaDollarSign className="text-4xl text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Pendapatan</h3>
                <p className="text-2xl font-bold">
                  Rp. {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg p-6 flex items-center">
              <FaChartLine className="text-4xl text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Aset Terjual</h3>
                <p className="text-2xl font-bold">{userAssets.length}</p>
              </div>
            </div>
            <div className="dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg p-6 flex items-center">
              <FaThumbsUp className="text-4xl text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Jumlah Disukai</h3>
                <p className="text-2xl font-bold">+1240</p>
              </div>
            </div>
          </div>

          {/* Tampilkan data aset milik pengguna yang sedang login */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              Daftar Aset Milik Pengguna
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {userAssets.map((asset) => (
                <div
                  key={asset.docId}
                  className="p-4 dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg">
                  <h3 className="text-lg font-semibold">{asset.name}</h3>
                  <p>Kategori: {asset.category}</p>
                  <p>Harga: Rp. {Number(asset.price).toLocaleString()}</p>
                  <p>Deskripsi: {asset.description}</p>
                  <p>ID Aset: {asset.docId}</p>
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-auto rounded mt-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Revenue;
