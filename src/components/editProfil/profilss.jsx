import { useState, useEffect } from 'react';
import HeaderNav from "../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../components/website/web_User-LandingPage/NavbarSection";
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore"; // Import Firestore
import { db } from "../../firebase/firebaseConfig"; // Import Firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

function Profil() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // State untuk menyimpan data profil pengguna
  const [loading, setLoading] = useState(true); // State untuk loading status
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [selectedImage, setSelectedImage] = useState(null); // Menyimpan file gambar yang dipilih
  const [previewImage, setPreviewImage] = useState(null); // Preview gambar yang dipilih
  
  // Mengambil ID pengguna saat ini (jika ada)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid); // Menyimpan UID pengguna yang sedang login
      } else {
        setCurrentUserId(null);
      }
    });

    // Bersihkan listener saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  // Mengambil data profil pengguna secara real-time menggunakan query berdasarkan UID
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
          setPreviewImage(userData.photoURL); // Set preview dengan photoURL dari Firestore
        } else {
          console.log("Profil pengguna tidak ditemukan untuk UID:", currentUserId);
        }
        setLoading(false); // Menghentikan loading setelah data diambil
      });

      // Bersihkan listener saat komponen di-unmount
      return () => unsubscribe();
    }
  }, [currentUserId]);

  // Fungsi untuk membuka modal
  const handleImageClick = () => {
    setShowModal(true);
  };

  // Fungsi untuk menangani perubahan file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview gambar yang dipilih
    } else {
      alert("Format file tidak valid! Gunakan png, jpeg, atau jpg.");
    }
  };

  // Fungsi untuk mengunggah gambar ke Firebase Storage dan memperbarui Firestore
  const handleUpload = async () => {
    if (selectedImage && currentUserId) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${currentUserId}/${selectedImage.name}`);
      try {
        // Mengunggah gambar ke Firebase Storage
        await uploadBytes(storageRef, selectedImage);
        const downloadURL = await getDownloadURL(storageRef);

        // Memperbarui URL gambar di Firestore
        const userDocRef = doc(db, "users", currentUserId);
        await updateDoc(userDocRef, { photoURL: downloadURL });

        alert("Foto profil berhasil diperbarui!");
        setShowModal(false); // Tutup modal
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Gagal mengunggah gambar. Silakan coba lagi.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading spinner saat data sedang diambil
  }

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 ">
      {/* Header dan Navbar */}
      <div className="w-full shadow-lg bg-primary-100 dark:text-primary-100 relative z-40 ">
        <div className="pt-[50px] sm:pt-[70px] md:pt-[70px] lg:pt-[70px] xl:pt-[70px] 2xl:pt-[70px] w-full">
          <HeaderNav />
        </div>
        <NavbarSection />
      </div>

      {/* Main Layout */}
      <div className="dark:bg-neutral-20 dark:text-neutral-90 bg-primary-100 text-black duration-500 flex">
        {/* Sidebar */}
        <aside className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 mt-[10%] w-64 h-60 p-6 mt-16 rounded-lg ml-10">
          <ul>
            <li>
              <Link to="/" className="block px-4 py-2 rounded-md hover:bg-[#2563eb] transition duration-300">
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

        {/* Main Content */}
        <main className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 mt-[10%] lg:w-3/4 p-4 rounded-lg ml-6">
          <h1 className="text-3xl font-bold mb-3">My Profile</h1>

          {/* Profile Picture Section */}
          <div className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <img
                src={previewImage || "https://placehold.co/80x80"}
                alt="Profile Picture"
                className="h-20 w-20 rounded-full cursor-pointer"
                onClick={handleImageClick}
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{userProfile?.firstName || 'John'} {userProfile?.lastName || 'Doe'}</h2>
              </div>
            </div>
          </div>

          {/* Modal untuk review dan upload foto */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Review Profile Picture</h2>
                
                <img src={previewImage} alt="Preview" className="h-40 w-40 rounded-full mb-4" />
                
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />

                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={handleUpload}
                    disabled={!selectedImage} // Hanya aktif jika ada gambar yang dipilih
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="dark:bg-neutral-20 dark:text-neutral-90 bg-primary-100 mt-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold mt-5">Personal Information</h2>
              <Link to="/editprofil1" className="flex items-center p-2 dark:bg-neutral-20 dark:text-neutral-90 flex items-center p-2 border border-grey-400 bg-blue-600 rounded text-white font-bold">
                <span className="mr-1">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L9 21H5v-4l11.732-11.732z" />
                </svg>
              </Link>
            </div>
            <div className="dark:bg-neutral-20 dark:text-neutral-90 bg-primary-100 p-4 rounded-lg mb-4">
              <div className="border border-gray-400 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-10 p-5">
                <div>
                  <p className="text-black-400 font-bold">First Name</p>
                  <p>{userProfile?.firstName || 'John'}</p>
                </div>
                <div>
                  <p className="text-black-400 font-bold">Last Name</p>
                  <p>{userProfile?.lastName || 'Doe'}</p>
                </div>
                <div>
                  <p className="text-black-400 font-bold">Email Address</p>
                  <p>{userProfile?.email || 'john.doe@gmail.com'}</p>
                </div>
                <div>
                  <p className="text-black-400 font-bold">Phone</p>
                  <p>{userProfile?.phone || '+62123456789'}</p>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-black-400 font-bold">Bio</p>
                  <p>{userProfile?.bio || 'An experienced web developer specializing in frontend technologies.'}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Address Section */}
      <div className="dark:bg-neutral-20 dark:text-neutral-90 bg-primary-100 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold mt-5">Address</h2>
              <Link to="/editprofil2" className="dark:bg-neutral-20 dark:text-neutral-90 flex items-center p-2 border border-grey-400 bg-blue-600 rounded text-white font-bold">
                <span className="mr-1">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L9 21H5v-4l11.732-11.732z" />
                </svg>
              </Link>
            </div>
            <div className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 p-4 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <p className="text-gray-400 font-bold">Country</p>
                  <p>{userProfile?.country || 'Indonesia'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold">City</p>
                  <p>{userProfile?.city || 'Jakarta'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold">Postal Code</p>
                  <p>{userProfile?.postalCode || '12345'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold">Tax ID</p>
                  <p>{userProfile?.taxID || '123456789'}</p>
                </div>
              </div>
            </div>
          </div>

      {/* Footer */}
      <footer className="bg-[#212121] text-white py-20">
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

export default Profil;
