import { db } from "../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderNav from "../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";
import IconDownload from "../../../assets/icon/iconDownload/iconDownload.svg";

import IconDollar from "../../../assets/assetWeb/iconDollarLight.svg";
import IconCart from "../../../assets/assetWeb/iconCart.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedasset, setselectedasset] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const myAssetsCollectionRef = collection(db, "myAssets");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

  const fetchAssets = async () => {
    const collectionsToFetch = [
      "assetAudios",
      "assetImages",
      "assetDatasets",
      "assetImage2D",
      "assetImage3D",
      "assetVideos",
    ];

    try {
      const allAssets = await Promise.all(
        collectionsToFetch.map(async (collectionName) => {
          const snapshot = await getDocs(collection(db, collectionName));
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        })
      );

      const filteredAssets = allAssets.flat();
      filteredAssets.sort((a, b) => (b.likeAsset || 0) - (a.likeAsset || 0));

      setAssetsData(filteredAssets);
    } catch (error) {
      console.error("Error fetching assets: ", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Filter pencarian
  useEffect(() => {
    if (searchTerm) {
      const results = AssetsData.filter(
        (asset) =>
          asset.datasetName &&
          asset.datasetName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(AssetsData);
    }
  }, [searchTerm, AssetsData]);

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

  const handleLikeClick = async (id, currentLikes, collectionsToFetch) => {
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

    const assetRef = doc(db, collectionsToFetch, id);
    const likeRef = doc(db, "likes", `${currentUserId}_${id}`);

    try {
      await runTransaction(db, async (transaction) => {
        const newLikedAssets = new Set(likedAssets);
        let newLikesAsset;
        if (newLikedAssets.has(id)) {
          // Untuk Hapus like
          transaction.delete(likeRef);
          newLikesAsset = Math.max(0, currentLikes - 1);
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.delete(id);
        } else {
          // Untuk Tambah like
          transaction.set(likeRef, {
            userId: currentUserId,
            id: id,
            collectionsToFetch: collectionsToFetch,
          });
          newLikesAsset = currentLikes + 1;
          transaction.update(assetRef, { likeAsset: newLikesAsset });
          newLikedAssets.add(id);
        }

        // Update state setelah transaksi sukses
        setLikedAssets(newLikedAssets);
      });
      await fetchAssets();
    } catch (error) {
      console.error("Error updating likes: ", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleSaveToMyAssets = async () => {
    if (!currentUserId || !selectedasset) {
      alert("Anda perlu login untuk menyimpan Asset ini.");
      return;
    }

    try {
      const assetDocRef = doc(
        myAssetsCollectionRef,
        `${currentUserId}_${selectedasset.id}`
      );
      await setDoc(assetDocRef, {
        userId: currentUserId,
        ...selectedasset,
        savedAt: new Date(),
      });
      alert("Asset telah disimpan ke My Asset!");
      closeModal();
    } catch (error) {
      console.error("Error saving asset to My Assets: ", error);
      alert("Terjadi kesalahan saat menyimpan asset.");
    }
  };

  const handleAddToCart = async (selectedasset) => {
    if (!currentUserId) {
      alert("Anda perlu login untuk menambahkan asset ke keranjang");
      navigate("/login");
      return;
    }

    // Determine the appropriate collection name based on the asset data
    let collectionName = "";
    if (selectedasset.assetAudiosName) {
      collectionName = "assetAudios";
    } else if (selectedasset.asset2DName) {
      collectionName = "assetImage2D";
    } else if (selectedasset.asset3DName) {
      collectionName = "assetImage3D";
    } else if (selectedasset.videoName) {
      collectionName = "assetVideos";
    } else if (selectedasset.imageName) {
      collectionName = "assetImages";
    } else if (selectedasset.datasetName) {
      collectionName = "assetDatasets";
    }

    try {
      const cartRef = doc(
        db,
        "cartAssets",
        `${currentUserId}_${selectedasset.id}`
      );

      // Prepare data for the cart
      const cartData = {
        userId: currentUserId,
        assetId: selectedasset.id,
        datasetName:
          selectedasset.assetAudiosName ||
          selectedasset.imageName ||
          selectedasset.asset2DName ||
          selectedasset.asset3DName ||
          selectedasset.videoName ||
          "",
        description: selectedasset.description,
        price: selectedasset.price,
        datasetImage:
          selectedasset.datasetImage ||
          selectedasset.assetAudiosImage ||
          selectedasset.asset2DImage ||
          selectedasset.asset3DImage ||
          selectedasset.uploadUrlImage ||
          "",
        category: selectedasset.category,
        createdAt: selectedasset.createdAt || new Date(),
        uploadedByEmail: selectedasset.uploadedByEmail || "",
        likeAsset: selectedasset.likeAsset || 0,
        collectionName: collectionName,
      };

      await setDoc(cartRef, cartData);
      alert("Asset berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Error adding to cart: ", error);
    }
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
    setselectedasset(asset);
    setModalIsOpen(true);
  };

  // Menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setselectedasset(null);
  };

  // Filter berdasarkan pencarian
  const filteredAssetsData = AssetsData.filter((asset) => {
    const datasetName =
      asset.assetAudiosName ||
      asset.imageName ||
      asset.asset2DName ||
      asset.asset3DName ||
      asset.videoName ||
      "";
    return (
      datasetName &&
      datasetName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
        <div className="bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 sm:bg-none md:bg-none lg:bg-none xl:bg-none 2xl:bg-none fixed  left-[50%] sm:left-[40%] md:left-[45%] lg:left-[47%] xl:left-[50%] 2xl:left-[50%] transform -translate-x-1/2 z-20 sm:z-40 md:z-40 lg:z-40 xl:z-40 2xl:z-40  flex justify-center top-[146px] sm:top-[20px] md:top-[20px] lg:top-[20px] xl:top-[20px] 2xl:top-[20px] w-[500px] sm:w-[300px] md:w-[300px] lg:w-[500px] xl:w-[600px] 2xl:w-[1200px]">
          <div className="justify-center">
            <form
              className=" mx-auto px-20  w-[470px] sm:w-[400px] md:w-[450px] lg:w-[700px] xl:w-[800px] 2xl:w-[1200px]"
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
      <div className="pt-2 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="mb-4 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 ">
          {filteredAssetsData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            let collectionsToFetch = "";
            if (data.assetAudiosName) {
              collectionsToFetch = "assetAudios";
            } else if (data.imageName) {
              collectionsToFetch = "assetImages";
            } else if (data.datasetName) {
              collectionsToFetch = "assetDatasets";
            } else if (data.asset2DName) {
              collectionsToFetch = "assetImage2D";
            } else if (data.asset3DName) {
              collectionsToFetch = "assetImage3D";
            } else if (data.videoName) {
              collectionsToFetch = "assetVideos";
            }

            return (
              <div
                key={data.id}
                className="w-[140px] h-[200px] ssm:w-[165px] ssm:h-[230px] sm:w-[180px] sm:h-[250px] md:w-[180px] md:h-[260px] lg:w-[190px] lg:h-[300px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between">
                <div
                  onClick={() => openModal(data)}
                  className="w-full h-[73px] ssm:w-full ssm:h-[98px] sm:w-full sm:h-[113px] md:w-full md:h-[120px] lg:w-full lg:h-[183px]    xl:h-full 2xl:h-full ">
                  <div className="w-full h-[150px] relative">
                    {data.uploadUrlVideo ? (
                      <video
                        src={data.uploadUrlVideo}
                        alt="Asset Video"
                        className="h-28 sm:h-28 md:h-36 lg:h-40 xl:h-full 2xl:h-full w-full rounded-t-[10px] mx-auto border-none"
                        controls
                      />
                    ) : (
                      <img
                        src={
                          data.uploadUrlImage ||
                          data.datasetImage ||
                          data.assetAudiosImage ||
                          data.asset2DImage ||
                          data.asset3DImage ||
                          (data.videoName ? CustomImage : null) ||
                          CustomImage
                        }
                        alt="Asset Image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CustomImage;
                        }}
                        className="h-28 sm:h-28 md:h-36 lg:h-40 xl:h-full 2xl:h-full w-full rounded-t-[10px] mx-auto border-none"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full p-2 sm:p-4">
                  <div className="px-2 py-2">
                    <p className="text-[9px] text-neutral-10 font-semibold dark:text-primary-100">
                      {data.assetAudiosName ||
                        data.datasetName ||
                        data.asset2DName ||
                        data.asset3DName ||
                        data.imageName ||
                        data.videoName ||
                        "Nama Tidak Tersedia"}
                    </p>
                    <h4 className="text-neutral-20 text-xs sm:text-sm lg:text-base dark:text-primary-100">
                      {data.description.length > 24
                        ? `${data.description.substring(0, 24)}......`
                        : data.description}
                    </h4>
                  </div>
                  <div className="flex justify-between items-center mt-2 sm:mt-4">
                    <button
                      onClick={() =>
                        handleLikeClick(data.id, likesAsset, collectionsToFetch)
                      }
                      className="flex items-center">
                      {likedByCurrentUser ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-neutral-10 text-[11px] sm:text-[14px] dark:text-primary-100 " />
                      )}
                      <p className="ml-2 text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                        ({likesAsset})
                      </p>
                    </button>
                    <p className="text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      {data.price > 0
                        ? `Rp ${data.price.toLocaleString("id-ID")}`
                        : "Free"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalIsOpen && selectedasset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-neutral-10 bg-opacity-50"></div>
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] mx-4 flex relative ">
            <button
              className="absolute top-1 right-3 text-gray-600 dark:text-gray-400 text-2xl"
              onClick={closeModal}>
              &times;
            </button>
            <div
              onClick={() => openModal(selectedasset)}
              className="flex-1 flex   items-center justify-center mb-4">
              <div className="w-full h-[290px] relative">
                {selectedasset.uploadUrlVideo ? (
                  <video
                    src={selectedasset.uploadUrlVideo}
                    alt="Asset Video"
                    className="w-full h-[300px] object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={
                      selectedasset.uploadUrlImage ||
                      selectedasset.datasetImage ||
                      selectedasset.assetAudiosImage ||
                      selectedasset.asset2DImage ||
                      selectedasset.asset3DImage ||
                      (selectedasset.videoName ? CustomImage : null) ||
                      CustomImage
                    }
                    alt="Asset Image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CustomImage;
                    }}
                    className="w-full h-[300px] object-cover"
                  />
                )}
              </div>
            </div>
            <div className="w-1/2 pl-4 mt-10">
              <p className="text-[9px] text-neutral-10 font-semibold dark:text-primary-100">
                {selectedasset.assetAudiosName ||
                  selectedasset.datasetName ||
                  selectedasset.asset2DName ||
                  selectedasset.asset3DName ||
                  selectedasset.imageName ||
                  selectedasset.videoName ||
                  "Nama Tidak Tersedia"}
              </p>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                {/* {selectedasset.price === 0
                  ? "Free"
                  : `Rp. ${selectedasset.price.toLocaleString("id-ID")}`} */}

                {selectedasset.price > 0
                  ? `Rp ${selectedasset.price.toLocaleString("id-ID")}`
                  : "Free"}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4">
                <label className="flex-col mt-2">Deskripsi:</label>
                <div className="mt-2">{selectedasset.description}</div>
              </div>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Kategori: {selectedasset.category}
              </p>
              <div className="mt-4">
                {selectedasset.price > 0 ? (
                  <>
                    <button
                      onClick={() => handleAddToCart(selectedasset)}
                      className="flex p-2 text-center items-center justify-center bg-neutral-60 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-24 rounded-md">
                      <img
                        src={IconCart}
                        alt="Cart Icon"
                        className="w-6 h-6 mr-2"
                      />
                      <p>Tambahkan Ke Keranjang</p>
                    </button>
                    <button
                      onClick={() => handleBuyNow(selectedasset)}
                      className="flex p-2 text-center items-center justify-center bg-secondary-40 text-primary-100 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-6 rounded-md">
                      <img
                        src={IconDollar}
                        alt="Buy Now Icon"
                        className="w-6 h-6 mr-2"
                      />
                      <p>Beli Sekarang</p>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDownload(selectedasset)}
                    className="flex p-2 text-center items-center justify-center bg-neutral-60 text-primary-100 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-32 rounded-md">
                    <img
                      src={IconDownload}
                      alt="Download Icon"
                      className="w-6 h-6 mr-2"
                    />
                    <p>Download</p>
                  </button>
                )}
              </div>
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

export default HomePage;