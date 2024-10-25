import { db } from "../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  runTransaction,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderNav from "../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";
import IconDollar from "../../../assets/assetWeb/iconDollarLight.svg";
import IconCart from "../../../assets/assetWeb/iconCart.svg";
import { useNavigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";

export function AssetVideo() {
  const navigate = useNavigate();
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedasset, setSelectedasset] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [purchasedAssets, setPurchasedAssets] = useState(new Set());
  const [validationMessage, setValidationMessage] = useState("");

  // Mengambil ID pengguna saat ini (jika ada)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Menyimpan ID pengguna saat ini
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Mengambil data asset dari Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "assetVideos"),
      (snapshot) => {
        const Assets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredAssets = Assets.filter((asset) => asset.price > 0);
        setAssetsData(filteredAssets);
      }
    );

    return () => unsubscribe();
  }, []);

  // Mengambil aset yang telah dibeli oleh pengguna
  useEffect(() => {
    const fetchUserPurchasedAssets = async () => {
      if (!currentUserId) return;

      const purchasedQuery = query(
        collection(db, "buyAssets"),
        where("boughtBy", "==", currentUserId)
      );

      try {
        const purchasedSnapshot = await getDocs(purchasedQuery);
        const purchasedIds = new Set();

        purchasedSnapshot.forEach((doc) => {
          purchasedIds.add(doc.data().assetId);
        });

        setPurchasedAssets(purchasedIds);
      } catch (error) {
        console.error("Error fetching purchased assets: ", error);
      }
    };

    fetchUserPurchasedAssets();
  }, [currentUserId]);

  // Mengambil data likes
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!currentUserId) return;

      const likesQuery = query(
        collection(db, "likes"),
        where("userId", "==", currentUserId)
      );

      try {
        const likesSnapshot = await getDocs(likesQuery);
        const userLikes = new Set();

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

  // Mengfilter hasil pencarian
  useEffect(() => {
    if (searchTerm) {
      const results = AssetsData.filter((asset) =>
        asset.videoName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(AssetsData);
    }
  }, [searchTerm, AssetsData]);

  const handleLikeClick = async (assetId, currentLikes) => {
    if (isProcessingLike) return;

    if (!currentUserId) {
      setAlertLikes("Anda perlu login untuk menyukai Asset ini");
      setTimeout(() => setAlertLikes(false), 3000);
      return;
    }

    setIsProcessingLike(true);

    const assetRef = doc(db, "assetVideos", assetId);
    const likeRef = doc(db, "likes", `${currentUserId}_${assetId}`);

    try {
      await runTransaction(db, async (transaction) => {
        const newLikedAssets = new Set(likedAssets);
        let newLikesAsset;
        if (newLikedAssets.has(assetId)) {
          transaction.delete(likeRef);
          newLikesAsset = Math.max(0, currentLikes - 1);
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.delete(assetId);
        } else {
          transaction.set(likeRef, {
            userId: currentUserId,
            assetId: assetId,
          });
          newLikesAsset = currentLikes + 1;
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.add(assetId);
        }
        setLikedAssets(newLikedAssets);
      });
    } catch (error) {
      console.error("Error updating likes: ", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  // const validateAddToCart = (assetId) => {
  //   if (!currentUserId) {
  //     setValidationMessage(
  //       "Anda perlu login untuk menambahkan asset ke keranjang."
  //     );
  //     return false;
  //   }
  //   if (purchasedAssets.has(assetId)) {
  //     setValidationMessage(
  //       "Anda sudah membeli asset ini dan tidak bisa menambahkannya ke keranjang."
  //     );
  //     return false;
  //   }
  //   return true; // Validasi berhasil
  // };

  const handleAddToCart = async (selectedasset) => {
    if (!currentUserId) {
      alert("Anda perlu login untuk menambahkan asset ke keranjang");
      navigate("/login");
      return;
    }

    if (purchasedAssets.has(selectedasset.id)) {
      alert(
        "Anda sudah membeli asset ini dan tidak bisa menambahkannya ke keranjang."
      );
      return;
    }

    const cartRef = doc(
      db,
      "cartAssets",
      `${currentUserId}_${selectedasset.id}`
    );
    const cartSnapshot = await getDoc(cartRef);
    if (cartSnapshot.exists()) {
      alert("Anda sudah menambahkan asset ini ke keranjang.");
      return;
    }

    const { id, videoName, description, price, uploadUrlVideo, category } =
      selectedasset;

    const missingFields = [];
    if (!videoName) missingFields.push("videoName");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!uploadUrlVideo) missingFields.push("uploadUrlVideo");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      console.error("Missing fields in selected asset:", missingFields);
      alert(`Missing fields: ${missingFields.join(", ")}. Please try again.`);
      return;
    }

    try {
      await setDoc(cartRef, {
        userId: currentUserId,
        assetId: id,
        videoName: videoName,
        description: description,
        price: price,
        uploadUrlVideo: uploadUrlVideo,
        category: category,
      });
      alert("Asset berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Error adding to cart: ", error);
      alert(
        "Terjadi kesalahan saat menambahkan asset ke keranjang. Silakan coba lagi."
      );
    }
  };

  const handleBuyNow = async () => {
    if (!currentUserId) {
      alert("Anda perlu login untuk membeli asset");
      navigate("/login");
      return;
    }

    if (purchasedAssets.has(selectedasset.id)) {
      alert(
        "Anda sudah membeli asset ini dan tidak bisa menambahkannya ke keranjang."
      );
      return;
    }

    navigate("/payment");
  };

  const openModal = (asset) => {
    setSelectedasset(asset);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedasset(null);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 ">
      <div className="w-full shadow-lg bg-primary-100 dark:text-primary-100 relative z-40 ">
        <div className="-mt-10 pt-[2px] sm:pt-[60px] md:pt-[70px] lg:pt-[70px] xl:pt-[70px] 2xl:pt-[70px] w-full">
          <HeaderNav />
        </div>
        <div className="mt-0 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
          <NavbarSection />
        </div>
      </div>

      <div className="absolute ">
        <div className="bg-primary-100 sm:bg-none md:bg-none lg:bg-none xl:bg-none 2xl:bg-none fixed  left-[50%] sm:left-[40%] md:left-[45%] lg:left-[47%] xl:left-[40%] 2xl:left-[50%] transform -translate-x-1/2 z-20 sm:z-40 md:z-40 lg:z-40 xl:z-40 2xl:z-40  flex justify-center top-[146px] sm:top-[20px] md:top-[20px] lg:top-[20px] xl:top-[20px] 2xl:top-[20px] w-[550px] sm:w-[300px] md:w-[300px] lg:w-[500px] xl:w-[700px] 2xl:w-[1200px]">
          <div className="justify-center">
            <form
              className=" mx-auto px-20  w-[470px] sm:w-[400px] md:w-[400px] lg:w-[700px] xl:w-[800px] 2xl:w-[1200px]"
              onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <div className="relative">
                  <input
                    type="search"
                    id="location-search"
                    className="block w-full p-4 pl-24 placeholder:pr-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder="Search assets..."
                    required
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-8 flex items-center text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-6 h-6 mx-auto"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </span>
                  <span className="absolute inset-y-0 left-20 flex items-center text-neutral-20 dark:text-neutral-20 text-[20px]">
                    |
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          {searchResults.length === 0 && searchTerm && (
            <p className="text-black text-[20px]">No assets found</p>
          )}
        </div>
      </div>

      {/* Menampilkan pesan validasi */}
      {validationMessage && (
        <div className="alert flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md animate-fade-in">
          <AiOutlineInfoCircle className="w-6 h-6 mr-2" />
          <span>{validationMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setValidationMessage("")}>
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

      <div className="w-full p-12 mx-auto">
        {alertLikes && (
          <div className="alert flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md animate-fade-in">
            <AiOutlineInfoCircle className="w-6 h-6 mr-2" />
            <span>{alertLikes}</span>
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
        <h1 className="text-2xl font-semibold text-neutral-10 dark:text-primary-100 pt-[100px]">
          All Category
        </h1>
      </div>
      <div className="pt-2 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="mb-4 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 ">
          {searchResults.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            const isPurchased = purchasedAssets.has(data.id);
            return (
              <div
                key={data.id}
                className="w-full max-w-[280px] h-[220px] sm:w-[150px] sm:h-[215px] md:w-[180px] md:h-[230px] lg:h-[280px] xl:w-[240px] xl:h-[320px] 2xl:w-[280px] 2xl:h-[400px]  bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between relative rounded-lg shadow-lg">
                <div className="w-full flex-shrink-0 h-[100px] sm:h-[100px] md:h-[110px] lg:h-[150px] xl:h-[200px] relative ">
                  <video
                    src={data.uploadUrlVideo}
                    alt="Video Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-t-md"
                    onClick={() => openModal(data)}
                    controls
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CustomImage;
                    }}>
                    Your browser does not support the video tag.
                  </video>
                </div>
                {isPurchased && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Sudah Dibeli
                  </div>
                )}

                <div className="flex flex-col justify-between h-full p-2 sm:p-4">
                  <div>
                    <p className="text-xs text-neutral-10 font-semibold dark:text-primary-100">
                      {data.videoName}
                    </p>
                    <h4 className="text-neutral-20 text-xs sm:text-sm lg:text-base dark:text-primary-100">
                      {data.description.length > 24
                        ? `${data.description.substring(0, 24)}......`
                        : data.description}
                    </h4>
                  </div>
                  <div className="flex justify-between items-center mt-2 sm:mt-4">
                    <button
                      onClick={() => handleLikeClick(data.id, likesAsset)}
                      className="flex items-center">
                      {likedByCurrentUser ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-neutral-10 text-xs sm:text-sm" />
                      )}
                      <p className="ml-1 text-xs sm:text-sm">({likesAsset})</p>
                    </button>
                    <p className="text-xs sm:text-sm lg:text-base">
                      {data.price % 1000 === 0 && data.price >= 1000
                        ? `Rp. ${(data.price / 1000).toLocaleString("id-ID")}k`
                        : `Rp. ${data.price.toLocaleString("id-ID")}`}
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
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] mx-4 flex relative">
            <button
              className="absolute top-1 right-3 text-gray-600 dark:text-gray-400 text-2xl"
              onClick={closeModal}>
              {/* Menutup modal tanpa refresh */}
              &times;
            </button>
            <div className="flex-1 flex items-center justify-center mb-4">
              <video
                src={selectedasset.uploadUrlVideo || CustomImage}
                alt="Asset Image"
                className="w-full h-[300px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = CustomImage;
                }}
              />
            </div>
            <div className="flex-1 pl-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-100">
                {selectedasset.videoName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100">
                Rp. {selectedasset.price.toLocaleString("id-ID")}
              </p>
              <label className="flex-col mt-2">Deskripsi Video:</label>
              <div className="mt-2 text-sm mb-2 dark:text-primary-100">
                {selectedasset.description}
              </div>
              <p className="text-sm mb-2 dark:text-primary-100">
                Kategori: {selectedasset.category}
              </p>
              <div className="mt-32">
                <button
                  onClick={() => handleAddToCart(selectedasset)} // Menambah ke keranjang tanpa refresh
                  className={`flex p-2 text-center items-center justify-center bg-neutral-60 w-full h-10 rounded-md ${
                    purchasedAssets.has(selectedasset.id)
                      ? "bg-gray-400 pointer-events-none"
                      : "bg-neutral-60"
                  }`}
                  disabled={purchasedAssets.has(selectedasset.id)}>
                  <img
                    src={IconCart}
                    alt="Cart Icon"
                    className="w-6 h-6 mr-2"
                  />
                  <p>Tambahkan Ke Keranjang</p>
                </button>
                <button
                  onClick={() => handleBuyNow(selectedasset)} // Aksi beli tanpa refresh
                  className={`flex p-2 text-center items-center justify-center w-full h-10 mt-2 rounded-md ${
                    purchasedAssets.has(selectedasset.id)
                      ? "bg-gray-400 pointer-events-none"
                      : "bg-secondary-40"
                  }`}
                  disabled={purchasedAssets.has(selectedasset.id)}>
                  <img
                    src={IconDollar}
                    alt="Dollar Icon"
                    className="w-6 h-6 mr-2"
                  />
                  <p>Beli Sekarang</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[10px] sm:text-[12px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All rights reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
}