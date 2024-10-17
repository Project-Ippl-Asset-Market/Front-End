import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../firebase/firebaseConfig";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.svg";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconHapus from "../../assets/icon/iconCRUD/iconHapus.png";
import IconEdit from "../../assets/icon/iconCRUD/iconEdit.png";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function ManageAdmin() {
  const defaultImageUrl =
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    const fetchAdmins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "admins"));
        const adminData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmins(adminData);
      } catch (error) {
        console.error("Error fetching admin data: ", error);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleDeleteAdmin = async (id) => {
    setIsLoading(true);
    setError(null);
    const functions = getFunctions();
    const deleteUser = httpsCallable(functions, "deleteUser");

    try {
      const adminToDelete = admins.find((admin) => admin.id === id);
      if (!adminToDelete) {
        throw new Error("Admin not found");
      }

      const result = await deleteUser({ uid: adminToDelete.uid });

      if (result.data.success) {
        console.log(result.data.message);
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== id)
        );
      } else {
        throw new Error(result.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError(`Failed to delete admin: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setAdminToDelete(null);
    }
  };

  const confirmDeleteAdmin = () => {
    if (adminToDelete) {
      handleDeleteAdmin(adminToDelete.id);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dark:bg-neutral-90 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <HeaderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
        <div className="breadcrumbs text-sm mt-1 mb-10">
          <Breadcrumb />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex bg-primary-2 rounded-lg items-center w-full md:w-48">
                <Link
                  to="/manageAdmin/add"
                  className="rounded-lg flex justify-center items-center text-[14px] bg-secondary-40 hover:bg-secondary-30 text-primary-100 dark:text-primary-100 mx-auto h-[45px] w-full md:w-[400px]">
                  + Add new Admin
                </Link>
              </div>
            </div>
          </div>

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
                className="input border-none bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 pl-10 h-[40px] w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8 dark:bg-neutral-25 mt-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-primary-100 dark:text-neutral-90 ">
              <thead className="text-xs text-neutral-20 uppercase dark:bg-neutral-25 dark:text-neutral-90 border-b dark:border-neutral-20">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Photo
                  </th>
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
                    Created at
                  </th>
                  <th scope="col" className="justify-center mx-auto">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="bg-primary-100 dark:bg-neutral-25 dark:text-neutral-9">
                    <td className="px-6 py-4">
                      <img
                        src={admin.profileImageUrl || defaultImageUrl}
                        alt={`${admin.username}'s profile`}
                        className="w-12 h-12 rounded-lg"
                      />
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-90 space-nowrap">
                      {admin.username}
                    </th>
                    <td className="px-6 py-4">{admin.role}</td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4">
                      {admin.createdAt
                        ? admin.createdAt.toDate().toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="mx-auto flex gap-4 mt-8 ">
                      <Link to={`/manageAdmin/edit/${admin.id}`}>
                        <img
                          src={IconEdit}
                          alt="icon edit"
                          className="w-5 h-5"
                        />
                      </Link>
                      <img
                        src={IconHapus}
                        alt="icon hapus"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => {
                          setAdminToDelete(admin);
                          setIsModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">
                Konfirmasi Penghapusan
              </h2>
              <p>
                Apakah Anda yakin ingin menghapus {adminToDelete?.username}?
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                  onClick={confirmDeleteAdmin}
                  disabled={isLoading}>
                  {isLoading ? "Menghapus..." : "Hapus"}
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex join pt-72 justify-end">
          <button className="join-item btn bg-secondary-40 hover:bg-secondary-50 border-secondary-50 hover:border-neutral-40 opacity-70">
            «
          </button>
          <button className="join-item btn dark:bg-neutral-30 bg-neutral-60 text-primary-100 hover:bg-neutral-70 hover:border-neutral-30 border-neutral-60 dark:border-neutral-30">
            Page 1
          </button>
          <button className="join-item btn bg-secondary-40 hover:bg-secondary-50 border-secondary-50 hover:border-neutral-40 opacity-70">
            »
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageAdmin;
