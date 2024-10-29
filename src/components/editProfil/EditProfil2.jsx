import { useState, useEffect } from "react";
import Headerprofil from "../headerNavBreadcrumbs/HeaderWebProfile";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Logoprofil from "../../assets/icon/iconWebUser/profil.svg";
import Logoprofilwhite from "../../assets/icon/iconWebUser/Profilwhite.svg";

function EditProfil() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    country: "",
    city: "",
    postalCode: "",
  });
  const [error,] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUserId));

      const unsubscribeUsers = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUserProfile(userData);
        } else {
          console.log("Profil pengguna tidak ditemukan di 'users', cek di 'admins'.");

          const adminsCollectionRef = collection(db, "admins");
          const adminsQuery = query(adminsCollectionRef, where("uid", "==", currentUserId));

          const unsubscribeAdmins = onSnapshot(adminsQuery, (snapshot) => {
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data(); // Ambil data dari dokumen pertama yang ditemukan
              console.log("Data pengguna ditemukan:", userData);
              setUserProfile(userData); // Simpan data pengguna ke dalam state
        }else{
          console.log("Data pengguna tidak ditemukan");
        }
      })
      unsubscribeList.push(unsubscribeAdmins);
    }});
    const unsubscribeList = [unsubscribeUsers];
    return () => unsubscribeList.forEach(unsub => unsub());
    }
  }, [currentUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSave = async () => {
    if (!currentUserId) {
        alert("User ID tidak ditemukan.");
        return;
    }

    try {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("uid", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userDocRef = userDoc.ref;

            await updateDoc(userDocRef, {
                country: userProfile.country,
                city: userProfile.city,
                postalCode: userProfile.postalCode,
            });
            
            alert("Profil berhasil diperbarui!");
        } else {
            // Jika tidak ditemukan di 'users', coba di 'admins'
            const adminsCollectionRef = collection(db, "admins");
            const adminsQuery = query(adminsCollectionRef, where("uid", "==", currentUserId));
            const adminQuerySnapshot = await getDocs(adminsQuery);

            if (!adminQuerySnapshot.empty) {
                // Jika ditemukan di koleksi 'admins', perbarui dokumen yang ada
                const adminDoc = adminQuerySnapshot.docs[0];
                const adminDocRef = adminDoc.ref;

                // Ambil data dokumen untuk cek field yang sudah ada
                await updateDoc(adminDocRef, {
                country: userProfile.country,
                city: userProfile.city,
                postalCode: userProfile.postalCode,
            });
            alert("Profil berhasil diperbarui!")

            } else {
                console.log("Data tidak ditemukan di koleksi 'admins'.");
            }
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Gagal menyimpan profil. Silakan coba lagi.");
    }
};


  return (
    <div className=" font-poppins bg-gray-50 dark:bg-neutral-900 text-neutral-10 dark:text-neutral-90">
      <Headerprofil />

      <div className="flex flex-col items-center lg:mr-0 lg:items-stretch lg:flex-row mb-5 lg:mb-10 lg:p-20">
        <aside className=" self-stretch mr-4 ml-4 lg:mr-auto lg:ml-auto bg-white dark:bg-neutral-800 drop-shadow-lg p-6 mt:4 lg:mt-16 rounded-lg">
          <div className="flex justify-center mb-4">
            <img
              src={Logoprofil}
              alt="User Profile"
              className="block dark:hidden w-16 h-16 rounded-full border-2 border-blue-600"
            />
            <img
              src={Logoprofilwhite}
              alt="User Profile"
              className="hidden dark:block w-16 h-16 rounded-full border-2 border-white"
            />
          </div>
          <h2 className="text-xl font-bold text-center mb-4">User Name</h2>
          <ul className="space-y-4 w-full">
            <li>
              <button
                onClick={() => navigate("/Profil")}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-left">
                <span className="flex  items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2.25-2.25M21 12l-2.25 2.25M12 3l2.25 2.25M12 21l-2.25-2.25M3.5 3.5L20.5 20.5M3.5 20.5L20.5 3.5"
                    />
                  </svg>
                  <p className="text-center ml-16">Kembali</p>
                </span>
              </button>
            </li>
          </ul>
        </aside>

        <main className="bg-white dark:bg-neutral-900 w-[90%] lg:w-full p-4 lg:p-6 rounded-lg mt-8 lg:mt-16 shadow-lg ml-auto mr-auto lg:mr-auto lg:ml-6">
          <h1 className="text-3xl font-bold mb-6">Edit Profil</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-bold">Negara</label>
              <input
                type="text"
                name="country"
                value={userProfile.country}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Negara"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Kota</label>
              <input
                type="text"
                name="city"
                value={userProfile.city}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Kota"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Kode Pos</label>
              <input
                type="text"
                name="postalCode"
                value={userProfile.postalCode}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Kode Pos"
              />
            </div>
          </div>

            <div className="text-right mt-20 justify-between">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300">
                Simpan Perubahan
              </button>
            </div>
        </main>
      </div>

      <footer className="bg-[#212121] text-white py-20 mt-10">
        <div className="flex flex-col items-start lg:flex lg:flex-col lg:items-center">
          <div className="flex grid grid-cols-1 ml-6 lg:mr-auto lg:ml-auto lg:flex lg:space-x-16 lg:mb-8 gap-10">
            <a href="#" className="hover:text-gray-400 font-bold">Terms And Conditions</a>
            <a href="#" className="hover:text-gray-400 font-bold">File Licenses</a>
            <a href="#" className="hover:text-gray-400 font-bold">Refund Policy</a>
            <a href="#" className="hover:text-gray-400 font-bold">Privacy Policy</a>
          </div>
          <p className="text-sm mb-1 mt-20 lg:mt-0 self-center">Copyright &copy; 2024 All rights reserved by PixelStore</p>
        </div>
      </footer>
    </div>
  );
}

export default EditProfil;
