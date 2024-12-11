/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// Custom Tick Component for XAxis
const CustomXAxisTick = ({ x, y, stroke, payload }) => {
  return (
    <g>
      <text x={x} y={y} dy={14} textAnchor="middle" fill={stroke}>
        {payload.value}
      </text>
      <text x={x} y={y + 20} textAnchor="middle" fill="#333">
        {payload.title}
      </text>
    </g>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { createdAt, title, count, collectionName } = payload[0].payload;

    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <p className="text-gray-700">{`Date: ${new Date(
          createdAt
        ).toLocaleString()}`}</p>
        <p className="text-gray-700">{`Count: ${count}`}</p>
        <p className="text-gray-700">{`Collection: ${collectionName}`}</p>
      </div>
    );
  }
  return null;
};

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
  const [chartData, setChartData] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Memodifikasi fetchAssetCountsFromFirestore untuk menyesuaikan data grafik
  const fetchAssetCountsFromFirestore = async () => {
    try {
      const collections = [
        { name: "assetVideos", label: "Videos" },
        { name: "assetImages", label: "Images" },
        { name: "assetImage2D", label: "Images 2D" },
        { name: "assetImage3D", label: "Images 3D" },
        { name: "assetDatasets", label: "Datasets" },
        { name: "assetAudios", label: "Audios" },
      ];

      const counts = {};
      const assetData = [];

      for (const { name, label } of collections) {
        const querySnapshot = await getDocs(collection(db, name));
        counts[name] = querySnapshot.size; // Simpan jumlah data per koleksi

        // Menambahkan data untuk grafik
        assetData.push({
          collectionName: label,
          count: counts[name],
        });
      }

      setChartData(assetData); // Menyimpan data yang telah dimodifikasi
      setAssetCounts(counts);
    } catch (error) {
      console.error("Error fetching asset counts: ", error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const totalUsers = querySnapshot.size;
      setUserCount(totalUsers);
    } catch (error) {
      console.error("Error fetching user count: ", error);
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
    fetchUserCount();
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
      <FaGamepad className="text-4xl text-neutral-20 dark:text-primary-100 mb-2" />
    ),
    assetImage2D: (
      <FaImage className="text-4xl text-neutral-20 dark:text-primary-100 mb-2" />
    ),
    assetImage3D: (
      <FaImage className="text-4xl text-neutral-20 dark:text-primary-100 mb-2" />
    ),
    assetDatasets: (
      <FaDatabase className="text-4xl text-neutral-20 dark:text-primary-100 mb-2" />
    ),
    assetImages: (
      <FaImage className="text-4xl text-neutral-20 dark:text-primary-100 mb-2" />
    ),
    assetVideos: (
      <FaVideo className="text-4xl text-neutral-20 dark:text-primary-100 mb-2" />
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

  // Combine total asset and transaction data for Pie Chart
  const totalAssets = Object.values(assetCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  const pieChartData = [
    { name: "Total Assets", value: totalAssets },
    { name: "Total Transactions", value: transactionCount },
    { name: "Total Users", value: userCount },
  ];

  return (
    <div className="dark:bg-neutral-20 dark:text-primary-100 min-h-screen font-poppins bg-primary-100 p-4 -mx-4 -mt-2">
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

      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24 sm:ml-64 md:ml-72 lg:ml-60 xl:ml-[270px] 2xl:ml-[270px] mt-10 sm:mt-14 md:mt-14 lg:mt-10 xl:mt-10 2xl:mt-10">
        <div className="breadcrumbs text-sm mt-1 mb-10">
          <Breadcrumb />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {Object.keys(assetCounts).map((key) => (
            <div
              key={key}
              className="flex items-center justify-center h-24 sm:h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col items-center justify-center text-center h-full p-2">
                {assetIcons[key]}
                <p className="text-base sm:text-md md:text-lg text-neutral-20 dark:text-primary-100">
                  {assetLabels[key]}
                </p>
                <p className="text-[8px] sm:text-[10px] text-neutral-20 dark:text-primary-100">
                  {assetCounts[key]} Total {assetLabels[key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 mt-10 sm:mt-14 md:mt-14 lg:mt-14 xl:mt-14 2xl:mt-14 w-full grid grid-cols-1 sm:grid-cols-2 gap-20">
          {/* Grafik Total Asset and Transaction */}
          <div className="w-full" style={{ height: 400 }}>
            <h2 className="text-2xl mb-4 text-neutral-20 dark:text-primary-100">
              Total Asset and Transaction
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3F83F8" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grafik Asset */}
          <div className="w-full" style={{ height: 400 }}>
            <h2 className="text-2xl mb-4 text-neutral-20 dark:text-primary-100">
              Grafik Asset
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="collectionName" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#3F83F8" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
