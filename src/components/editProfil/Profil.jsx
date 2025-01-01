/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Headerprofil from "../headerNavBreadcrumbs/HeaderWebProfile";
import Logoprofil from "../../assets/icon/iconWebUser/profil.svg";
import Logoprofilwhite from "../../assets/icon/iconWebUser/Profilwhite.svg";

function Profil() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const navigate = useNavigate();

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
          setPreviewImage(
            userData.profileImageUrl || userData.profileImageUrl || ""
          );
        }
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
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
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
      const fileExtension = originalFileName.split(".").pop();
      const imageRef = ref(
        storage,
        `images-user/${currentUserId}.${fileExtension}`
      );

      // Upload gambar ke Firebase Storage
      await uploadBytes(imageRef, newProfileImage);

      // Mendapatkan URL gambar yang telah diupload
      const profileImageUrl = await getDownloadURL(imageRef);

      // Mencari dokumen pengguna berdasarkan uid
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUserId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        // Memperbarui URL foto profil di dokumen pengguna
        await updateDoc(userDocRef, { photoURL: profileImageUrl });

        alert("Foto profil berhasil diupload!");
        setNewProfileImage(null); // Reset state setelah upload
      } else {
        alert("Dokumen pengguna tidak ditemukan.");
      }
    } catch (error) {
      // console.error("Error saat mengupload foto profil:", error);
      alert("Gagal mengupload foto profil. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins mt-10 overflow-hidden">
      <Headerprofil />

      <div className="p-14 flex bg-primary-100 dark:bg-neutral-20">
        <aside className="bg-white dark:bg-neutral-800 drop-shadow-lg w-60 h-auto mt-6  rounded-lg flex flex-col items-center">
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
                onClick={() => navigate("/")}
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
                  <p className="text-center ml-10">Kembali</p>
                </span>
              </button>
            </li>
          </ul>
        </aside>

        <main className="bg-primary-100 dark:bg-neutral-20 drop-shadow-xl mt-4 lg:w-3/4 p-4 rounded-lg md:ml-6">
          <h1 className="text-3xl font-bold mb-3">My Profile</h1>
          <div className="bg-primary-100 dark:bg-neutral-20 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <img
                src={previewImage || "https://placehold.co/80x80"}
                alt="Profile"
                className="h-20 w-20 rounded-full cursor-pointer"
                onClick={handleImageClick}
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">
                  {userProfile?.firstName || "John"}{" "}
                  {userProfile?.lastName || "Doe"}
                </h2>
              </div>
            </div>
          </div>

          {/* Modal for profile picture review and upload */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">
                  Review Profile Picture
                </h2>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-40 w-40 rounded-full mb-4"
                />
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-primary-100 dark:bg-neutral-20 mt-5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <Link
                to="/editprofil1"
                className="flex items-center p-2 border-grey-400 bg-blue-600 rounded text-white font-bold">
                <span>Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth="2"
                  stroke="white"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L9 21H5v-4l11.732-11.732z"
                  />
                </svg>
              </Link>
            </div>
            <div className="bg-primary-100 dark:bg-neutral-20 rounded-lg mb-4">
              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/** Personal Information Rows **/}
                <div>
                  <p className="font-bold">First Name</p>
                  <p>{userProfile?.firstName || "John"}</p>
                </div>
                <div>
                  <p className="font-bold">Last Name</p>
                  <p>{userProfile?.lastName || "Doe"}</p>
                </div>
                <div>
                  <p className="font-bold">Email Address</p>
                  <p>{userProfile?.email || "john.doe@gmail.com"}</p>
                </div>
                <div>
                  <p className="font-bold">Phone</p>
                  <p>{userProfile?.phone || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold">Bio</p>
                  <p>
                    {userProfile?.bio ||
                      "An experienced web developer specializing in frontend technologies."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-primary-100 dark:bg-neutral-20 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Address</h2>
              <Link
                to="/editprofil2"
                className="flex items-center p-2 border-grey-400 bg-blue-600 rounded text-white font-bold">
                <span>Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth="2"
                  stroke="white"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L9 21H5v-4l11.732-11.732z"
                  />
                </svg>
              </Link>
            </div>
            <div className="bg-primary-100 dark:bg-neutral-20 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-bold">Country</p>
                  <p>{userProfile?.country || "Indonesia"}</p>
                </div>
                <div>
                  <p className="font-bold">City</p>
                  <p>{userProfile?.city || "Jakarta"}</p>
                </div>
                <div>
                  <p className="font-bold">Postal Code</p>
                  <p>{userProfile?.postalCode || "12345"}</p>
                </div>
                <div>
                  <p className="font-bold">Tax ID</p>
                  <p>{userProfile?.taxID || "123456789"}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-[#212121] text-white py-10">
        <div className="container mx-auto flex flex-col items-center">
          <div className="flex space-x-8 mb-4">
            <a href="#" className="hover:text-gray-400 font-bold">
              Terms And Conditions
            </a>
            <a href="#" className="hover:text-gray-400 font-bold">
              File Licenses
            </a>
            <a href="#" className="hover:text-gray-400 font-bold">
              Refund Policy
            </a>
            <a href="#" className="hover:text-gray-400 font-bold">
              Privacy Policy
            </a>
          </div>
          <p className="text-sm">
            Copyright &copy; 2024 All rights reserved by PixelStore
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Profil;