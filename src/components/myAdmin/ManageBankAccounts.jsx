import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";

const ManageBankAccounts = () => {
  const db = getFirestore();
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersAndAccounts = async () => {
      try {
        // Ambil data pengguna dari koleksi users
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id, // ID dokumen yang menjadi userId
          uid: doc.data().uid, // Ambil field uid dari dokumen
          ...doc.data(),
        }));

        console.log("Data Pengguna:", usersData);
        setUsers(usersData);

        // Ambil data rekening berdasarkan userId
        const accountsData = [];
        const accountsRef = collection(db, "aturBayaran");
        const accountsSnapshot = await getDocs(accountsRef);

        accountsSnapshot.forEach((doc) => {
          const accountData = doc.data();
          console.log("Data Rekening yang Ditemukan:", accountData);

          // Cek userId yang ada di rekening
          console.log("Cek userId di Rekening:", accountData.userId);

          // Memeriksa jika userId cocok dengan pengguna
          const matchingUser = usersData.find(
            (user) => user.uid === accountData.userId // Cek kecocokan uid
          );

          if (matchingUser) {
            accountsData.push({
              id: doc.id,
              ...accountData,
              username: matchingUser.username || "", // Tambahkan username jika perlu
            });
          } else {
            console.log(
              "Tidak ditemukan user id yang cocok untuk:",
              accountData.userId
            );
          }
        });

        console.log("Data Rekening yang Cocok:", accountsData);
        setAccounts(accountsData);
      } catch (error) {
        setError("Error fetching users or accounts: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndAccounts(); // Memanggil fungsi pengambilan data
  }, [db]);

  return (
    <div className="dark:bg-neutral-90 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <HeaderSidebar />
      <aside className="fixed top-0 left-0 z-40 w-[280px] transition-transform">
        <div className="h-full px-3 py-4">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] h-full min-h-screen mt-8 pt-20 bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10">
        <h1 className="text-2xl font-bold mb-6">Data Pemilik Rekening</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-60 w-60 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8 dark:bg-neutral-25 mt-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-primary-100 dark:text-neutral-90">
              <thead className="text-xs text-neutral-20 uppercase dark:bg-neutral-25 dark:text-neutral-90 border-b dark:border-neutral-20">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama Bank
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nomor Rekening
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="bg-primary-100 dark:bg-neutral-25 dark:text-neutral-9"
                    >
                      <td className="px-6 py-4">{account.username}</td>
                      <td className="px-6 py-4">{account.namaBank}</td>
                      <td className="px-6 py-4">{account.nomorRekening}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Tidak ada rekening yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBankAccounts;
