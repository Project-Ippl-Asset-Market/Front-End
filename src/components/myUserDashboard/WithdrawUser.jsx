import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";

function WithdrawPage() {
  const db = getFirestore();
  const auth = getAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [accountDetails, setAccountDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("default_username"); // Set default username
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); // State untuk mengelola status proses
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan pesan kesalahan

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const fetchUserData = async () => {
        console.log("Current user UID:", user.uid); // Log UID pengguna

        // Ambil username dari koleksi users
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data retrieved:", userData); // Log data pengguna
          if (userData.username) {
            setUsername(userData.username);
            console.log("Username retrieved:", userData.username); // Log username
          } else {
            console.error("Username field is empty. Using default username.");
          }
        } else {
          console.error(
            "User document does not exist. Using default username."
          );
        }

        // Ambil total pendapatan dari koleksi revenue
        const revenueDocRef = doc(db, "revenue", user.uid);
        const revenueDoc = await getDoc(revenueDocRef);
        if (revenueDoc.exists()) {
          setTotalPendapatan(revenueDoc.data().totalPendapatan || 0);
        }
      };

      fetchUserData();

      // Ambil riwayat penarikan
      const unsubscribe = onSnapshot(
        collection(db, "withdrawals"),
        (snapshot) => {
          const history = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.uid === user.uid) {
              history.push({ id: doc.id, ...data });
            }
          });
          setWithdrawalHistory(history);
        }
      );

      return () => unsubscribe();
    }
  }, [db, auth]);

  const fetchAccountDetails = async () => {
    const user = auth.currentUser;
    if (user) {
      const accountDocRef = doc(db, "aturBayaran", user.uid);
      const accountDoc = await getDoc(accountDocRef);
      if (accountDoc.exists()) {
        setAccountDetails(accountDoc.data());
        console.log("Account details retrieved:", accountDoc.data()); // Log detail akun
      } else {
        console.error("Account document does not exist.");
      }
    }
  };

  const handleWithdraw = () => {
    fetchAccountDetails();
    setModalOpen(true);
  };

  const confirmWithdraw = async () => {
    if (accountDetails && username) {
      // Pastikan username dan detail akun tidak kosong
      setIsProcessing(true); // Set status proses menjadi true
      try {
        await addDoc(collection(db, "withdrawals"), {
          amount: totalPendapatan,
          createdAt: new Date(),
          uid: auth.currentUser.uid, // Ganti sellerId dengan uid
          username: username, // Sertakan username
          status: "Pending", // Set status awal ke "Pending"
        });

        // Update total pendapatan setelah penarikan
        setTotalPendapatan((prev) => prev - totalPendapatan);

        console.log("Withdrawal request sent successfully.");
      } catch (error) {
        console.error("Error processing withdrawal:", error);
      } finally {
        setModalOpen(false);
        setAccountDetails(null);
        setIsProcessing(false); // Set status proses kembali ke false
        setErrorMessage(""); // Reset pesan kesalahan
      }
    } else {
      console.error("Username is empty or account details are missing.");
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
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100">
          <NavigationItem />
        </div>
      </aside>

      <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 min-h-screen mt-8 pt-24">
        <h1 className="text-2xl font-semibold mb-6">Tarik Saldo</h1>

        <h2 className="text-xl font-semibold mb-4">
          Total Pendapatan: Rp. {totalPendapatan.toLocaleString()}
        </h2>
        <button
          onClick={handleWithdraw}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            totalPendapatan < 50000 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={totalPendapatan < 50000} // Nonaktifkan tombol jika totalPendapatan kurang dari 50000
        >
          Cairkan Dana
        </button>

        {/* Pesan Kesalahan */}
        {totalPendapatan < 50000 && (
          <div className="text-red-500 mt-2">
            Jumlah penarikan harus minimal Rp. 50.000.
          </div>
        )}

        {/* Modal untuk konfirmasi penarikan */}
        {modalOpen && accountDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Konfirmasi Penarikan
              </h2>
              <p>
                Jumlah yang akan ditarik: Rp. {totalPendapatan.toLocaleString()}
              </p>
              <h3 className="font-semibold mt-4">Detail Rekening:</h3>
              <p>Nama Bank: {accountDetails.namaBank}</p>
              <p>Nama Pemilik Rekening: {accountDetails.namaPemilikRekening}</p>
              <p>Nomor Rekening: {accountDetails.nomorRekening}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={confirmWithdraw}
                  className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isProcessing} // Nonaktifkan tombol saat proses
                >
                  Ya, Cairkan Dana
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Riwayat Penarikan */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Riwayat Penarikan</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 px-4 py-2">Tanggal</th>
              <th className="border-b-2 border-gray-300 px-4 py-2">Jumlah</th>
              <th className="border-b-2 border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalHistory.map((withdrawal) => (
              <tr key={withdrawal.id}>
                <td className="border-b border-gray-300 px-4 py-2">
                  {new Date(
                    withdrawal.createdAt.seconds * 1000
                  ).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-300 px-4 py-2">
                  Rp. {withdrawal.amount.toLocaleString()}
                </td>
                <td className="border-b border-gray-300 px-4 py-2">
                  {withdrawal.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WithdrawPage;
