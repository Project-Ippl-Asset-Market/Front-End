import { useState, useRef, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSideBar from "../headerNavBreadcrumbs/HeaderSidebar";
import { FaVideo, FaImage, FaDatabase, FaGamepad } from "react-icons/fa";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function AdminDashboard() {
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assetCounts, setAssetCounts] = useState({
    assetAudios: 0,
    assetImage2D: 0,
    assetImage3D: 0,
    assetDatasets: 0,
    assetImages: 0,
    assetVideos: 0,
  });
  const [transactionCount, setTransactionCount] = useState(0);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  const fetchAssetCountsFromFirestore = async () => {
    try {
      const collections = [
        { name: "assetVideos", key: "assetVideos" },
        { name: "assetImages", key: "assetImages" },
        { name: "assetImage2D", key: "assetImage2D" },
        { name: "assetImage3D", key: "assetImage3D" },
        { name: "assetDatasets", key: "assetDatasets" },
        { name: "assetAudios", key: "assetAudios" },
      ];

      const counts = {};

      for (const { name, key } of collections) {
        const querySnapshot = await getDocs(collection(db, name));
        counts[key] = querySnapshot.size;

        // Get the createdAt date for the last created asset
        const lastCreatedAt = querySnapshot.docs
          .map((doc) => doc.data().createdAt?.toDate()) // Convert Firestore Timestamp to Date
          .sort((a, b) => (b ? b - a : 0))[0]; // Get the most recent date

        // Format the createdAt date
        if (lastCreatedAt) {
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          };
          counts[`${key}CreatedAt`] = lastCreatedAt.toLocaleString(
            "en-US",
            options
          );
        } else {
          counts[`${key}CreatedAt`] = ""; // Remove this to avoid "N/A"
        }
      }

      setAssetCounts(counts);
    } catch (error) {
      console.error("Error fetching asset counts: ", error);
    }
  };

  const fetchTransactionCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const orderIds = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.orderId) {
          orderIds.add(data.orderId);
        }
      });

      setTransactionCount(orderIds.size);
    } catch (error) {
      console.error("Error fetching transaction counts: ", error);
    }
  };

  useEffect(() => {
    fetchAssetCountsFromFirestore();
    fetchTransactionCount();

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const assetIcons = {
    assetAudios: (
      <FaGamepad className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
    ),
    assetImage2D: (
      <FaImage className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
    ),
    assetImage3D: (
      <FaImage className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
    ),
    assetDatasets: (
      <FaDatabase className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
    ),
    assetImages: (
      <FaImage className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
    ),
    assetVideos: (
      <FaVideo className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
    ),
  };

  const assetLabels = {
    assetAudios: "Audios",
    assetImage2D: "Images 2D",
    assetImage3D: "Images 3D",
    assetDatasets: "Datasets",
    assetImages: "Images",
    assetVideos: "Videos",
  };

  // Prepare chart data for asset counts
  const chartData = Object.entries(assetCounts).map(([key, count]) => ({
    name: assetLabels[key],
    count: count,
  }));

  // Combine total asset and transaction data for Pie Chart
  const totalAssets = Object.values(assetCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  const pieChartData = [
    { name: "Total Assets", value: totalAssets },
    { name: "Total Transactions", value: transactionCount },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="dark:bg-neutral-90 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <HeaderSideBar
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

      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24 sm:ml-64 md:ml-72 lg:ml-80">
        <div className="breadcrumbs text-sm md:text-base mb-4 mt-12 justify-start -ml-14">
          <Breadcrumb />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {Object.keys(assetCounts).map((key) => (
            <div
              key={key}
              className="flex items-center justify-center h-24 sm:h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col items-center justify-center text-center h-full p-2">
                {assetIcons[key]}
                <p className="text-base sm:text-lg md:text-xl text-neutral-20 dark:text-neutral-90">
                  {assetLabels[key]}
                </p>
                <p className="text-xs sm:text-sm text-neutral-20 dark:text-neutral-90">
                  {assetCounts[key]} Total
                </p>
                {/* Display Created At Date */}
                {assetCounts[`${key}CreatedAt`] && (
                  <p className="text-xs text-neutral-20 dark:text-neutral-90">
                    Created At: {assetCounts[`${key}CreatedAt`]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart for Total Asset Count */}
        <div className="mt-10 md:mt-14 w-full">
          <h2 className="text-2xl mb-4">Total Asset Counts</h2>
          <div className="w-full" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Total Asset and Transaction Counts */}
        <div className="mt-10 md:mt-14 w-full">
          <h2 className="text-2xl mb-4">Total Asset and Transaction Counts</h2>
          <div className="w-full" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  label>
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;