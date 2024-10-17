import { useState, useRef, useEffect } from "react";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function Revenue() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen bg-primary-100
">
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

        <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-90 p-6 rounded-lg dark:bg-neutral-25">
              <h3 className="text-neutral-10 dark:text-neutral-90 text-lg">Total Pendapatan</h3>
              <p className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90  ">Rp. 45,600,000</p>
              <span className="text-green-400">+21.6% dari 7 hari yang lalu</span>
            </div>

            <div className="bg-neutral-90 p-6 rounded-lg dark:bg-neutral-25">
              <h3 className="text-neutral-10 dark:text-neutral-90 text-lg">Asset Terjual</h3>
              <p className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90  ">67</p>
              <span className="text-green-400">+12.8% dari 7 hari yang lalu</span>
            </div>

            <div className="bg-neutral-90 p-6 rounded-lg dark:bg-neutral-25">
              <h3 className="text-neutral-10 dark:text-neutral-90 text-lg">Jumlah Diklik</h3>
              <p className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90  ">+1240</p>
              <span className="text-green-400">+8.5% dari 7 hari yang lalu</span>
            </div>
          </div>

          <div className="mt-8 bg-neutral-90 dark:bg-neutral-25 p-6 rounded-lg">
            <h3 className="text-neutral-10 dark:text-neutral-90 mb-4">Overview of Asset Sold</h3>
            <div className="h-64 bg-neutral-80 dark:bg-neutral-20 rounded-lg">
              <p className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90  ">Graph Placeholder</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-neutral-90 p-6 rounded-lg dark:bg-neutral-25">
              <h3 className="text-neutral-10 dark:text-neutral-90 text-lg">Top Selling Asset</h3>
              <img
                src="/path-to-your-image.jpg"
                alt="Top Selling Asset"
                className="w-full h-auto mt-4 rounded-lg"
              />
            </div>

            <div className="bg-neutral-90 p-6 rounded-lg dark:bg-neutral-25">
              <h3 className="text-neutral-10 dark:text-neutral-90 text-lg">Recent Transactions</h3>
              <p className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90   mt-4">No recent transactions available</p>
            </div>
          </div>

          <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg p-8 bg-neutral-90 dark:bg-neutral-25">
            <table className="w-full text-sm text-left text-gray-500 dark:text-neutral-90">
              <thead className="text-xs text-neutral-20 uppercase bg-neutral-80 dark:bg-neutral-25 dark:text-neutral-90">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name Asset
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-neutral-80 dark:bg-neutral-20 dark:text-neutral-90">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-neutral-90"
                  >
                    Font 2D
                  </th>
                  <td className="px-6 py-4">2D</td>
                  <td className="px-6 py-4">12/02/2024</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>
                <tr className="bg-neutral-80 dark:bg-neutral-20 dark:text-neutral-90">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-neutral-90"
                  >
                    Font 2D
                  </th>
                  <td className="px-6 py-4">2D</td>
                  <td className="px-6 py-4">12/02/2024</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button className="px-4 py-2 bg-secondary-40 hover:bg-secondary-50 border-secondary-50 opacity-70 text-white rounded-lg">
              «
            </button>
            <button className="px-4 py-2 bg-neutral-60 dark:bg-neutral-25 text-primary-100 hover:bg-neutral-70 rounded-lg">
              Page 1
            </button>
            <button className="px-4 py-2 bg-secondary-40 hover:bg-secondary-50 border-secondary-50 opacity-70 text-white rounded-lg">
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Revenue;
