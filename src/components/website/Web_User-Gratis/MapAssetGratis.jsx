// MapAssetGratis.jsx
import { db } from "../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import HeaderNav from "../../HeaderNav/HeaderNav";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";

export function MapAssetGratis() {
  const [assetsData, setAssetsData] = useState([]);
  const [likedAssets, setLikedAssets] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const fetchGratisAssets = async () => {
      try {
        // Daftar koleksi yang akan diambil
        const collections = [
          { name: "assetAudios", type: "Audio" },
          { name: "assetDataset", type: "Dataset" },
          { name: "assetImage2D", type: "Image 2D" },
          { name: "assetImage3D", type: "Image 3D" },
          { name: "assetImages", type: "Images" },
          { name: "assetVideos", type: "Videos" },
        ];

        // Membuat array promises untuk setiap query
        const promises = collections.map(async (col) => {
          const q = query(
            collection(db, col.name),
            where("price", "==", 0)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            collection: col.type, // Menambahkan tipe koleksi
            ...doc.data(),
          }));
        });

        // Menunggu semua promises selesai
        const results = await Promise.all(promises);

        // Menggabungkan semua hasil menjadi satu array
        const combinedData = results.flat();
        setAssetsData(combinedData);
      } catch (error) {
        console.error("Error fetching gratis assets:", error);
      }
    };

    fetchGratisAssets();
  }, []);

  const handleLikeClick = (id) => {
    setLikedAssets((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
        <div className="pt-[50px] sm:pt-[70px] md:pt-[70px] lg:pt-[70px] xl:pt-[70px] 2xl:pt-[70px]  w-full">
          <HeaderNav />
        </div>
        <NavbarSection />
      </div>
      <div className="pt-[100px] w-full p-10">
        {/* Body section */}
        <div className="container mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-5 place-items-center">
          {assetsData.map((asset) => (
            <div
              key={asset.id}
              className="w-[140px] h-[155px] ssm:w-[165px] ssm:h-[180px] sm:w-[180px] sm:h-[205px] md:w-[180px] md:h-[215px] lg:w-[260px] lg:h-[295px] rounded-[10px] bg-[#D9D9D9] dark:bg-[#171717] group">
              {/* Image section */}
              <div className="w-[140px] h-[73px] ssm:w-[165px] ssm:h-[98px] sm:w-[180px] sm:h-[113px] md:w-[180px] md:h-[95px] lg:w-[260px] lg:h-[183px]">
                <img
                  src={asset.datasetImage || asset.assetImage || CustomImage}
                  alt="Asset Image"
                  className="h-full w-full overflow-hidden relative rounded-t-[10px] mx-auto border-none max-h-full cursor-pointer"
                  onClick={() => openModal(asset)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = CustomImage;
                  }}
                />
              </div>

              {/* Details section */}
              <div className="flex-col justify-start px-4 py-2 sm:p-4">
                <p className="text-[9px] text-neutral-20 font-light dark:text-white">
                  {asset.datasetName || asset.assetName || "Unnamed Asset"}
                </p>
                <h4 className="text-neutral-10 text-[9px] ssm:text-[11px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-semibold dark:text-white">
                  {asset.description || "No Description"}
                </h4>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLikeClick(asset.id)}
                    className="flex justify-start items-center mr-2">
                    {likedAssets[asset.id] ? (
                      <FaHeart className="text-red-600" />
                    ) : (
                      <FaRegHeart className="text-neutral-10 text-[11px] sm:text-[14px] dark:text-white " />
                    )}
                    <p className="ml-2 text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      ({asset.likes || 0})
                    </p>
                  </button>
                  <p className="flex justify-end w-full text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                    Rp. {asset.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalIsOpen && selectedAsset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white dark:bg-neutral-20 p-6 rounded-lg z-50 max-w-2xl w-full mx-4 flex">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedAsset.datasetImage || selectedAsset.assetImage || CustomImage}
              alt="Asset Image"
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-white">
                {selectedAsset.datasetName || selectedAsset.assetName || "Unnamed Asset"}
              </h2>
              <p className="text-sm mb-2 dark:text-white">
                Rp. {selectedAsset.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm mb-2 dark:text-white">
                {selectedAsset.description || "No Description"}
              </p>
              <p className="text-sm mb-2 dark:text-white">
                Kategori: {selectedAsset.category || selectedAsset.type || "Unknown"}
              </p>
              <p className="text-sm mb-2 dark:text-white">
                Tipe Koleksi: {selectedAsset.collection}
              </p>
              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapAssetGratis;
