/* eslint-disable no-unused-vars */
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
  setDoc,
  getDoc,
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

export function AssetDataset() {
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
      collection(db, "assetDatasets"),
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

  // Menangani pengambilan aset yang telah dibeli
  useEffect(() => {
    const fetchUserPurchasedAssets = async () => {
      if (!currentUserId) return;

      const purchasedQuery = query(
        collection(db, "buyAssets"),
        where("uid", "==", currentUserId)
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

  useEffect(() => {
    const results = AssetsData.filter((asset) =>
      asset.datasetName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, AssetsData]);

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
        // console.error("Error fetching likes: ", error);
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

    const assetRef = doc(db, "assetDatasets", assetId);
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
      // console.error("Error updating likes: ", error);
    } finally {
      // Selesaikan proses
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
        Image: selectedasset.datasetImage,
        name: selectedasset.datasetName,
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

    const { id, datasetName, description, price, datasetImage, category } =
      selectedasset;

    const missingFields = [];
    if (!datasetName) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!datasetImage) missingFields.push("video");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(", ")}. Please try again.`);
      return;
    }

    try {
      await setDoc(cartRef, {
        userId: currentUserId,
        assetId: id,
        name: datasetName,
        description: description,
        price: price,
        video: datasetImage,
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
  const validateAssetFields = ({
    datasetName,
    description,
    price,
    datasetImage,
    category,
  }) => {
    const missingFields = [];
    if (!datasetName) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!datasetImage) missingFields.push("datasetImage");
    if (!category) missingFields.push("category");
    return missingFields;
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
  const filteredAssetsData = AssetsData.filter((asset) =>
    asset.datasetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 sm:bg-none md:bg-none lg:bg-none xl:bg-none 2xl:bg-none fixed  left-[50%] sm:left-[40%] md:left-[45%] lg:left-[47%] xl:left-[45%] 2xl:left-[50%] transform -translate-x-1/2 z-20 sm:z-40 md:z-40 lg:z-40 xl:z-40 2xl:z-40  flex justify-center top-[145px] sm:top-[20px] md:top-[20px] lg:top-[20px] xl:top-[20px] 2xl:top-[20px] w-full sm:w-[250px] md:w-[300px] lg:w-[500px] xl:w-[600px] 2xl:w-[1200px]">
          <div className="justify-center">
            <form
              className=" mx-auto px-20  w-[570px] sm:w-[400px] md:w-[450px] lg:w-[700px] xl:w-[800px] 2xl:w-[1200px]"
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
        <div className=" mb-4 mx-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 place-items-center gap-[40px] sm:gap-[30px] md:gap-[120px] lg:gap-[130px] xl:gap-[25px] 2xl:gap-[30px] -space-x-0   sm:-space-x-[30px] md:space-x-[20px] lg:space-x-[40px] xl:-space-x-[0px] 2xl:-space-x-[30px]  ">
          {filteredAssetsData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAssets.has(data.id);
            const isPurchased = purchasedAssets.has(data.id);

            return (
              <div
                key={data.id}
                className="w-[140px] h-[215px] ssm:w-[165px] ssm:h-[230px] sm:w-[180px] sm:h-[250px] md:w-[180px] md:h-[260px] lg:w-[260px] lg:h-[320px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group flex flex-col justify-between">
                <div className="w-full h-[73px] ssm:w-full ssm:h-[98px] sm:w-full sm:h-[113px] md:w-full md:h-[95px] lg:w-full lg:h-[183px] relative">
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
                  {isPurchased && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                      Sudah Dibeli
                    </div>
                  )}
                </div>

                {/* details section */}
                <div className="flex flex-col justify-between h-full px-4 py-2 sm:p-10">
                  <div>
                    <p className="text-[9px] text-neutral-10 font-semibold dark:text-primary-100">
                      {data.datasetName}
                    </p>
                    <h4 className="text-neutral-20 text-[8px] sm:text-[11px] md:text-[10px] lg:text-[12px] xl:text-[14px]  dark:text-primary-100">
                      {data.description.length > 24
                        ? `${data.description.substring(0, 24)}......`
                        : data.description}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center mt-auto gap-2">
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
                    <p className="text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
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
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] sm:w-[700px] md:w-[700px] lg:w-[700px] xl:w-[700px] 2xl:w-[700px] mx-4 flex relative">
            <button
              className="absolute top-1 sm:top-2 md:top-2 lg:top-3 xl:top-2 2xl:top-2 right-3 sm:right-2 md:right-2 lg:right-3 xl:right-2 2xl:right-2 text-gray-600 dark:text-gray-400 text-2xl sm:text-xl md:text-xl lg:text-[35px] xl:text-[40px] 2xl:text-2xl"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedasset.datasetImage || CustomImage}
              alt="asset Image"
              className="w-1/2 h-[260px] mb-4"
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
              <div className="mt-28">
                <button
                  onClick={() => handleAddToCart(selectedasset)}
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
                  onClick={() => handleBuyNow(selectedasset)}
                  className={`flex p-2 text-center items-center justify-center bg-neutral-60 w-full h-10 mt-2 rounded-md ${
                    purchasedAssets.has(selectedasset.id)
                      ? "bg-gray-400 pointer-events-none"
                      : "bg-secondary-40"
                  }`}
                  disabled={purchasedAssets.has(selectedasset.id)}>
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
        </div>
      )}

      <div className="relative mt-10 flex items-center justify-center">
        <div className="text-center">
          {searchResults.length === 0 && searchTerm && (
            <p className="text-black text-[20px]">No assets found</p>
          )}
        </div>
      </div>

      <footer className="min-h-screen flex flex-col items-center justify-center">
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
