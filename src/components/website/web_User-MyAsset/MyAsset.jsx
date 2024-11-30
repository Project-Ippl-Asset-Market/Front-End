/* eslint-disable no-unused-vars */
import { db } from "../../../firebase/firebaseConfig";
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
import HeaderNav from "../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Footer from "../../website/Footer/Footer";
import IconDownload from "../../../assets/icon/iconHeader/iconMyasset.svg";

export function MyAsset() {
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedasset, setSelectedasset] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    const buyAssetsCollection = "buyAssets";
    const myAssetsCollection = "myAssets";

    try {
      const buyAssetsSnapshot = await getDocs(
        query(
          collection(db, buyAssetsCollection),
          where("userId", "==", currentUserId)
        )
      );

      const buyAssetsData = buyAssetsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Data buyAssets:", buyAssetsData); // Debugging

      const myAssetsSnapshot = await getDocs(
        query(
          collection(db, myAssetsCollection),
          where("userId", "==", currentUserId)
        )
      );

      const myAssetsData = myAssetsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Data myAssets:", myAssetsData); // Debugging

      // Gabungkan data dari kedua koleksi
      const allFilteredAssets = [...buyAssetsData, ...myAssetsData];
      console.log("Gabungan data assets:", allFilteredAssets); // Debugging

      setAssetsData(allFilteredAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchAssets();
    }
  }, [currentUserId]);

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
      asset.audioName ||
      asset.imageName ||
      asset.asset2DName ||
      asset.asset3DName ||
      asset.videoName ||
      asset.name;
    ("");
    return (
      datasetName &&
      datasetName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Function to validate asset fields
  const downloadAsset = async (asset) => {
    try {
      const fileUrl =
        asset.uploadUrlAudio ||
        asset.uploadUrlVideo ||
        asset.uploadUrlImage ||
        asset.datasetImage ||
        asset.asset2DFile ||
        asset.asset3DFile ||
        asset.image;

      const fileName =
        asset.audioName ||
        asset.videoName ||
        asset.imageName ||
        asset.asset2DName ||
        asset.asset3DName ||
        asset.datasetName ||
        asset.name ||
        "asset";

      const type = asset.uploadUrlVideo
        ? "video"
        : asset.uploadUrlImage || asset.image
        ? "image"
        : "other";

      if (!fileUrl || !type) {
        alert("File atau tipe tidak tersedia untuk diunduh.");
        return;
      }

      const size = asset.size || "No Size";

      const allowedSizes = [
        "Large (1920x1280)",
        "Medium (1280x1280)",
        "Small (640x427)",
        "Original (6000x4000)",
        "No Size",
        "SD (360x640)",
        "SD (540x960)",
        "HD (720x1280)",
        "Full HD (1080x1920)",
        "Quad HD (1440x2560)",
        "4K UHD (2160x3840)",
      ];

      if (!allowedSizes.includes(size)) {
        alert("Ukuran tidak valid.");
        return;
      }

      const proxyUrl = `http://localhost:3000/proxy/download?fileUrl=${encodeURIComponent(
        fileUrl
      )}&size=${encodeURIComponent(size)}&type=${encodeURIComponent(type)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gagal mengunduh file. Kode status: ${response.status}. ${errorText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Terjadi kesalahan saat mengunduh file. Silakan coba lagi.");
    }
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
        <div className="bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 sm:bg-none md:bg-none lg:bg-none xl:bg-none 2xl:bg-none fixed  left-[50%] sm:left-[40%] md:left-[45%] lg:left-[50%] xl:left-[47%] 2xl:left-[50%] transform -translate-x-1/2 z-20 sm:z-40 md:z-40 lg:z-40 xl:z-40 2xl:z-40  flex justify-center top-[193px] sm:top-[20px] md:top-[20px] lg:top-[20px] xl:top-[20px] 2xl:top-[20px] w-full sm:w-[250px] md:w-[200px] lg:w-[400px] xl:w-[600px] 2xl:w-[1200px]">
          <div className="justify-center">
            <form
              className=" mx-auto px-20  w-[570px] sm:w-[430px] md:w-[460px] lg:w-[650px] xl:w-[850px] 2xl:w-[1200px]"
              onSubmit={(e) => e.preventDefault()}
            >
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
                      viewBox="0 0 18 18"
                    >
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
              onClick={() => setAlertLikes(false)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M14.348 14.849a1 1 0 01-1.415 0L10 11.414 6.707 14.707a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 010 1.415z" />
              </svg>
            </button>
          </div>
        )}
        <h1 className="text-2xl font-semibold text-neutral-10 dark:text-primary-100  pt-[100px] -ml-10">
          My Asset
        </h1>
      </div>
      <div className="pt-2 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 min-h-screen ">
        <div className="mb-4 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-2 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 ">
          {filteredAssetsData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            let collectionsToFetch = "myAssets";
            if (data.audioName) {
              collectionsToFetch = "myAssets";
            } else if (data.imageName) {
              collectionsToFetch = "myAssets";
            } else if (data.datasetName) {
              collectionsToFetch = "myAssets";
            } else if (data.asset2DName) {
              collectionsToFetch = "myAssets";
            } else if (data.asset3DName) {
              collectionsToFetch = "myAssets";
            } else if (data.videoName) {
              collectionsToFetch = "myAssets";
            } else if (data.name) {
              collectionsToFetch = "buyAssets";
            }

            return (
              <div
                key={data.id}
                className="w-[140px] h-[200px] ssm:w-[165px] ssm:h-[230px] sm:w-[180px] sm:h-[250px] md:w-[180px] md:h-[260px] lg:w-[210px] lg:h-[300px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between"
              >
                <div
                  onClick={() => openModal(data)}
                  className="w-full h-[300px] relative overflow-hidden aspect-video cursor-pointer z-[10]"
                >
                  <div className="w-full h-[150px] relative">
                    {data.uploadUrlVideo ? (
                      <video
                        src={data.uploadUrlVideo || data.image}
                        alt="Asset Video"
                        className="h-full w-full object-cover rounded-t-[10px] border-none"
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <img
                        src={
                          data.uploadUrlAudio ||
                          data.uploadUrlImage ||
                          data.datasetImage ||
                          data.asset2DImage ||
                          data.asset3DImage ||
                          // (data.video ? CustomImage : null) ||
                          data.datasetThumbnail ||
                          data.asset2DThumbnail ||
                          data.asset3DThumbnail ||
                          data.audioThumbnail ||
                          data.image
                        }
                        alt="Asset Image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = data.image;
                        }}
                        className="h-full w-full object-cover rounded-t-[10px] border-none"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full p-2 sm:p-4">
                  <div onClick={() => openModal(data)} className="px-2 py-2">
                    <p className="text-xs text-neutral-10 font-semibold dark:text-primary-100 ">
                      {(
                        data.audioName ||
                        data.datasetName ||
                        data.asset2DName ||
                        data.imageName ||
                        data.videoName ||
                        data.name ||
                        "Nama Tidak Tersedia"
                      ).slice(0, 14) +
                        ((
                          data.audioName ||
                          data.datasetName ||
                          data.asset2DName ||
                          data.imageName ||
                          data.videoName ||
                          "Nama Tidak Tersedia"
                        ).length > 14
                          ? "..."
                          : "")}
                    </p>

                    <p className="text-neutral-20 text-xs sm:text-sm lg:text-base dark:text-primary-100">
                      {data.description.length > 14
                        ? `${data.description.substring(0, 14)}......`
                        : data.description || "Deskripsi Tidak Tersedia"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-2 py-2   dark:bg-neutral-80">
                    <button
                      onClick={() =>
                        handleLikeClick(data.id, likesAsset, collectionsToFetch)
                      }
                      className="flex justify-start items-center mr-2"
                    >
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
                        : "My Asset"}
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
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-full h-[200px] sm:h-[200px] md:h-[200px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] aspect-[16/9] sm:aspect-[4/3] relative mt-4">
                {selectedasset.uploadUrlVideo ? (
                  <video
                    src={selectedasset.uploadUrlVideo || selectedasset.image}
                    alt="Asset Video"
                    className="w-full h-full object-cover"
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <img
                    src={
                      selectedasset.image ||
                      selectedasset.video ||
                      selectedasset.uploadUrlAudio ||
                      selectedasset.uploadUrlImage ||
                      selectedasset.datasetThumbnail ||
                      selectedasset.asset2DThumbnail ||
                      selectedasset.asset3DThumbnail ||
                      selectedasset.audioThumbnail
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
              <h2 className="text-lg sm:text-xl text-neutral-10 font-semibold dark:text-primary-100 text-start">
                {selectedasset.datasetName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4 text-start">
                Kategori: {selectedasset.category}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100  text-start">
                <label className="flex-col mt-2">Deskripsi Asset:</label>
                <div className="mt-2 text-justify">
                  {selectedasset.description}
                </div>
              </div>
            </div>
            <button
              onClick={() => downloadAsset(selectedasset)}
              className="flex p-2 text-center items-center justify-center bg-neutral-60 text-primary-100 w-full h-10 mt-6 rounded-md"
            >
              <img
                src={IconDownload}
                alt="Download Icon"
                className="w-6 h-6 mr-2"
              />
              <p>Download</p>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MyAsset;
