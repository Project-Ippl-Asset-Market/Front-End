/* eslint-disable no-unused-vars */
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
  getDoc,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderNav from "../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";
import BannerBG from "../../../assets/assetWeb/BannerBG.png";
import IconDownload from "../../../assets/icon/iconHeader/iconMyasset.svg";
import IconDollar from "../../../assets/assetWeb/iconDollarLight.svg";
import IconCart from "../../../assets/assetWeb/iconCart.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const myAssetsCollectionRef = collection(db, "myAssets");
import Footer from "../../website/Footer/Footer";

export function HomePage() {
  const [AssetsData, setAssetsData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAssets, setLikedAssets] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedasset, setselectedasset] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [purchasedAssets, setPurchasedAssets] = useState(new Set());
  const [validationMessage, setValidationMessage] = useState("");
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

  // Menangani pengambilan aset yang telah dibeli
  useEffect(() => {
    const fetchUserPurchasedAssets = async () => {
      if (!currentUserId) return;

      const purchasedQuery = query(
        collection(db, "buyAssets"),
        where("userId", "==", currentUserId)
      );

      try {
        const purchasedSnapshot = await getDocs(purchasedQuery);
        const purchasedIds = new Set();

        purchasedSnapshot.forEach((doc) => {
          // Menambahkan assetId dari dokumen ke dalam Set
          purchasedIds.add(doc.data().assetId);
        });

        // Mengupdate state dengan assetId yang dibeli
        setPurchasedAssets(purchasedIds);
      } catch (error) {
        console.error("Error fetching purchased assets: ", error);
      }
    };

    fetchUserPurchasedAssets();
  }, [currentUserId]);

  const fetchAssets = async () => {
    const collectionsToFetch = [
      "assetAudios",
      "assetImage2D",
      "assetImage3D",
      "assetDatasets",
      "assetImages",
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

  // Fungsi untuk memvalidasi apakah pengguna dapat menambahkan aset ke keranjang
  const validateAddToCart = (assetId) => {
    if (!currentUserId) {
      setValidationMessage(
        "Anda perlu login untuk menambahkan asset ke keranjang."
      );
      return false;
    }
    if (purchasedAssets.has(assetId)) {
      setValidationMessage(
        "Anda sudah membeli asset ini dan tidak bisa menambahkannya ke keranjang."
      );
      return false;
    }
    return true;
  };

  // Fungsi untuk menambahkan aset ke keranjang
  const handleAddToCart = async (selectedasset) => {
    if (!validateAddToCart(selectedasset.id)) return;

    // Cek apakah userId penjual sama dengan currentUserId
    if (selectedasset.userId === currentUserId) {
      alert("Anda tidak dapat membeli aset yang Anda jual sendiri.");
      return;
    }

    // Ambil userId dari selectedasset dan simpan dalam array
    const userIdFromAsset = [selectedasset.userId];
    console.log("User ID from Asset: ", userIdFromAsset);

    // Membuat referensi dokumen untuk keranjang menggunakan ID aset
    const cartRef = doc(
      db,
      "cartAssets",
      `${currentUserId}_${selectedasset.id}`
    );

    try {
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        setValidationMessage("Anda sudah menambahkan asset ini ke keranjang.");
        return;
      }

      // Menambahkan aset ke keranjang, termasuk userId dari selectedasset
      await setDoc(cartRef, {
        userId: currentUserId,
        assetId: selectedasset.id,
        image:
          selectedasset.asset2DImage ||
          selectedasset.asset3DImage ||
          selectedasset.uploadUrlAudio ||
          selectedasset.datasetImage ||
          selectedasset.uploadUrlImage ||
          selectedasset.uploadUrlVideo ||
          "No Image Asset",
        name:
          selectedasset.audioName ||
          selectedasset.asset2DName ||
          selectedasset.asset3DName ||
          selectedasset.datasetName ||
          selectedasset.imageName ||
          selectedasset.videoName ||
          "No NameAsset",
        description: selectedasset.description,
        price: selectedasset.price,
        category: selectedasset.category,
        assetOwnerID: userIdFromAsset[0],
      });
      alert("Asset berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Error adding to cart: ", error);
      alert("Terjadi kesalahan saat menambahkan aset ke keranjang.");
    }
  };

  // Fungsi untuk menangani pembelian aset
  const handleBuyNow = async (selectedasset) => {
    if (!currentUserId) {
      alert("Anda perlu login untuk menambahkan asset ke keranjang");
      navigate("/login");
      return;
    }

    // Cek apakah userId penjual sama dengan currentUserId
    if (selectedasset.userId === currentUserId) {
      alert("Anda tidak dapat membeli aset yang Anda jual sendiri.");
      return;
    }

    if (purchasedAssets.has(selectedasset.id)) {
      alert(
        "Anda sudah membeli asset ini dan tidak bisa menambahkannya ke keranjang."
      );
      return;
    }

    // Document ID sekarang mengikuti asset ID
    const cartRef = doc(db, "buyNow", ` ${selectedasset.id}`);
    const cartSnapshot = await getDoc(cartRef);
    if (cartSnapshot.exists()) {
      // alert("Anda sudah Membeli Asset ini.");
      return;
    }

    const {
      id,
      uploadUrlVideo,
      uploadUrlImage,
      datasetImage,
      asset2DImage,
      asset3DImage,
      uploadUrlAudio,
      imageName,
      videoName,
      datasetName,
      asset2DName,
      asset3DName,
      audioName,
      description,
      price,
      category,
    } = selectedasset;

    const missingFields = [];
    if (
      !uploadUrlImage &&
      !uploadUrlVideo &&
      !datasetImage &&
      !asset2DImage &&
      !asset3DImage &&
      !uploadUrlAudio
    )
      missingFields.push("image");
    if (
      !videoName &&
      !imageName &&
      !datasetName &&
      !asset2DName &&
      !asset3DName &&
      !audioName
    )
      missingFields.push("name");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(", ")}. Please try again.`);
      return;
    }

    try {
      await setDoc(cartRef, {
        userId: currentUserId,
        assetId: id,
        image:
          asset2DImage ||
          asset3DImage ||
          uploadUrlAudio ||
          uploadUrlVideo ||
          uploadUrlImage ||
          datasetImage ||
          "No Image Asset",
        name:
          videoName ||
          imageName ||
          datasetName ||
          audioName ||
          asset2DName ||
          asset3DName ||
          "No Name Asset",
        description: description,
        price: price,
        category: category,
        assetOwnerID: selectedasset.userId,
      });

      navigate("/buy-now-asset");
    } catch (error) {
      console.error("Error adding to cart: ", error);
      alert(
        "Terjadi kesalahan saat menambahkan asset ke keranjang. Silakan coba lagi."
      );
    }
  };

  // Function to validate asset fields
  const handleSaveToMyAssets = ({
    id,
    uploadUrlVideo,
    uploadUrlImage,
    datasetImage,
    asset2DImage,
    asset3DImage,
    uploadUrlAudio,
    imageName,
    videoName,
    datasetName,
    asset2DName,
    asset3DName,
    audioName,
    description,
    price,
    category,
  }) => {
    const missingFields = [];
    if (
      !uploadUrlImage &&
      !uploadUrlVideo &&
      !datasetImage &&
      !asset2DImage &&
      !asset3DImage &&
      !uploadUrlAudio
    )
      missingFields.push("image");
    if (
      !videoName &&
      !imageName &&
      !datasetName &&
      !asset2DName &&
      !asset3DName &&
      !audioName
    )
      missingFields.push("name");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!category) missingFields.push("category");
    return missingFields;
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
      asset.audioName ||
      asset.asset2DName ||
      asset.asset3DName ||
      asset.datasetName ||
      asset.imageName ||
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
      <div className="bg-primary-100 dark:bg-neutral-20">
        <img
          className="w-[300vh] mt-[142px] sm:mt-[170px] md:mt-[140px] lg:mt-[150px] xl:mt-[150px] 2xl:mt-[130px]"
          src={BannerBG}
          alt="Banner"
        />
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

      {/* Menampilkan pesan validasi jika ada */}
      {validationMessage && (
        <div className="alert flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md animate-fade-in">
          <AiOutlineInfoCircle className="w-6 h-6 mr-2" />
          <span className="block sm:inline">{validationMessage}</span>
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
      <div className="relative  flex items-center justify-center">
        <div className="text-center">
          {searchResults.length === 0 && searchTerm && (
            <p className="text-black text-[20px] mt-40">No assets found</p>
          )}
        </div>
      </div>
      <div className="w-full p-4 mx-auto ">
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
      </div>
      <div className="pt-2  w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14   ">
        <div className=" mb-4 mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 place-items-center gap-4 sm:gap-2 md:gap-4 lg:gap-10 xl:gap-10 2xl:gap-12">
          {filteredAssetsData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            const isPurchased = purchasedAssets.has(data.id);

            let collectionsToFetch = "";
            if (data.audioName) {
              collectionsToFetch = "assetAudios";
            } else if (data.imageName) {
              collectionsToFetch = "assetImages";
            } else if (data.assetAudiosName) {
              collectionsToFetch = "assetAudios";
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
                className=" w-[140px] h-[240px] ssm:w-[165px] ssm:h-[230px] sm:w-[180px] sm:h-[250px] md:w-[190px] md:h-[280px] lg:w-[210px] lg:h-[300px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <div
                  onClick={() => openModal(data)}
                  className="w-full h-[73px] ssm:w-full ssm:h-[98px] sm:w-full sm:h-[113px] md:w-full md:h-[120px] lg:w-full lg:h-[183px] xl:h-full 2xl:h-full ">
                  <div className="w-full h-[150px] relative">
                    {data.uploadUrlVideo ? (
                      <video
                        src={data.uploadUrlVideo}
                        alt="Asset Video"
                        className="h-28 sm:h-28 md:h-36 lg:h-40 xl:h-full 2xl:h-full w-full rounded-t-[10px] mx-auto border-none object-cover"
                        controls
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : Array.isArray(data.datasetThumbnail) &&
                      data.datasetThumbnail.length > 0 ? (
                      <img
                        src={data.datasetThumbnail[0] || CustomImage}
                        alt="Thumbnail 1"
                        className="h-28 sm:h-28 md:h-36 lg:h-40 xl:h-full 2xl:h-full w-full rounded-t-[10px] mx-auto border-none object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CustomImage;
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <img
                        src={
                          data.image ||
                          data.uploadUrlImage ||
                          data.datasetImage ||
                          data.assetAudiosImage ||
                          data.asset2DImage ||
                          data.asset3DImage ||
                          (data.video ? CustomImage : null) ||
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
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className="h-28 sm:h-28 md:h-36 lg:h-40 xl:h-full 2xl:h-full w-full rounded-t-[10px] mx-auto border-none"
                      />
                    )}
                    {isPurchased && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] font-bold px-2 py-1 rounded">
                        Sudah Dibeli
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full p-2 sm:p-4 mt-[30px] sm:mt-0 md:mt-0 lg:mt-0">
                  <div onClick={() => openModal(data)} className="px-2 py-2">
                    <p className="text-md text-neutral-10 font-semibold dark:text-primary-100 truncate max-w-xs">
                      {data.assetAudiosName ||
                        data.audioName ||
                        data.datasetName ||
                        data.asset2DName ||
                        data.asset3DName ||
                        data.imageName ||
                        data.videoName ||
                        "Nama Tidak Tersedia"}
                    </p>

                    <h4 className="text-neutral-20 text-xs sm:text-sm lg:text-base dark:text-primary-100">
                      {data.description.length > 20
                        ? `${data.description.substring(0, 20)}......`
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

      {modalIsOpen && selectedasset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-neutral-10 bg-opacity-50"></div>
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-full sm:w-[400px] md:w-[500px] lg:w-[550px] xl:w-[600px] 2xl:w-[750px] mx-4 flex flex-col relative">
            <button
              className="absolute top-1 right-4 text-gray-600 dark:text-gray-400 text-4xl"
              onClick={closeModal}>
              &times;
            </button>

            {/* Bagian Gambar */}
            <div
              onClick={() => openModal(selectedasset)}
              className="flex flex-col items-center justify-center w-full">
              <div className="w-full h-[200px] sm:h-[200px] md:h-[200px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] aspect-[16/9] sm:aspect-[4/3] relative mt-4">
                {selectedasset.uploadUrlVideo ? (
                  <video
                    src={selectedasset.uploadUrlVideo}
                    alt="Asset Video"
                    className="w-full h-full object-cover"
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : Array.isArray(selectedasset.datasetThumbnail) &&
                  selectedasset.datasetThumbnail.length > 0 ? (
                  <img
                    src={selectedasset.datasetThumbnail[0] || CustomImage}
                    alt="Thumbnail 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CustomImage;
                    }}
                    onContextMenu={(e) => e.preventDefault()}
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
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="w-full mt-4 text-center sm:text-left max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <p className="text-lg sm:text-xl text-neutral-10 font-bold dark:text-primary-100 text-start">
                {selectedasset.assetAudiosName ||
                  selectedasset.audioName ||
                  selectedasset.datasetName ||
                  selectedasset.asset2DName ||
                  selectedasset.asset3DName ||
                  selectedasset.imageName ||
                  selectedasset.videoName ||
                  "Nama Tidak Tersedia"}
              </p>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4 text-start">
                Kategori: {selectedasset.category}
              </p>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4 text-start">
                {selectedasset.price > 0
                  ? `Rp ${selectedasset.price.toLocaleString("id-ID")}`
                  : "Free"}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4">
                <label className="block mt-2 text-start">Deskripsi:</label>
                <div className="mt-2 text-justify">
                  {selectedasset.description}
                </div>
              </div>

              <div className="mt-4">
                {selectedasset.price > 0 ? (
                  <>
                    <button
                      onClick={() => handleAddToCart(selectedasset)}
                      className={`flex p-2 text-center justify-center  w-full h-10 mt-2 rounded-md ${
                        purchasedAssets.has(selectedasset.id)
                          ? "bg-gray-400 pointer-events-none"
                          : "bg-neutral-60"
                      }`}
                      disabled={purchasedAssets.has(selectedasset.id)}>
                      <img
                        src={IconCart}
                        alt="Cart Icon"
                        className="w-10 h-6 mr-2"
                      />
                      <p>Tambahkan Ke Keranjang</p>
                    </button>
                    <button
                      onClick={() => handleBuyNow(selectedasset)}
                      className={`flex p-2 text-center justify-center  w-full h-10 mt-2 rounded-md ${
                        purchasedAssets.has(selectedasset.id)
                          ? "bg-gray-400 pointer-events-none"
                          : "bg-secondary-40"
                      }`}
                      disabled={purchasedAssets.has(selectedasset.id)}>
                      <img
                        src={IconDollar}
                        alt="Cart Icon"
                        className="w-10 h-6 mr-2 -ml-24"
                      />
                      <p>Beli Sekarang</p>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSaveToMyAssets(selectedasset)}
                    className="flex p-2 text-center items-center justify-center bg-neutral-60 text-primary-100 w-full h-10 mt-6 rounded-md">
                    <img
                      src={IconDownload}
                      alt="Download Icon"
                      className="w-6 h-6 mr-2"
                    />
                    <p>Save Asset</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-[700px]">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
