import { useState, useEffect } from 'react';
import HeaderNav from "../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../website/web_User-LandingPage/NavbarSection";
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc,getDocs, collection,query, where,onSnapshot } from "firebase/firestore"; 
import { db } from "../../firebase/firebaseConfig";

function EditProfiladminbackup() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: ""
  });
  const [error] = useState(""); 

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
      console.log("Mengambil data untuk pengguna dengan UID:", currentUserId);
  
      // Membuat query untuk mencari dokumen yang memiliki field 'uid' sesuai dengan currentUserId
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUserId));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data(); // Ambil data dari dokumen pertama yang ditemukan
          console.log("Data pengguna ditemukan:", userData);
          setUserProfile(userData); // Simpan data pengguna ke dalam state

        } else {
          console.log("Profil pengguna tidak ditemukan di 'users', cek di 'admins'.");

          const adminsCollectionRef = collection(db, "admins");
          const adminsQuery = query(adminsCollectionRef, where("uid", "==", currentUserId));

          const unsubscribe = onSnapshot(adminsQuery, (snapshot) => {
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data(); // Ambil data dari dokumen pertama yang ditemukan
              console.log("Data pengguna ditemukan:", userData);
              setUserProfile(userData); // Simpan data pengguna ke dalam state
        }else{
          console.log("Data pengguna tidak ditemukan");
        }
      })
    }});
  
      // Bersihkan listener saat komponen di-unmount
      return () => unsubscribe();
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
      // Membuat query untuk mencari dokumen dengan field uid yang sesuai dengan currentUserId
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUserId));
  
      // Mengambil dokumen pengguna yang cocok
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Ambil dokumen pengguna pertama yang cocok dengan UID di 'users'
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;
  
        // Data yang akan diperbarui, gunakan nilai yang ada di userProfile
        const updatedData = {
          firstName: userProfile.firstName || userDoc.data().firstName || '',
          lastName: userProfile.lastName || userDoc.data().lastName || '',
          email: userProfile.email || userDoc.data().email || '',
        };
  
        // Periksa apakah phone dan bio ada di userProfile dan perlu diperbarui
        if (userProfile.phone !== "") {
          updatedData.phone = userProfile.phone;
        }
  
        if (userProfile.bio !== "") {
          updatedData.bio = userProfile.bio;
        }
  
        // Perbarui dokumen pengguna di Firestore
        await updateDoc(userDocRef, updatedData);
        alert('Profil berhasil diperbarui!');
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
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 ">
      <div className="w-full shadow-lg bg-primary-100 dark:text-primary-100 relative z-40 ">
        <div className="pt-[50px] sm:pt-[70px] md:pt-[70px] lg:pt-[70px] xl:pt-[70px] 2xl:pt-[70px] w-full">
          <HeaderNav />
        </div>
        <NavbarSection />
      </div>

      <div className="dark:bg-neutral-20 dark:text-neutral-90 bg-primary-100 text-black duration-500 flex">
        <aside className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 mt-[10%] w-64 h-60 p-6 mt-16 rounded-lg ml-10">
          <ul>
            <li>
              <Link to="/Profil" className="block px-4 py-2 rounded-md hover:bg-[#2563eb] transition duration-300">
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/delete-account" className="block px-4 py-2 text-[#980019] transition duration-300">
                Delete Account
              </Link>
            </li>
          </ul>
        </aside>

        <main className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 mt-[10%] lg:w-3/4 p-4 rounded-lg ml-6">
          <h1 className="text-3xl font-bold mb-3">Edit Profile</h1>

          <div className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 p-10 rounded-lg shadow-lg mb-4">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
              <label className="block mb-2 font-bold">First Name</label>
              <input
                type="text"
                name="firstName"
                value={userProfile.firstName || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black mb-5"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userProfile.lastName || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black mb-5"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Email</label>
              <input
                type="email"
                name="email"
                value={userProfile.email || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black mb-5"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Phone</label>
              <input
                type="text"
                name="phone"
                value={userProfile.phone || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black mb-5"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Bio</label>
              <textarea
                name="bio"
                value={userProfile.bio || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black"
                rows="4"
              />
            </div>
            <div className="text-right">
              <button onClick={handleSave} className="px-4 py-2 bg-[#2563eb] text-white font-bold rounded-md hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-[#212121] text-white text-bold py-20">
        <div className="container mx-auto flex flex-col items-center">
          <div className="flex space-x-16 mb-8">
            <a href="#" className="hover:text-gray-400 font-bold">Terms And Conditions</a>
            <a href="#" className="hover:text-gray-400 font-bold">File Licenses</a>
            <a href="#" className="hover:text-gray-400 font-bold">Refund Policy</a>
            <a href="#" className="hover:text-gray-400 font-bold">Privacy Policy</a>
          </div>
          <p className="text-sm mb-1">Copyright &copy; 2024 All rights reserved by PixelStore</p>
        </div>
      </footer>
    </div>
  );
}

export default EditProfiladminbackup;