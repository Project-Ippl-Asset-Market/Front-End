import { useState, useRef, useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { FaChartLine, FaDollarSign, FaThumbsUp } from "react-icons/fa";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Revenue() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
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

      const unsubscribe = onSnapshot(
        collection(db, "transactions"),
        async (snapshot) => {
          const orderIds = new Set();
          let totalPrice = 0;
          const filteredAssets = [];

          snapshot.forEach((doc) => {
            const data = doc.data();

            if (data.status === "Success" && data.assets) {
              data.assets.forEach((asset) => {
                if (asset.assetOwnerID === user.uid) {
                  filteredAssets.push({
                    ...asset,
                    docId: doc.id,
                  });
                  if (asset.price) {
                    totalPrice += Number(asset.price);
                  }
                }
              });
              orderIds.add(data.orderId);
            }
          });

          setUserAssets(filteredAssets);
          setTransactionCount(orderIds.size);
          setTotalRevenue(totalPrice);

          const userDoc = await getDocs(collection(db, "users"));
          const userData = userDoc.docs.find(
            (doc) => doc.data().uid === user.uid
          );

          // Debugging
          console.log("User ID:", user.uid);
          console.log(
            "Users Data:",
            userDoc.docs.map((doc) => doc.data())
          );
          const username = userData
            ? userData.data().username
            : "Tidak Ditemukan";

          // Simpan total pendapatan ke koleksi revenue
          saveTotalRevenue(user.uid, username, totalPrice);
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

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

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
  }, []);

  const saveTotalRevenue = async (ownerId, username, total) => {
    try {
      await setDoc(doc(collection(db, "revenue"), ownerId), {
        username: username,
        totalPendapatan: total,
      });
      console.log(
        `Total pendapatan untuk ${username} berhasil disimpan: Rp. ${total}`
      );
    } catch (error) {
      console.error("Error saving total revenue:", error);
    }
  };

  const chartData = {
    labels: ["Aset Terjual", "Pendapatan"],
    datasets: [
      {
        label: "Perbandingan Aset Terjual dan Pendapatan",
        data: [userAssets.length, totalRevenue],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "#3F83F8",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah / Pendapatan",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

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
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
            <NavigationItem />
          </div>
        </aside>

        <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg p-6 flex items-center">
              <FaDollarSign className="text-4xl text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Pendapatan</h3>
                <p className="text-2xl font-bold">
                  Rp. {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg p-6 flex items-center text-neutral-10">
              <FaChartLine className="text-4xl text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-10">
                  Aset Terjual
                </h3>
                <p className="text-2xl font-bold text-neutral-10">
                  {userAssets.length}
                </p>
              </div>
            </div>
            <div className="dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 shadow-lg rounded-lg p-6 flex items-center">
              <FaThumbsUp className="text-4xl text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-10">
                  Jumlah Disukai
                </h3>
                <p className="text-2xl font-bold">+{totalLikes}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-neutral-10">
              Perbandingan Aset Terjual dan Pendapatan
            </h3>
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Revenue;
