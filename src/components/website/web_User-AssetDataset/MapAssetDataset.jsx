import { db } from "../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import HeaderNav from "../../HeaderNav/HeaderNav";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../assets/assetmanage/Iconrarzip.svg";

export function MapAssetDataset() {
  const [productsData, setProductsData] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      const q = query(
        collection(db, "assetDatasets"),
        where("category", "==", "Nature")
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductsData(products);
    };

    fetchProductsData();
  }, []);

  const handleLikeClick = (id) => {
    setLikedProducts((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
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
          {productsData.map((data) => (
            <div
              key={data.id}
              className="w-[140px] h-[155px] ssm:w-[165px] ssm:h-[180px] sm:w-[180px] sm:h-[205px] md:w-[180px] md:h-[215px] lg:w-[260px] lg:h-[295px] rounded-[10px] bg-[#D9D9D9] dark:bg-[#171717] group">
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
                <p className="text-[9px] text-neutral-20 font-light dark:text-white">
                  {data.datasetName}
                </p>
                <h4 className="text-neutral-10 text-[9px] ssm:text-[11px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-semibold dark:text-white">
                  {data.description}
                </h4>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLikeClick(data.id)}
                    className="flex justify-start items-center mr-2">
                    {likedProducts[data.id] ? (
                      <FaHeart className="text-red-600" />
                    ) : (
                      <FaRegHeart className="text-neutral-10 text-[11px] sm:text-[14px] dark:text-white " />
                    )}
                    <p className="ml-2 text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      ({data.likes || 0})
                    </p>
                  </button>
                  <p className="flex justify-end w-full text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                    Rp. {data.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalIsOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white dark:bg-neutral-20 p-6 rounded-lg z-50 max-w-2xl w-full mx-4 flex">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedProduct.datasetImage || CustomImage}
              alt="Product Image"
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-white">
                {selectedProduct.datasetName}
              </h2>
              <p className="text-sm mb-2 dark:text-white">
                Rp. {selectedProduct.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm mb-2 dark:text-white">
                {selectedProduct.description}
              </p>
              <p className="text-sm mb-2 dark:text-white">
                Kategori: {selectedProduct.category}
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
