import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.svg";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconHapus from "../../assets/icon/iconCRUD/iconHapus.png";
import IconEdit from "../../assets/icon/iconCRUD/iconEdit.png";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function ManageUsers() {
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

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const items = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          console.log('Data fetched:', data);

          const creatAt = data.uploadedAt?.toDate().toLocaleDateString("id-ID", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) || 'N/A';

          // Susun data ke dalam format assets
          items.push({
            id: doc.id, // Simpan ID dokumen untuk keperluan penghapusan
            username: data.username,
            description: data.description,
            price: `Rp. ${data.price}`,
            image: data.uploadUrlDataset,
            category: data.category,
            creatAt,
          });
        }
       
        setAssets(items);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
  }, []);

  return (
    <>
      <div className=" dark:bg-neutral-90 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
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

        {/* Isi Konten */}
        <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10  dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search Box */}
            <div className="form-control w-full">
              <div className="relative h-[48px] bg-primary-100 dark:bg-neutral-20 rounded-lg border border-neutral-90 dark:border-neutral-25 dark:border-2">
                <img
                  src={IconSearch}
                  alt="iconSearch"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className=" input border-none bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 pl-10 h-[40px] w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8 dark:bg-neutral-25 mt-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-primary-100 dark:text-neutral-90 ">
              <thead className="text-xs text-neutral-20 uppercase  dark:bg-neutral-25 dark:text-neutral-90 border-b dark:border-neutral-20">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    UserName
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Roles
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Create at
                  </th>
                  <th scope="col" className="justify-center mx-auto">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className=" bg-primary-100 dark:bg-neutral-25 dark:text-neutral-9">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-90 secondary-40space-nowrap">
                    ardhy
                  </th>
                  <td className="px-6 py-4">SuperAdmin</td>
                  <td className="px-6 py-4">11211016@student.itk.ac.id</td>
                  <td className="px-6 py-4">23-02-3024</td>
                  <td className="mx-auto flex gap-4 mt-2">
                    <Link to="/manageAdmin/edit">
                      <img src={IconEdit} alt="icon edit" className="w-5 h-5" />
                    </Link>

                    <img
                      src={IconHapus}
                      alt="icon hapus "
                      className="w-5 h-5"
                    />
                  </td>
                </tr>
                <tr className=" bg-primary-100 dark:bg-neutral-25 dark:text-neutral-9">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-90 secondary-40space-nowrap">
                    ardhy
                  </th>
                  <td className="px-6 py-4">Admin</td>
                  <td className="px-6 py-4">11211016@student.itk.ac.id</td>
                  <td className="px-6 py-4">23-02-3024</td>
                  <td className="mx-auto flex gap-4 mt-2">
                    <img src={IconEdit} alt="icon edit" className="w-5 h-5" />
                    <img
                      src={IconHapus}
                      alt="icon hapus "
                      className="w-5 h-5"
                    />
                  </td>
                </tr>
                <tr className=" bg-primary-100 dark:bg-neutral-25 dark:text-neutral-9">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-90 secondary-40space-nowrap">
                    ardhy
                  </th>
                  <td className="px-6 py-4">SuperAdmin</td>
                  <td className="px-6 py-4">11211016@student.itk.ac.id</td>
                  <td className="px-6 py-4">23-02-2024</td>
                  <td className="mx-auto flex gap-4 mt-2">
                    <img src={IconEdit} alt="icon edit" className="w-5 h-5" />
                    <img
                      src={IconHapus}
                      alt="icon hapus "
                      className="w-5 h-5"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex join pt-72 justify-end ">
            <button className="join-item btn bg-secondary-40 hover:bg-secondary-50 border-secondary-50  hover:border-neutral-40 opacity-70">
              «
            </button>
            <button className="join-item btn dark:bg-neutral-30 bg-neutral-60  text-primary-100 hover:bg-neutral-70 hover:border-neutral-30 border-neutral-60 dark:border-neutral-30">
              Page 1
            </button>
            <button className="join-item btn bg-secondary-40 hover:bg-secondary-50 border-secondary-50 hover:border-neutral-40  opacity-70">
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageUsers;
