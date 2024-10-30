import { useState, useRef, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

const AssetRow = ({ asset }) => {
  const { previewImageURL, name, category, price, createdAt, docId } = asset;

  return (
    <tr key={docId}>
      <td className="py-2 px-4 border text-center">
        <img src={previewImageURL} alt="Preview" className="w-12 h-12 object-cover rounded" />
      </td>
      <td className="py-2 px-4 border">{name}</td>
      <td className="py-2 px-4 border">{category}</td>
      <td className="py-2 px-4 border">Rp. {price}</td>
      <td className="py-2 px-4 border">{createdAt}</td>
    </tr>
  );
};

function SaleAssets() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
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

      const unsubscribeAssets = onSnapshot(
        collection(db, "transactions"),
        (snapshot) => {
          const assetsOwnedByUser = [];
          let totalPrice = 0;
          const counts = {};

          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.status === "Success" && data.assets) {
              data.assets.forEach((asset) => {
                if (asset.assetOwnerID === user.uid) {
                  assetsOwnedByUser.push({
                    ...asset,
                    docId: doc.id,
                    previewImageURL: asset.previewImageURL || "/default-preview.png",
                    name: asset.name,
                    category: asset.category,
                    price: asset.price ? Number(asset.price).toLocaleString() : "N/A",
                    createdAt: asset.createdAt ? new Date(asset.createdAt.toDate()).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "N/A",
                  });
                  if (asset.price) {
                    totalPrice += Number(asset.price);
                  }

                  // Menghitung jumlah per kategori
                  if (counts[asset.category]) {
                    counts[asset.category] += 1;
                  } else {
                    counts[asset.category] = 1;
                  }
                }
              });
            }
          });

          setUserAssets(assetsOwnedByUser);
          setTotalRevenue(totalPrice);
          setCategoryCounts(counts);
        }
      );

      return () => {
        unsubscribeAssets();
      };
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
          className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
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
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Aset Terjual</h3>
              <p className="text-2xl font-bold">{userAssets.length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Jumlah Disukai</h3>
              <p className="text-2xl font-bold">+0</p>
            </div>
          </div>

          {/* Tabel untuk menampilkan aset yang dimiliki */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold">Daftar Aset yang Dimiliki</h3>
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border font-bold">PREVIEW</th>
                  <th className="py-2 px-4 border font-bold">IMAGE NAME</th>
                  <th className="py-2 px-4 border font-bold">CATEGORY</th>
                  <th className="py-2 px-4 border font-bold">HARGA</th>
                  <th className="py-2 px-4 border font-bold">CREATED AT</th>
                </tr>
              </thead>
              <tbody>
                {userAssets.length > 0 ? (
                  userAssets.map(asset => <AssetRow key={asset.docId} asset={asset} />)
                ) : (
                  <tr>
                    <td colSpan="5" className="py-2 px-4 border text-center">Belum ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleAssets;
