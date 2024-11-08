<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";

function AdminWithdrawRequests() {
  const db = getFirestore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUsersAndRequests = async () => {
      try {
        // Ambil data pengguna dari koleksi users
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);

        // Ambil permintaan penarikan dana
        const requestsSnapshot = await getDocs(
          collection(db, "withdrawRequests")
        );
        const requestsData = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Menambahkan username ke permintaan penarikan
        const requestsWithUsernames = requestsData.map((request) => {
          const user = usersData.find((user) => user.uid === request.userId); // Sesuaikan dengan key pengguna
          return {
            ...request,
            username: user ? user.username : "Tidak Ditemukan", // Jika tidak ada username
          };
        });

        setWithdrawRequests(requestsWithUsernames);
      } catch (error) {
        setError("Error fetching users or requests: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndRequests();
  }, [db]);

  const handleApprove = async (id) => {
    try {
      const requestDocRef = doc(db, "withdrawRequests", id);
      await updateDoc(requestDocRef, {
        status: "Approved",
      });
      setWithdrawRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "Approved" } : req
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const requestDocRef = doc(db, "withdrawRequests", id);
      await updateDoc(requestDocRef, {
        status: "Rejected",
      });
      setWithdrawRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "Rejected" } : req
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
      <HeaderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <aside
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
        <h1 className="text-2xl font-semibold mb-6">
          Daftar Permintaan Penarikan Dana
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-60 w-60 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Nomor Rekening</th>
                <th className="py-3 px-6 text-left">Nama Bank</th>
                <th className="py-3 px-6 text-left">Jumlah Penarikan</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {withdrawRequests.length > 0 ? (
                withdrawRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{request.username}</td>
                    <td className="py-3 px-6">{request.nomorRekening}</td>
                    <td className="py-3 px-6">{request.namaBank}</td>
                    <td className="py-3 px-6">
                      Rp. {request.jumlahPenarikan.toLocaleString()}
                    </td>
                    <td className="py-3 px-6">{request.status}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                        disabled={request.status !== "Pending"}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        disabled={request.status !== "Pending"}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-3 px-6 text-center">
                    Tidak ada permintaan penarikan yang tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminWithdrawRequests;
=======
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Sesuaikan dengan path Anda
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function AdminWithdrawRequests() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchWithdrawRequests = async () => {
      const requestsSnapshot = await getDocs(
        collection(db, "withdrawRequests")
      );
      const requestsData = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWithdrawRequests(requestsData);
    };

    fetchWithdrawRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const requestDocRef = doc(db, "withdrawRequests", id);
      await updateDoc(requestDocRef, {
        status: "Approved",
      });
      setWithdrawRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "Approved" } : req
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const requestDocRef = doc(db, "withdrawRequests", id);
      await updateDoc(requestDocRef, {
        status: "Rejected",
      });
      setWithdrawRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "Rejected" } : req
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-20">
      <HeaderSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <aside
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
        <h1 className="text-2xl font-semibold mb-6">
          Daftar Permintaan Penarikan Dana
        </h1>

        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID Permintaan</th>
              <th className="py-3 px-6 text-left">Nomor Rekening</th>
              <th className="py-3 px-6 text-left">Nama Bank</th>
              <th className="py-3 px-6 text-left">Jumlah Penarikan</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {withdrawRequests.length > 0 ? (
              withdrawRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{request.id}</td>
                  <td className="py-3 px-6">{request.nomorRekening}</td>
                  <td className="py-3 px-6">{request.namaBank}</td>
                  <td className="py-3 px-6">
                    Rp. {request.jumlahPenarikan.toLocaleString()}
                  </td>
                  <td className="py-3 px-6">{request.status}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                      disabled={request.status !== "Pending"}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                      disabled={request.status !== "Pending"}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-6 text-center">
                  Tidak ada permintaan penarikan yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminWithdrawRequests;
>>>>>>> e8cbd468b9830bafad75ff1dbd9fd4fecbebc75e
