/* eslint-disable no-unused-vars */
import { db } from "../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  query,
  where,
  runTransaction,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderNav from "../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";
import IconDownload from "../../../assets/icon/iconDownload/iconDownload.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Footer from "../../website/Footer/Footer";

export function AssetGratis() {
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedasset, setSelectedasset] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const myAssetsCollectionRef = collection(db, "myAssets");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Mengambil ID pengguna saat ini (jika ada)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        // console.log("Current User ID:", user.uid); // Tambahkan log di sini
      } else {
        setCurrentUserId(null);
        // console.log("Current User ID is null"); // Tambahkan log saat tidak ada user
      }
    });

    return () => unsubscribe();
  }, []); // Tidak ada dependensi karena ini hanya perlu dijalankan sekali

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
      const combinedAssets = allAssets.flat();
      const filteredAssets = combinedAssets.filter(
        (asset) => parseFloat(asset.price) === 0
      );
      setAssetsData(filteredAssets);
    } catch (error) {
      // console.error("Error fetching assets: ", error);
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
        // console.error("Error fetching likes: ", error);
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
      // console.error("Error updating likes: ", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleSaveToMyAssets = async () => {
    // Periksa apakah currentUserId dan selectedasset ada
    if (!currentUserId || !selectedasset) {
      alert("Anda perlu login untuk menyimpan Asset ini.");
      return;
    }

    // Log untuk memverifikasi currentUserId
    // console.log("Current User ID:", currentUserId);
    // console.log("Selected Asset:", selectedasset);

    // Buat data asset baru dengan userId yang sesuai
    const newAssetData = {
      ...selectedasset,
      userId: currentUserId,
      savedAt: new Date(),
    };

    // Log untuk memverifikasi data yang akan disimpan
    // console.log("Asset Data to Save:", newAssetData);

    try {
      // Cek apakah asset sudah ada di myAssets
      const querySnapshot = await getDocs(
        query(
          myAssetsCollectionRef,
          where("userId", "==", currentUserId),
          where("id", "==", selectedasset.id)
        )
      );

      if (!querySnapshot.empty) {
        // Asset sudah ada, tampilkan peringatan
        alert("Asset ini sudah disimpan ke My Asset!");
        return;
      }

      // Menambahkan dokumen baru dengan addDoc
      const docRef = await addDoc(myAssetsCollectionRef, newAssetData);

      // console.log("Document written with ID: ", docRef.id);
      alert("Asset telah disimpan ke My Asset!");
      closeModal();
    } catch (error) {
      // console.error("Error saving asset to My Assets: ", error);
      alert("Terjadi kesalahan saat menyimpan asset.");
    }
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

  // Filter berdasarkan pencarian
  const filteredAssetsData = AssetsData.filter((asset) => {
    const datasetName =
      asset.assetAudiosName ||
      asset.audioName ||
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
        <div className="bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 sm:bg-none md:bg-none lg:bg-none xl:bg-none 2xl:bg-none fixed  left-[50%] sm:left-[40%] md:left-[45%] lg:left-[50%] xl:left-[47%] 2xl:left-[50%] transform -translate-x-1/2 z-20 sm:z-40 md:z-40 lg:z-40 xl:z-40 2xl:z-40  flex justify-center top-[193px] sm:top-[20px] md:top-[20px] lg:top-[20px] xl:top-[20px] 2xl:top-[20px] w-full sm:w-[250px] md:w-[200px] lg:w-[400px] xl:w-[600px] 2xl:w-[1200px]">
          <div className="justify-center">
            <form
              className=" mx-auto px-20  w-[570px] sm:w-[430px] md:w-[460px] lg:w-[650px] xl:w-[850px] 2xl:w-[1200px]"
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

        <h1 className="text-2xl font-semibold text-neutral-10 dark:text-primary-100 pt-[100px] -ml-10">
          All Category
        </h1>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          {searchResults.length === 0 && searchTerm && (
            <p className="text-black text-[20px]">No assets found</p>
          )}
        </div>
      </div>
      <div className="pt-2 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 min-h-screen ">
        <div className="mb-4 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 ">
          {filteredAssetsData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            let collectionsToFetch = "";
            if (data.assetAudiosName) {
              collectionsToFetch = "assetAudios";
            }
            if (data.audioName) {
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
                className="w-[140px] h-[230px] ssm:w-[165px] ssm:h-[230px] sm:w-[180px] sm:h-[250px] md:w-[180px] md:h-[260px] lg:w-[210px] lg:h-[300px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between">
                <div
                  onClick={() => openModal(data)}
                  className="w-[140px] h-[200px] ssm:w-[165px] ssm:h-[230px] sm:w-[180px] sm:h-[250px] md:w-[180px] md:h-[260px] lg:w-[210px] lg:h-[300px] rounded-[10px] bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between">
                  <div className="w-full h-[130px] relative">
                    {data.uploadUrlVideo ? (
                      <video
                        src={data.uploadUrlVideo}
                        alt="Asset Video"
                        className="h-full w-full object-cover rounded-t-[10px] border-none"
                        onContextMenu={(e) => e.preventDefault()}
                        controls
                        controlsList="nodownload"
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
                          data.datasetThumbnail ||
                          data.asset2DThumbnail ||
                          data.asset3DThumbnail ||
                          data.audioThumbnail ||
                          CustomImage
                        }
                        alt="Asset Image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CustomImage;
                        }}
                        className="h-full w-full object-cover rounded-t-[10px] border-none"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full p-2 sm:p-4">
                  <div onClick={() => openModal(data)} className="px-2 py-2">
                    <p className="text-xs text-neutral-10 font-semibold dark:text-primary-100">
                      {(
                        data.assetAudiosName ||
                        data.audioName ||
                        data.datasetName ||
                        data.asset2DName ||
                        data.imageName ||
                        data.videoName ||
                        "Nama Tidak Tersedia"
                      ).substring(0, 14)}
                      {(
                        data.assetAudiosName ||
                        data.audioName ||
                        data.datasetName ||
                        data.asset2DName ||
                        data.imageName ||
                        data.videoName ||
                        "Nama Tidak Tersedia"
                      ).length > 14
                        ? "..."
                        : ""}
                    </p>

                    <p className="text-neutral-20 text-[8px] sm:text-[11px] md:text-[10px] lg:text-[12px] xl:text-[14px]  dark:text-primary-100">
                      {data.description.length > 32
                        ? `${data.description.substring(0, 32)}......`
                        : data.description || "Deskripsi Tidak Tersedia"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-2 py-2   dark:bg-neutral-80">
                    <button
                      onClick={() =>
                        handleLikeClick(data.id, likesAsset, collectionsToFetch)
                      }
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

                    <p className="text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      {data.price % 1000 === 0 && data.price >= 1000
                        ? `Rp. ${(data.price / 1000).toLocaleString("id-ID")}k`
                        : "Free"}
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
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-full sm:w-[400px] md:w-[500px] lg:w-[550px] xl:w-[600px] 2xl:w-[750px] mx-4 flex flex-col relative">
            <button
              className="absolute top-1 right-4 text-gray-600 dark:text-gray-400 text-4xl"
              onClick={closeModal}>
              &times;
            </button>
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-full h-[200px] sm:h-[200px] md:h-[200px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] aspect-[16/9] sm:aspect-[4/3] relative mt-4">
                {selectedasset.uploadUrlVideo ? (
                  <video
                    src={selectedasset.uploadUrlVideo}
                    alt="Asset Video"
                    className="w-full h-full object-cover"
                    onContextMenu={(e) => e.preventDefault()}
                    controls
                    controlsList="nodownload"
                  />
                ) : (
                  <img
                    src={
                      selectedasset.image ||
                      selectedasset.uploadUrlImage ||
                      selectedasset.datasetImage ||
                      selectedasset.assetAudiosImage ||
                      selectedasset.asset2DImage ||
                      selectedasset.asset3DImage ||
                      (selectedasset.video ? CustomImage : null) ||
                      selectedasset.datasetThumbnail ||
                      selectedasset.asset2DThumbnail ||
                      selectedasset.asset3DThumbnail ||
                      selectedasset.audioThumbnail ||
                      CustomImage
                    }
                    alt="Asset Image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CustomImage;
                    }}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="w-full mt-4 text-center sm:text-left max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <h2 className="text-md mb-2 dark:text-primary-100 mt-4 text-start font-semibold">
                {selectedasset.datasetName ||
                  selectedasset.assetAudiosName ||
                  selectedasset.audioName ||
                  selectedasset.datasetName ||
                  selectedasset.asset2DName ||
                  selectedasset.imageName ||
                  selectedasset.videoName ||
                  "No Name"}
              </h2>

              <p className="text-sm mb-2 dark:text-primary-100 mt-4 text-start ">
                Kategori: {selectedasset.category}
              </p>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4 text-start ">
                {selectedasset.price > 0
                  ? `Rp ${selectedasset.price.toLocaleString("id-ID")}`
                  : "Free"}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4 text-justify ">
                <label className="flex-col mt-2">Deskripsi Video:</label>
                <div className="mt-2">{selectedasset.description}</div>
              </div>

              <button
                className="text-primary-100 flex p-2 text-center items-center justify-center bg-neutral-60 h-10 mt-14 rounded-md w-full"
                onClick={handleSaveToMyAssets}>
                <img
                  src={IconDownload}
                  alt="Cart Icon"
                  className="w-6 h-6 mr-2"
                />
                <p>Simpan ke My Asset</p>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative -mt-60 flex items-center justify-center">
        <div className="text-center">
          {searchResults.length === 0 && searchTerm && (
            <p className="text-black text-[20px]">No assets found</p>
          )}
        </div>
      </div>

      <div className="mt-96">
        <Footer />
      </div>
    </div>
  );
}

export default AssetGratis;
