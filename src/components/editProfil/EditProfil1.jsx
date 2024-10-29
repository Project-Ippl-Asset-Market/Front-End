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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
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

        // Bersihkan listener saat komponen di-unmount
        return () => unsubscribeList.forEach(unsub=>unsub());
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
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          phone: userProfile.phone,
          bio: userProfile.bio,
        });

        alert("Profil berhasil diperbarui!");
      } else {
        // Jika tidak ditemukan di 'users', coba di 'admins'
        const adminsCollectionRef = collection(db, "admins");
        const adminsQuery = query(adminsCollectionRef, where("uid", "==", currentUserId));

        const querySnapshot = await getDocs(adminsQuery);
  
        if (!querySnapshot.empty) {
          // Ambil dokumen pengguna pertama yang cocok dengan UID di 'admins'
          const adminDoc = querySnapshot.docs[0];
          const adminDocRef = adminDoc.ref;
  
          // Data yang akan diperbarui, gunakan nilai yang ada di userProfile
          const updatedData = {
            firstName: userProfile.firstName || adminDoc.data().firstName || '',
            lastName: userProfile.lastName || adminDoc.data().lastName || '',
            email: userProfile.email || adminDoc.data().email || '',
          };
  
          // Periksa apakah phone dan bio ada di userProfile dan perlu diperbarui
          if (userProfile.phone !== "") {
            updatedData.phone = userProfile.phone;
          }
  
          if (userProfile.bio !== "") {
            updatedData.bio = userProfile.bio;
          }
  
          // Perbarui dokumen pengguna di Firestore
          await updateDoc(adminDocRef, updatedData);
          alert('Profil berhasil diperbarui!');
        } else {
          console.log("Data tidak ditemukan");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Gagal menyimpan profil. Silakan coba lagi.');
    }
  };


  return (
    <div className="min-h-screen font-poppins bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90">
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
          <h2 className="text-xl font-bold text-center mb-4">{userProfile?.username}</h2>
          {/* Optional for user name */}
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
                  <p className="text-center ml-6">Kembali</p>
                </span>
              </button>
            </li>
          </ul>
        </aside>

        <main className="bg-white dark:bg-neutral-900 w-[90%] lg:w-full p-4 lg:p-6 rounded-lg mt-8 lg:mt-16 shadow-lg ml-auto mr-auto lg:mr-auto lg:ml-6">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block mb-2 font-bold">Nama Depan</label>
              <input
                type="text"
                name="firstName"
                value={userProfile.firstName}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Nama Depan"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Nama Belakang</label>
              <input
                type="text"
                name="lastName"
                value={userProfile.lastName}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Nama Belakang"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Email</label>
              <input
                type="email"
                name="email"
                value={userProfile.email}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Email"
              />
            </div>

            <div className="mb-4">
              <label className="dark:text-white block mb-2 font-bold">Telepon</label>
              <input
                type="text"
                name="phone"
                value={userProfile.phone}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Telepon"
              />
            </div>

            <div className="mb-4 col-span-full">
              <label className="block mb-2 font-bold">Bio</label>
              <textarea
                name="bio"
                value={userProfile.bio}
                onChange={handleChange}
                className="dark:text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Deskripsikan tentang diri Anda"
              />
            </div>
          </div>

          <div className="text-right mt-6">
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
