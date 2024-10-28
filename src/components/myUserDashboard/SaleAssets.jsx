import { useState, useRef, useEffect } from "react";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function SaleAssets() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State tambahan untuk menyimpan ringkasan dan perbandingan persentase
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalAssetsSold: 0,
    totalLikes: 0,
    revenueChange: 0,
    assetsSoldChange: 0,
    likesChange: 0,
    comparisonPeriod: 7 // Default perbandingan ke 7 hari yang lalu
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
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
    const fetchSalesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sales-data"); // URL API data sales
        const data = await response.json();
        setSalesData(data);

        // Hitung ringkasan
        const totalRevenue = data.reduce((sum, item) => sum + item.gross, 0);
        const totalAssetsSold = data.reduce((sum, item) => sum + item.qty, 0);
        const totalLikes = data.reduce((sum, item) => sum + item.likes, 0); // pastikan API mengirim data 'likes'

        // Hitung perubahan persentase dibandingkan periode sebelumnya
        const previousRevenue = 500000; // Contoh nilai periode sebelumnya
        const previousAssetsSold = 50; // Contoh nilai periode sebelumnya
        const previousLikes = 100; // Contoh nilai periode sebelumnya

        const revenueChange = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
        const assetsSoldChange = ((totalAssetsSold - previousAssetsSold) / previousAssetsSold) * 100;
        const likesChange = ((totalLikes - previousLikes) / previousLikes) * 100;

        // Set ringkasan ke state
        setSummary({
          totalRevenue,
          totalAssetsSold,
          totalLikes,
          revenueChange,
          assetsSoldChange,
          likesChange,
          comparisonPeriod: 7 // Misalkan 7 hari sebagai default
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

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
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
            <NavigationItem />
          </div>
        </aside>

        {/* Isi Konten */}
        <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
          {/* Breadcrumb */}
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          {/* Section: Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Total Pendapatan</h3>
              <p className="text-2xl font-bold">Rp. {summary.totalRevenue.toLocaleString("id-ID")}</p>
              <span className={`text-${summary.revenueChange >= 0 ? 'green' : 'red'}-500`}>
                {summary.revenueChange >= 0 ? '+' : ''}{summary.revenueChange.toFixed(1)}% dari {summary.comparisonPeriod} Hari yang lalu
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Asset Terjual</h3>
              <p className="text-2xl font-bold">{summary.totalAssetsSold}</p>
              <span className={`text-${summary.assetsSoldChange >= 0 ? 'green' : 'red'}-500`}>
                {summary.assetsSoldChange >= 0 ? '+' : ''}{summary.assetsSoldChange.toFixed(1)}% dari {summary.comparisonPeriod} Hari yang lalu
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Jumlah Disukai</h3>
              <p className="text-2xl font-bold">+{summary.totalLikes}</p>
              <span className={`text-${summary.likesChange >= 0 ? 'green' : 'red'}-500`}>
                {summary.likesChange >= 0 ? '+' : ''}{summary.likesChange.toFixed(1)}% dari {summary.comparisonPeriod} Hari yang lalu
              </span>
            </div>
          </div>

          {/* Section: Table */}
          <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg p-8 dark:bg-neutral-25">
            <div className="flex justify-between items-center pb-4">
              <input
                type="text"
                placeholder="Search packages"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
              <button className="text-blue-600 hover:underline">Columns</button>
            </div>

            <table className="w-full text-sm text-left text-gray-500 bg-white dark:bg-neutral-25 dark:text-neutral-90">
              <thead className="text-xs text-neutral-500 uppercase bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 border-b dark:border-neutral-20">
                <tr>
                  <th scope="col" className="px-6 py-3">Package Name</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Qty</th>
                  <th scope="col" className="px-6 py-3">Refunds</th>
                  <th scope="col" className="px-6 py-3">Chargebacks</th>
                  <th scope="col" className="px-6 py-3">Gross</th> 
                  <th scope="col" className="px-6 py-3">First</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : salesData.length > 0 ? (
                  salesData.map((item, index) => (
                    <tr key={index} className="bg-white dark:bg-neutral-25 dark:text-neutral-90">
                      <td className="px-6 py-4">{item.package_name}</td>
                      <td className="px-6 py-4">Rp {item.price.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4">{item.qty}</td>
                      <td className="px-6 py-4">{item.refunds}</td>
                      <td className="px-6 py-4">{item.chargebacks}</td>
                      <td className="px-6 py-4">Rp {item.gross.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4">{item.first}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      No sales data available.
                    </td>
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
