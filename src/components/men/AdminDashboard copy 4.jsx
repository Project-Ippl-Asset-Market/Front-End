import { useState, useRef, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import Chart from "../chartDashboad/chart";
import HeaderSideBar from "../headerNavBreadcrumbs/HeaderSidebar";
import { FaVideo, FaImage, FaDatabase, FaGamepad } from "react-icons/fa";

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assetCounts, setAssetCounts] = useState({
    assetAudios: 0,
    assetImage2D: 0,
    assetImage3D: 0,
    assetDatasets: 0,
    assetImages: 0,
    assetVideos: 0,
  });

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
        counts[key] = querySnapshot.size; // Count total documents
      }

      setAssetCounts(counts);
    } catch (error) {
      console.error("Error fetching asset counts: ", error);
    }
  };

  useEffect(() => {
    fetchAssetCountsFromFirestore();

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

  // Calculate total asset count
  const totalAssets = Object.values(assetCounts).reduce(
    (acc, count) => acc + count,
    0
  );

  return (
    <>
      <div className="dark:bg-neutral-90 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
        <HeaderSideBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <aside
          ref={sidebarRef}
          id="sidebar-multi-level-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 md:w-72 lg:w-80 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar">
          <div className="h-full px-2 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
            <NavigationItem />
          </div>
        </aside>

        <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24 sm:ml-64 md:ml-72 lg:ml-80">
          <div className="breadcrumbs text-sm md:text-base mb-4 mt-16">
            <Breadcrumb />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {[
              "assetAudios",
              "assetImage2D",
              "assetImage3D",
              "assetDatasets",
              "assetImages",
              "assetVideos",
            ].map((key) => (
              <div
                key={key}
                className="flex items-center justify-center h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10">
                <div className="flex flex-col items-center justify-center text-center h-full">
                  {assetIcons[key]}
                  <p className="text-lg sm:text-xl md:text-2xl text-neutral-20 dark:text-neutral-90">
                    {assetLabels[key]}
                  </p>
                  <p className="text-sm sm:text-base text-neutral-20 dark:text-neutral-90">
                    {assetCounts[key]} Total {assetLabels[key]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Display Total Asset Count */}
          <div className="flex items-center justify-center h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-20 dark:text-neutral-90">
                Total
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-20 dark:text-neutral-90">
                {totalAssets} Total Assets
              </p>
            </div>
          </div>

          <div className="mt-10 md:mt-14 min-h-screen">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
