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
import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Headerprofil from "../headerNavBreadcrumbs/HeaderProfil";
import Logoprofil from "../../assets/icon/iconWebUser/profil.svg";
import Logoprofilwhite from "../../assets/icon/iconWebUser/Profilwhite.svg";

function Profil() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage,setPreviewImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null); // New state for profile image URL
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
      const fetchUserProfile = async () => {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("uid", "==", currentUserId));
        
        const unsubscribeUser = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setUserProfile(userData);
  
            if (userData.photoURL) {
              setProfileImageUrl(userData.photoURL);
            } else {
              fetchImageFromStorage(); // Fungsi terpisah untuk mengambil gambar dari Storage
            }
            console.log("Data ditemukan di koleksi users:", userData);
          } else {
            console.log("Pengguna tidak ditemukan, mencoba mencari di koleksi admins");
  
            const adminsCollectionRef = collection(db, "admins");
            const adminsQuery = query(adminsCollectionRef, where("uid", "==", currentUserId));
            
            const unsubscribeAdmin = onSnapshot(adminsQuery, (snapshot) => {
              if (!snapshot.empty) {
                const userData = snapshot.docs[0].data();
                setUserProfile(userData);
  
                if (userData.photoURL) {
                  setProfileImageUrl(userData.photoURL);
                } else {
                  fetchImageFromStorage();
                }
                console.log("Data ditemukan di koleksi admins:", userData);
              } else {
                console.log("Profil tidak ditemukan di kedua koleksi.");
              }
            });
  
            return unsubscribeAdmin;
          }
        });
  
        return unsubscribeUser;
      };
  
      // Fungsi untuk mengambil gambar dari Firebase Storage jika tidak ada photoURL di Firestore
      const fetchImageFromStorage = () => {
        const storage = getStorage();
        const imageRef = ref(storage, `images-user/${currentUserId}.jpg`);
        
        getDownloadURL(imageRef)
          .then((url) => {
            setProfileImageUrl(url);
          })
          .catch((error) => {
            console.error("Error saat mengambil URL gambar profil:", error);
            setProfileImageUrl("https://placehold.co/80x80"); // Placeholder jika gagal
          });
      };
  
      fetchUserProfile();
    }
  }, [currentUserId]);

  // Fungsi untuk membuka modal
  const handleImageClick = () => {
    setShowModal(true);
  };

  // Fungsi untuk menangani perubahan file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Format file tidak valid! Gunakan png, jpeg, atau jpg.");
    }
  };

  const handleUpload = async () => {
    if (!newProfileImage) {
      alert("Silakan pilih gambar terlebih dahulu.");
      return;
    }
  
    try {
      const storage = getStorage();
      const fileExtension = newProfileImage.name.split(".").pop();
      const newImageRef = ref(storage, `images-user/${currentUserId}.${fileExtension}`);
      
      // Check if the user has an existing profile photo
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(usersCollectionRef, where("uid", "==", currentUserId));
      const userSnapshot = await getDocs(userQuery);
      
      let userDocRef = null;
      let existingPhotoURL = null;
  
      if (!userSnapshot.empty) {
        userDocRef = userSnapshot.docs[0].ref;
        existingPhotoURL = userSnapshot.docs[0].data().photoURL;
      } else {
        const adminsCollectionRef = collection(db, "admins");
        const adminsQuery = query(adminsCollectionRef, where("uid", "==", currentUserId));
        const adminSnapshot = await getDocs(adminsQuery);
  
        if (!adminSnapshot.empty) {
          userDocRef = adminSnapshot.docs[0].ref;
          existingPhotoURL = adminSnapshot.docs[0].data().photoURL;
        } else {
          alert("Dokumen pengguna tidak ditemukan.");
          return;
        }
      }
  
      // If there is an existing photoURL, delete the previous image from Storage
      if (existingPhotoURL) {
        const oldImageRef = ref(storage, existingPhotoURL);
        await deleteObject(oldImageRef);
      }
  
      // Upload the new profile image
      await uploadBytes(newImageRef, newProfileImage);
      const uploadedImageUrl = await getDownloadURL(newImageRef);
  
      // Update the photoURL in Firestore
      await updateDoc(userDocRef, { photoURL: uploadedImageUrl });
  
      alert("Foto profil berhasil diupload!");
      setProfileImageUrl(uploadedImageUrl);
      setNewProfileImage(null);
  
    } catch (error) {
      console.error("Error saat mengupload foto profil:", error);
      alert("Gagal mengupload foto profil. Silakan coba lagi.");
    }
  };
  

  // useEffect untuk mengambil URL gambar profil dari Firestore dan menampilkannya


  return (
    <div className="bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins mt-0 lg:mt-12 overflow-hidden">
      <Headerprofil />
  
      <div className="p-4 sm:p-10 lg:p-14 flex flex-col lg:flex-row bg-primary-100 dark:bg-neutral-20">
        <aside className="bg-white dark:bg-neutral-800 drop-shadow-lg w-full lg:w-60 h-auto mt-0 lg:mt-8 p-4 rounded-lg flex flex-col items-center">
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
          <h2 className="text-xl font-bold text-center mb-4">{userProfile?.username || "Username"}</h2>
          <ul className="space-y-4 w-full">
            <li>
              <button
                onClick={() => navigate("/")}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-left">
                <span className="flex items-center">
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
  
        <main className="bg-primary-100 dark:bg-neutral-20 drop-shadow-xl mt-7 h-800 lg:h-full lg:w-3/4 p-4 rounded-lg md:ml-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-3">My Profile</h1>
          <div className="bg-primary-100 dark:bg-neutral-20 p-4 rounded-lg mb-4">
            <div className="flex flex-col sm:flex-row items-center">
              <img
                src={profileImageUrl || "https://placehold.co/80x80"}
                alt="Profile"
                className="h-[110px] w-[110px] rounded-full cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-500/100"
                onClick={handleImageClick}
              />
              <div className="ml-4 text-center sm:text-left">
                <h2 className="text-xl font-bold">
                  {userProfile?.firstName || "John"}{" "}
                  {userProfile?.lastName || "Doe"}
                </h2>
              </div>
            </div>
          </div>
  
          {/* Modal for profile picture review and upload */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm rounded-xl">
              <div className="dark:bg-white bg-black p-6 rounded-lg animate-borderGlow w-[90%] lg:w-[50%] lg:h-auto">
                <h2 className="dark:text-black text-xl text-white font-bold mb-4">
                  Ganti Foto Profile
                </h2>
                <img
                  src={previewImage || "https://placehold.co/80x80"}
                  alt="Preview"
                  className="h-40 w-40 text-white dark:text-black rounded-full mb-4"
                />
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="mt-2 text-white dark:text-black rounded-lg"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
                    Batal
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
  
          {/* Personal Information Section */}
          <div className="bg-primary-100 dark:bg-neutral-20 mt-5 rounded-lg lg:h-full">
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
            
          </div>
            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/** Address Rows **/}
              <div>
                <p className="font-bold">Nama Depan</p>
                <p>{userProfile?.firstName || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Nama Belakang</p>
                <p>{userProfile?.lastName || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p>{userProfile?.email || "user@gmail.com"}</p>
              </div>
              <div>
                <p className="font-bold">Nomor Telepon</p>
                <p>{userProfile?.phone || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Bio</p>
                <p>{userProfile?.bio || "Hello"}</p>
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
            <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-2 gap-10">
              {/** Address Rows **/}
              <div>
                <p className="font-bold">Negara</p>
                <p>{userProfile?.country || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Kota</p>
                <p>{userProfile?.city || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Kode Pos</p>
                <p>{userProfile?.postalCode || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Tax ID</p>
                <p>{userProfile?.TaxID || "-"}</p>
              </div>
            </div>
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

export default Profil;
