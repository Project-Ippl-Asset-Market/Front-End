import { db } from "../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import HeaderNav from "../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../components/website/web_User-LandingPage/NavbarSection";
import { useNavigate } from "react-router-dom";

const transactionsCollectionRef = collection(db, "transactions");

export function RiwayatTransaksi() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "Tanggal Tidak Diketahui";
    }

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Mengambil semua transaksi
  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Redirect to login page if user is not logged in
        navigate("/login");
        return;
      }

      const transactionsQuery = query(
        transactionsCollectionRef,
        where("status", "==", "Success"),
        where("uid", "==", user.uid)
      );

      try {
        const transactionsSnapshot = await getDocs(transactionsQuery);
        if (transactionsSnapshot.empty) {
          setErrorMessage("Tidak ada transaksi yang ditemukan.");
          setLoading(false);
          return;
        }

        const transactionsList = transactionsSnapshot.docs.map((doc) => {
          const transactionData = { id: doc.id, ...doc.data() };

          transactionData.assetNames = getAssetNames(transactionData.assets);
          return transactionData;
        });

        setTransactions(transactionsList);
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        setErrorMessage("Terjadi kesalahan dalam memuat transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [auth, navigate]); // Add auth and navigate to dependencies

  const getAssetNames = (assets) => {
    if (!Array.isArray(assets) || assets.length === 0) {
      return "Nama Aset Tidak Diketahui";
    }

    const names = assets.map(
      (asset) => asset.name || "Nama Aset Tidak Diketahui"
    );
    return names.join(", ");
  };

  const viewTransactionDetails = (orderId) => {
    navigate(`/transaction-detail/${orderId}`);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 ">
      <div className="w-full shadow-lg bg-primary-100 dark:text-primary-100 relative z-40 ">
        <div className="-mt-10 pt-[2px] sm:pt-[60px] md:pt-[70px] lg:pt-[70px] xl:pt-[70px] 2xl:pt-[70px] w-full">
          <HeaderNav />
        </div>
        <div className="mt-0 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
          <NavbarSection />
        </div>
      </div>
      <div className="w-full p-12 mt-20 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 mt-20">Riwayat Transaksi</h2>

        {loading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-600 uppercase tracking-wider">
                <th className="px-4 py-2">Nama Aset</th>
                <th className="px-4 py-2">Jumlah Pembayaran</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tanggal Transaksi</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-4 py-2">
                    {transaction.assetNames || "Nama tidak diketahui"}
                  </td>
                  <td className="px-4 py-2">
                    Rp.{" "}
                    {transaction.grossAmount?.toLocaleString("id-ID") ||
                      "Data tidak ada"}
                  </td>
                  <td className="px-4 py-2">
                    {transaction.status || "Status Tidak Diketahui"}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => viewTransactionDetails(transaction.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RiwayatTransaksi;
