import { useState, useEffect } from 'react';
import HeaderNav from "../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../components/website/web_User-LandingPage/NavbarSection";
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, deleteUser } from "firebase/auth";
import { doc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Profil() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State untuk modal konfirmasi penghapusan
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Mengambil ID pengguna saat ini (jika ada)
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

  // Mengambil data profil pengguna secara real-time
  useEffect(() => {
    if (currentUserId) {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUserId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUserProfile(userData);
          setPreviewImage(userData.photoURL);
        }
        setLoading(false);
      });

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
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Format file tidak valid! Gunakan png, jpeg, atau jpg.");
    }
  };

  const storage = getStorage();

  // Fungsi untuk mengunggah gambar ke Firebase Storage
  const handleUpload = async () => {
    if (!newProfileImage) {
      alert("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    try {
      const originalFileName = newProfileImage.name;
      const fileExtension = originalFileName.split('.').pop();
      const imageRef = ref(storage, `images-user/${currentUserId}.${fileExtension}`);

      await uploadBytes(imageRef, newProfileImage);
      const profileImageUrl = await getDownloadURL(imageRef);

      const userDocRef = doc(db, "users", currentUserId);
      await updateDoc(userDocRef, { photoURL: profileImageUrl });

      alert("Foto profil berhasil diupload!");
      setNewProfileImage(null);

    } catch (error) {
      console.error("Error saat mengupload foto profil:", error);
      alert("Gagal mengupload foto profil. Silakan coba lagi.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Fungsi untuk menghapus akun
  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userDocRef, { deleted: true });
        await deleteUser(user);
        alert("Akun Anda berhasil dihapus.");
      } catch (error) {
        console.error("Error saat menghapus akun:", error);
        alert("Gagal menghapus akun. Silakan coba lagi.");
      }
    } else {
      alert("User tidak ditemukan.");
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
              <Link to="/" className="block px-4 py-2 rounded-md hover:bg-[#2563eb] transition duration-300">
                My Profile
              </Link>
            </li>
            <li>
              <Link 
                onClick={() => setShowDeleteModal(true)} // Menampilkan modal konfirmasi penghapusan
                to="#"
                className="block px-4 py-2 text-[#980019] transition duration-300">
                Delete Account
              </Link>
            </li>
          </ul>
        </aside>

        <main className="dark:bg-neutral-20 dark:text-neutral-90 border border-gray-400 bg-primary-100 mt-[10%] lg:w-3/4 p-4 rounded-lg ml-6">
          <h1 className="text-3xl font-bold mb-3">My Profile</h1>
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

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Review Profile Picture</h2>
                <img src={previewImage} alt="Preview" className="h-40 w-40 rounded-full mb-4" />
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer" onClick={handleUpload} disabled={!selectedImage}>
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
            <div className="dark:bg-neutral-20 dark:text-neutral-90 bg-primary-100 rounded-lg mb-4">
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
                  <p className="text-black-400 font-bold">Country</p>
                  <p>{userProfile?.country || 'Indonesia'}</p>
                </div>
                <div>
                  <p className="text-black-400 font-bold">City</p>
                  <p>{userProfile?.city || 'Jakarta'}</p>
                </div>
                <div>
                  <p className="text-black-400 font-bold">Postal Code</p>
                  <p>{userProfile?.postalCode || '12345'}</p>
                </div>
                <div>
                  <p className="text-black-400 font-bold">Tax ID</p>
                  <p>{userProfile?.taxID || '123456789'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal untuk konfirmasi penghapusan akun */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Konfirmasi Penghapusan Akun</h2>
                <p>Apakah Anda yakin ingin menghapus akun? Akun akan terhapus secara permanen.</p>
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2" onClick={() => setShowDeleteModal(false)}>
                    Batal
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer" onClick={handleDeleteAccount}>
                    Hapus Akun
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <footer className="bg-[#212121] text-white py-20 mt-10">
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
