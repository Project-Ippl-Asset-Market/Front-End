/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaChartLine, FaDollarSign, FaThumbsUp } from "react-icons/fa";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function SalesAsset() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [userAssets, setUserAssets] = useState([]);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Ambil data transaksi
        const unsubscribeFirestore = onSnapshot(
          collection(db, "buyAssets"),
          (snapshot) => {
            const filteredAssets = [];
            let totalPrice = 0;

            snapshot.forEach((doc) => {
              const data = doc.data();

              
                  if (data.assetOwnerID === user.uid) {
                    const createdAt =
                      data.createdAt?.toDate().toLocaleString("id-ID", {
                        date: "numeric",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || "N/A";
                    filteredAssets.push({
                      docId: doc.id,
                      image: data.image || data.datasetThumbnail || data.Image_umum || "https://via.placeholder.com/50",
                      name: data.name || "N/A",
                      category: data.category || "N/A",
                      price: data.price || 0,
                      createdAt,
                    });
                    totalPrice += Number(data.price || 0);
                  }
            });

            setUserAssets(filteredAssets);
            setTotalSales(totalPrice);
          }
        );

        // Clean up Firestore listener
        return () => unsubscribeFirestore();
      } else {
        console.log("User tidak login.");
      }
    });

    // Clean up Auth listener
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const assetCollections = [
          "assetAudios",
          "assetImage2D",
          "assetImage3D",
          "assetDatasets",
          "assetImages",
          "assetVideos",
        ];

        const fetchLikes = async () => {
          let likesCount = 0;

          for (const collectionName of assetCollections) {
            const querySnapshot = await getDocs(collection(db, collectionName));
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.userId === user.uid && data.likeAsset) {
                likesCount += Number(data.likeAsset);
              }
            });
          }

          setTotalLikes(likesCount);
        };

        fetchLikes();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
      <HeaderSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <aside
        ref={sidebarRef}
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 pt-10">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] pt-24">
        <div className="breadcrumbs text-sm mb-10">
          <Breadcrumb />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<FaDollarSign />} title="Total Penjualan" value={`Rp. ${totalSales.toLocaleString()}`} color="text-green-500" />
          <StatCard icon={<FaChartLine />} title="Aset Terjual" value={userAssets.length} color="text-blue-500" />
          <StatCard icon={<FaThumbsUp />} title="Jumlah Disukai" value={`+${totalLikes}`} color="text-yellow-500" />
        </div>

        <AssetTable assets={userAssets} />
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, color }) => (
  <div className="dark:bg-neutral-10 bg-neutral-100 shadow-lg rounded-lg p-6 flex items-center">
    <div className={`text-4xl ${color} mr-4`}>{icon}</div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AssetTable = ({ assets }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Daftar Aset</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {["Preview", "Nama Aset", "Kategori", "Harga", "Dibuat Pada"].map((header) => (
              <th key={header} className="px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.docId}>
              <td className="px-6 py-4 border-b">
                <img src={asset.image} alt="Preview" className="w-10 h-10 object-cover" />
              </td>
              <td className="px-6 py-4 border-b">{asset.name}</td>
              <td className="px-6 py-4 border-b">{asset.category}</td>
              <td className="px-6 py-4 border-b">Rp. {Number(asset.price).toLocaleString()}</td>
              <td className="px-6 py-4 border-b">{asset.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SalesAsset;