import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

function AccountSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nomorRekening, setNomorRekening] = useState("");
  const [namaBank, setNamaBank] = useState("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [isChanged, setIsChanged] = useState(false); 
  const auth = getAuth();
  const db = getFirestore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        
        const userDocRef = doc(db, "aturBayaran", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setNomorRekening(data.nomorRekening || "");
          setNamaBank(data.namaBank || "");
          setNamaPemilikRekening(data.namaPemilikRekening || "");
        } else {
          console.log(
            "Dokumen pengguna tidak ditemukan, siap untuk input baru."
          );
        }
      } else {
        console.error("Pengguna tidak terautentikasi");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsChanged(true); 
  };

  const handleSave = async () => {
    if (!currentUserId) {
      console.error("User ID tidak ditemukan.");
      return;
    }

    const userDocRef = doc(db, "aturBayaran", currentUserId); 
    try {
      await setDoc(
        userDocRef,
        {
          nomorRekening,
          namaBank,
          namaPemilikRekening,
          userId: currentUserId, 
        },
        { merge: true }
      ); 
      setSaveStatus("Pengaturan akun berhasil disimpan.");
      setIsChanged(false); 
    } catch (error) {
      console.error("Error saat menyimpan pengaturan akun:", error);
      setSaveStatus("Gagal menyimpan pengaturan akun.");
    }

    
    setTimeout(() => setSaveStatus(""), 5000);
  };

  return (
    <>
      <div className="min-h-screen font-poppins dark:bg-neutral-10 bg-primary-100 dark:text-primary-100 text-neutral-20">
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
          <div className="min-h-screen px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
            <NavigationItem />
          </div>
        </aside>

        <div className="p-8 sm:ml-[280px] h-full dark:bg-neutral-10 bg-primary-100 dark:text-primary-100 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumbs />
          </div>
          <h1 className="text-2xl font-semibold mb-6">Pengaturan Rekening</h1>

          
          {saveStatus && <p className="text-green-500 mb-4">{saveStatus}</p>}

          <form
            className="shadow-lg p-6 bg-white rounded-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            <label
              className="block mb-2 font-medium"
              htmlFor="account-owner-name"
            >
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              id="account-owner-name"
              value={namaPemilikRekening}
              onChange={handleInputChange(setNamaPemilikRekening)}
              required
              className="mb-4 w-full p-2 border rounded"
            />

            <label className="block mb-2 font-medium" htmlFor="account-number">
              Nomor Rekening
            </label>
            <input
              type="text"
              id="account-number"
              value={nomorRekening}
              onChange={handleInputChange(setNomorRekening)}
              required
              className="mb-4 w-full p-2 border rounded"
            />

            <label className="block mb-2 font-medium" htmlFor="bank-name">
              Nama Bank
            </label>
            <select
              id="bank-name"
              value={namaBank}
              onChange={handleInputChange(setNamaBank)}
              required
              className="mb-4 w-full p-2 border rounded"
            >
              <option value="">Pilih Bank</option>
              <option value="Bank BCA">Bank BCA</option>
              <option value="Bank Mandiri">Bank Mandiri</option>
              <option value="Bank Niaga">Bank Niaga</option>
              <option value="Bank Central Asia">Bank Central Asia</option>
              <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
              
            </select>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isChanged} 
                className={`mr-2 ${
                  isChanged ? "bg-green-500" : "bg-gray-400"
                } text-white px-4 py-2 rounded`}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
