import { db } from "../../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderNav from "../../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../../assets/assetmanage/Iconrarzip.svg";
import IconDollar from "../../../../assets/assetWeb/iconDollarLight.svg";
import IconCart from "../../../../assets/assetWeb/iconCart.svg";
import { useNavigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";

export function Asset3D() {
  const navigate = useNavigate();
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedasset, setSelectedasset] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

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

    // Bersihkan listener saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  // Mengambil data asset dari Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "assetImage3D"),
      async (snapshot) => {
        const Assets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter asset dengan harga tidak terdefinisi atau nol
        const filteredAssets = Assets.filter(
          (asset) => asset.price !== undefined && asset.price !== 0
        );
        setAssetsData(filteredAssets);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!currentUserId) return;

      // Membuat query untuk mendapatkan dokumen berdasarkan userId
      const likesQuery = query(
        collection(db, "likes"),
        where("userId", "==", currentUserId)
      );

      try {
        const likesSnapshot = await getDocs(likesQuery);
        const userLikes = new Set();

        // Menambahkan assetId ke dalam set likedAssets
        likesSnapshot.forEach((doc) => {
          userLikes.add(doc.data().assetId);
        });

        setLikedAssets(userLikes);
      } catch (error) {
        console.error("Error fetching likes: ", error);
      }
    };

    fetchUserLikes();
  }, [currentUserId]);

  const handleLikeClick = async (assetId, currentLikes) => {
    if (isProcessingLike) return;

    if (!currentUserId) {
      setAlertLikes("Anda perlu login untuk menyukai Asset ini");
      setTimeout(() => {
        setAlertLikes(false);
      }, 3000);
      return;
    }

    // Tandai bahwa kita sedang memproses
    setIsProcessingLike(true);

    const assetRef = doc(db, "assetImage3D", assetId);
    const likeRef = doc(db, "likes", `${currentUserId}_${assetId}`);

    try {
      await runTransaction(db, async (transaction) => {
        const newLikedAssets = new Set(likedAssets);
        let newLikesAsset;
        if (newLikedAssets.has(assetId)) {
          // Untuk Hapus like
          transaction.delete(likeRef);
          newLikesAsset = Math.max(0, currentLikes - 1);
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.delete(assetId);
        } else {
          // Untuk Tambah like
          transaction.set(likeRef, {
            userId: currentUserId,
            assetId: assetId,
          });
          newLikesAsset = currentLikes + 1;
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.add(assetId);
        }

        // Update state setelah transaksi sukses
        setLikedAssets(newLikedAssets);
      });
    } catch (error) {
      console.error("Error updating likes: ", error);
    } finally {
      // Selesaikan proses
      setIsProcessingLike(false);
    }
  };

  const handleAddToCart = () => {
    if (!currentUserId) {
      alert("Anda perlu login untuk menambahkan asset ke keranjang");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const handleBuyNow = () => {
    if (!currentUserId) {
      alert("Anda perlu login untuk membeli asset");
      navigate("/login");
      return;
    }

    navigate("/payment");
  };

  // Menampilkan modal
  const openModal = (asset) => {
    setSelectedasset(asset);
    setModalIsOpen(true);
  };

  // Menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedasset(null);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 ">
      <div className="w-full shadow-md bg-primary-100 dark:text-primary-100 relative z-40 ">
        <div className="pt-[50px] sm:pt-[70px] md:pt-[70px] lg:pt-[70px] xl:pt-[70px] 2xl:pt-[70px] w-full">
          <HeaderNav />
        </div>
        <NavbarSection />
      </div>

      <div className="w-full p-12 mx-auto">
        {alertLikes && (
          <div className="alert flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md animate-fade-in">
            <AiOutlineInfoCircle className="w-6 h-6 mr-2" />
            <span className="block sm:inline">{alertLikes}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setAlertLikes(false)}>
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M14.348 14.849a1 1 0 01-1.415 0L10 11.414 6.707 14.707a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 010 1.415z" />
              </svg>
            </button>
          </div>
        )}
        <h1 className="text-2xl font-semibold text-neutral-10 dark:text-primary-100  pt-[100px] ">
          All Category
        </h1>
      </div>
      <div className=" pt-[10px] w-full p-[20px] sm:p-[20px] md:p-[30px] lg:p-[40px] xl:p-[50px] 2xl:p-[60px] ">
        {/* Body section */}
        <div className="mb-4 mx-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 place-items-center gap-[40px] sm:gap-[30px] md:gap-[120px] lg:gap-[130px] xl:gap-[25px] 2xl:gap-[30px] -space-x-0   sm:-space-x-[30px] md:space-x-[20px] lg:space-x-[40px] xl:-space-x-[0px] 2xl:-space-x-[30px] ">
          {AssetsData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            return (
              <div
                key={data.id}
                className="w-[140px] h-[155px] ssm:w-[165px] ssm:h-[180px] sm:w-[180px] sm:h-[205px] md:w-[180px] md:h-[215px] lg:w-[260px] lg:h-[295px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group ">
                {/* image section */}
                <div className="w-[140px] h-[73px] ssm:w-[165px] ssm:h-[98px] sm:w-[180px] sm:h-[113px] md:w-[180px] md:h-[95px] lg:w-[260px] lg:h-[183px]">
                  <img
                    src={data.datasetImage || CustomImage}
                    alt="Image"
                    className="h-full w-full overflow-hidden relative rounded-t-[10px] mx-auto border-none max-h-full cursor-pointer"
                    onClick={() => openModal(data)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CustomImage;
                    }}
                  />
                </div>

                {/* details section */}
                <div className="flex-col justify-start px-4 py-2 sm:p-4">
                  <p className="text-[9px] text-neutral-20 font-light dark:text-primary-100">
                    {data.datasetName}
                  </p>
                  <h4 className="text-neutral-10 text-[9px] ssm:text-[11px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-semibold dark:text-primary-100">
                    {data.description}
                  </h4>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleLikeClick(data.id, likesAsset)}
                      className="flex justify-start items-center mr-2">
                      {likedByCurrentUser ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-neutral-10 text-[11px] sm:text-[14px] dark:text-primary-100 " />
                      )}
                      <p className="ml-2 text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                        ({likesAsset})
                      </p>
                    </button>
                    <p className="flex justify-end w-full text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      Rp. {data.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal untuk detail asset */}
      {modalIsOpen && selectedasset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-neutral-10 bg-opacity-50"></div>
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] sm:w-[700px] md:w-[700px] lg:w-[700px] xl:w-[700px] 2xl:w-[700px] mx-4 flex relative">
            <button
              className=" absolute top-1 right-4 text-gray-600 dark:text-gray-400 text-4xl"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedasset.datasetImage || CustomImage}
              alt="asset Image"
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4 ">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-100">
                {selectedasset.datasetName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Rp. {selectedasset.price.toLocaleString("id-ID")}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4">
                <label className="flex-col mt-2">Deskripsi Video:</label>
                <div className="mt-2">{selectedasset.description}</div>
              </div>

              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Kategori: {selectedasset.category}
              </p>
              <button
                onClick={() => handleAddToCart(selectedasset)}
                className="flex p-2 text-center items-center justify-center bg-neutral-60 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-10 rounded-md">
                <img src={IconCart} alt="Cart Icon" className="w-6 h-6 mr-2" />
                <p>Tambahkan Ke Keranjang</p>
              </button>
              <button
                onClick={() => handleBuyNow(selectedasset)}
                className="flex p-2 text-center items-center justify-center bg-secondary-40 text-primary-100 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-6 rounded-md">
                <img
                  src={IconDollar}
                  alt="Cart Icon"
                  className="w-6 h-6 mr-2 -ml-24"
                />
                <p>Beli Sekarang</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className=" min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[10px] sm:text-[12px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All right reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
}
