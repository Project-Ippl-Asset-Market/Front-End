import { useState, useRef, useEffect } from "react";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import Chart from "../chartDashboad/chart";
import HeaderSideBar from "../headerNavBreadcrumbs/HeaderSidebar";
import { FaRegHeart, FaBoxOpen } from "react-icons/fa";

function AdminDashboard() {
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

        <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10  dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center justify-center h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10">
              <div className="text-center">
                <FaBoxOpen className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
                <p className="text-2xl text-neutral-20 dark:text-neutral-90">
                  
                </p>
                <p className="text-lg text-neutral-20 dark:text-neutral-90">
                  Assets
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10">
              <div className="text-center">
                <FaRegHeart className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
                <p className="text-2xl text-neutral-20 dark:text-neutral-90">
               
                </p>
                <p className="text-lg text-neutral-20 dark:text-neutral-90">
                  Likes
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10">
              <div className="text-center">
                <FaBoxOpen className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
                <p className="text-2xl text-neutral-20 dark:text-neutral-90">
                  Icon 3
                </p>
                <p className="text-lg text-neutral-20 dark:text-neutral-90">
                  Description
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-32 rounded bg-primary-100 dark:bg-neutral-25 shadow-md dark:shadow-neutral-10">
              <div className="text-center">
                <FaBoxOpen className="text-4xl text-neutral-20 dark:text-neutral-90 mb-2" />
                <p className="text-2xl text-neutral-20 dark:text-neutral-90">
                  Icon 4
                </p>
                <p className="text-lg text-neutral-20 dark:text-neutral-90">
                  Description
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
