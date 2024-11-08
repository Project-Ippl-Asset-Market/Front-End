import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";

function AccountSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nomorRekening, setNomorRekening] = useState("");
  const [namaBank, setNamaBank] = useState("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");

  const auth = getAuth();
  const db = getFirestore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        // Ambil data pengguna dari Firestore
        const userDocRef = doc(db, "aturBayaran", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setNomorRekening(data.nomorRekening || "");
          setNamaBank(data.namaBank || "");
          setNamaPemilikRekening(data.namaPemilikRekening || "");
        } else {
          console.log("Dokumen pengguna tidak ditemukan.");
        }

        // Ambil total revenue dari Firestore
        const revenueDocRef = doc(db, "revenueCollection", user.uid); // Gantilah 'revenueCollection' dengan nama koleksi yang sesuai
        const revenueDoc = await getDoc(revenueDocRef);

        if (revenueDoc.exists()) {
          const revenueData = revenueDoc.data();
          setTotalRevenue(revenueData.totalRevenue || 0); // memastikan total revenue di set
        } else {
          console.log("Dokumen total pendapatan tidak ditemukan.");
        }
      } else {
        console.error("Pengguna tidak terautentikasi");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleSave = async () => {
    if (!currentUserId) {
      console.error("User ID tidak ditemukan.");
      return;
    }

    const userDocRef = doc(db, "aturBayaran", currentUserId); // Menggunakan currentUserId sebagai ID dokumen

    try {
      // Jika dokumen tidak ada, buat dokumen baru
      if (!(await getDoc(userDocRef)).exists()) {
        await setDoc(userDocRef, {
          nomorRekening,
          namaBank,
          namaPemilikRekening,
          userId: currentUserId, // Menambahkan userId ke dokumen
        });
        setSaveStatus("Pengaturan akun berhasil disimpan.");
      } else {
        // Jika dokumen ada, lakukan update
        await updateDoc(userDocRef, {
          nomorRekening,
          namaBank,
          namaPemilikRekening,
          userId: currentUserId, // Memastikan userId juga diperbarui
        });
        setSaveStatus("Pengaturan akun berhasil diperbarui.");
      }
    } catch (error) {
      console.error("Error saat menyimpan pengaturan akun:", error);
      setSaveStatus("Gagal menyimpan pengaturan akun.");
    }

    // Reset status simpan setelah beberapa detik
    setTimeout(() => setSaveStatus(""), 3000);
  };

  return (
    <>
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
          <h1 className="text-2xl font-semibold mb-6">Pengaturan Rekening</h1>

          {/* Menampilkan total pendapatan di atas kolom input */}
          <div className="mb-4 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold">Total Pendapatan</h2>
            <p className="text-2xl font-bold">
              Rp. {totalRevenue.toLocaleString() || "0"}
            </p>
          </div>

          {/* Menampilkan status simpan */}
          {saveStatus && <p className="text-green-500 mb-4">{saveStatus}</p>}

          <form
            className="shadow-lg p-6 bg-white rounded-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="block mb-2 font-medium" htmlFor="nomor-rekening">
              Nomor Rekening
            </label>
            <input
              type="text"
              id="nomor-rekening"
              value={nomorRekening}
              onChange={(e) => setNomorRekening(e.target.value)}
              required
              className="mb-4 w-full p-2 border rounded"
            />

            <label className="block mb-2 font-medium" htmlFor="nama-bank">
              Nama Bank
            </label>
            <input
              type="text"
              id="nama-bank"
              value={namaBank}
              onChange={(e) => setNamaBank(e.target.value)}
              required
              className="mb-4 w-full p-2 border rounded"
            />

            <label
              className="block mb-2 font-medium"
              htmlFor="nama-pemilik-rekening"
            >
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              id="nama-pemilik-rekening"
              value={namaPemilikRekening}
              onChange={(e) => setNamaPemilikRekening(e.target.value)}
              required
              className="mb-4 w-full p-2 border rounded"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  // Reset inputs ke data asli
                  setNomorRekening("");
                  setNamaBank("");
                  setNamaPemilikRekening("");
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
