import { db } from "../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  query,
  where,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderNav from "../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../website/web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";
import IconDownload from "../../../assets/icon/iconDownload/iconDownload.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";

const HomePage = () => {
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State untuk modal
  const [selectedAsset, setSelectedAsset] = useState(null); // Aset yang dipilih untuk modal

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

  const fetchAssets = async () => {
    const collectionsFetch = [
      "assetAudios",
      "assetImages",
      "assetDatasets",
      "assetImage2D",
      "assetImage3D",
      "assetVideos",
    ];

    try {
      const allAssets = await Promise.all(
        collectionsFetch.map(async (collectionName) => {
          const snapshot = await getDocs(collection(db, collectionName));
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            collectionName,
            ...doc.data(),
          }));
        })
      );

      const groupedAssets = allAssets.flat().reduce((acc, asset) => {
        const collection = asset.collectionName;
        if (!acc[collection]) {
          acc[collection] = [];
        }
        acc[collection].push(asset);
        return acc;
      }, {});

      setAssetsData(groupedAssets);
    } catch (error) {
      console.error("Error fetching assets: ", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

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
          userLikes.add(doc.data().id);
        });

        setLikedAssets(userLikes);
      } catch (error) {
        console.error("Error fetching likes: ", error);
      }
    };

    fetchUserLikes();
  }, [currentUserId]);

  const handleLikeClick = async (id, currentLikes, collectionsFetch) => {
    if (isProcessingLike) return;

    if (!currentUserId) {
      setAlertLikes("Anda perlu login untuk menyukai Asset ini");
      setTimeout(() => {
        setAlertLikes(false);
      }, 3000);
      return;
    }

    setIsProcessingLike(true);

    if (!collectionsFetch) {
      console.error("collectionsFetch is empty. Cannot proceed with liking.");
      setIsProcessingLike(false);
      return;
    }

    const assetRef = doc(db, collectionsFetch, id);
    const likeRef = doc(db, "likes", `${currentUserId}_${id}`);

    try {
      await runTransaction(db, async (transaction) => {
        const newLikedAssets = new Set(likedAssets);
        let newLikesAsset;

        if (newLikedAssets.has(id)) {
          transaction.delete(likeRef);
          newLikesAsset = Math.max(0, currentLikes - 1);
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.delete(id);
        } else {
          transaction.set(likeRef, {
            userId: currentUserId,
            id: id,
            collectionsFetch: collectionsFetch,
          });
          newLikesAsset = currentLikes + 1;
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.add(id);
        }

        setLikedAssets(newLikedAssets);
      });
      await fetchAssets();
    } catch (error) {
      console.error("Error updating likes: ", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  // Fungsi untuk membuka modal
  const openModal = (asset) => {
    setSelectedAsset(asset);
    setModalIsOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <HeaderNav />
      <NavbarSection />
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
        <h1 className="text-2xl font-semibold text-neutral-10 dark:text-primary-100 pt-[100px]">
          All Asset
        </h1>
        {Object.entries(AssetsData).map(([collectionName, assets]) => (
          <div key={collectionName} className="mb-4">
            <h2 className="text-xl font-semibold mb-2 capitalize">
              {collectionName.replace("asset", "")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {assets.map((data) => {
                const likesAsset = data.likeAsset || 0;
                const likedByCurrentUser = likedAssets.has(data.id);
                return (
                  <div
                    key={data.id}
                    className="w-[180px] shadow-md bg-primary-100 dark:bg-neutral-25"
                    onClick={() => openModal(data)} // Buka modal saat diklik
                  >
                    <img
                      src={data.thumbnailAsset || CustomImage}
                      alt={data.assetName}
                      className="h-[140px] w-full rounded-t-md"
                    />
                    <div className="p-2">
                      <p className="text-sm font-semibold">
                        {data.assetName || "Unnamed Asset"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah modal terbuka saat menyukai
                            handleLikeClick(
                              data.id,
                              likesAsset,
                              collectionName
                            );
                          }}>
                          {likedByCurrentUser ? (
                            <FaHeart className="text-red-600" />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span>({likesAsset})</span>
                        </button>
                        <span>Rp {data.price.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal untuk detail asset
      {modalIsOpen && selectedAsset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-neutral-10 bg-opacity-50"></div>
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] mx-4 flex relative">
            <button
              className="absolute top-1 right-3 text-gray-600 dark:text-gray-400 text-2xl"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedAsset.datasetImage || CustomImage}
              alt="asset Image"
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-100">
                {selectedAsset.datasetName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Rp. {selectedAsset.price.toLocaleString("id-ID")}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4">
                <label className="flex-col mt-2">Deskripsi Video:</label>
                <div className="mt-2">{selectedAsset.description}</div>
              </div>

              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Kategori: {selectedAsset.category}
              </p>
              <button className="flex p-2 text-center items-center justify-center bg-neutral-60 w-48 h-10 mt-10 rounded-md">
                <img
                  src={IconDownload}
                  alt="Cart Icon"
                  className="w-6 h-6 mr-2"
                />
                <p>Unduh</p>
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal untuk detail asset */}
      {modalIsOpen && selectedAsset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-neutral-10 bg-opacity-50"></div>
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] mx-4 flex relative">
            <button
              className="absolute top-1 right-3 text-gray-600 dark:text-gray-400 text-2xl"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedAsset.datasetImage || CustomImage}
              alt="asset Image"
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-100">
                {selectedAsset.datasetName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Rp. {selectedAsset.price.toLocaleString("id-ID")}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4">
                <label className="flex-col mt-2">Deskripsi Video:</label>
                <div className="mt-2">{selectedAsset.description}</div>
              </div>

              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Kategori: {selectedAsset.category}
              </p>

              {/* Cek apakah harga 0 (gratis) */}
              {selectedAsset.price === 0 ? (
                <button className="flex p-2 text-center items-center justify-center bg-neutral-60 w-48 h-10 mt-10 rounded-md">
                  <img
                    src={IconDownload}
                    alt="Download Icon"
                    className="w-6 h-6 mr-2"
                  />
                  <p>Unduh</p>
                </button>
              ) : (
                <div className="flex space-x-4 mt-10">
                  <button className="flex p-2 text-center items-center justify-center bg-neutral-60 w-48 h-10 rounded-md">
                    <img
                      src={IconDownload}
                      alt="Add to Cart Icon"
                      className="w-6 h-6 mr-2"
                    />
                    <p>Tambah ke Keranjang</p>
                  </button>
                  <button className="flex p-2 text-center items-center justify-center bg-green-600 w-48 h-10 rounded-md text-white">
                    <p>Beli Sekarang</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
