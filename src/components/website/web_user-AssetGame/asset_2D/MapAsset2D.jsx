import { db } from "../../../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import HeaderNav from "../../../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../web_User-LandingPage/NavbarSection";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../../assets/assetmanage/Iconrarzip.svg";

export function MapAsset2D() {
  const [productsData, setProductsData] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mengambil data dari Firebase
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "assetImage2D"));
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter produk yang memiliki harga (price)
        const filteredProducts = products.filter(
          (product) => product.price !== undefined && product.price !== 0
        );

        setProductsData(filteredProducts);
        setLikedProducts(
          filteredProducts.reduce((acc, product) => {
            acc[product.id] = product.likes || 0;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching products data: ", error);
      }
    };

    fetchProductsData();
  }, []);

  // Fungsi untuk menangani klik tombol suka
  const handleLikeClick = async (id) => {
    const currentLikes = likedProducts[id] || 0;
    const newLikes = likedProducts[id]
      ? likedProducts[id] - 1
      : currentLikes + 1;

    setLikedProducts((prevState) => ({
      ...prevState,
      [id]: newLikes,
    }));

    await updateLike(id, newLikes);
  };

  // Mengupdate data like di Firebase
  const updateLike = async (id, likes) => {
    try {
      const productRef = doc(db, "assetImage2D", id);
      await updateDoc(productRef, {
        likes: likes,
      });
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  // Fungsi untuk membuka modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
      <div className="w-full shadow-md bg-primary-100 dark:text-primary-100 relative z-40">
        <div className="pt-[50px] sm:pt-[70px]">
          <HeaderNav />
        </div>
        <NavbarSection />
      </div>
      <div className="pt-[100px] w-full p-12 mx-auto">
        <h1>All Category</h1>
      </div>
      <div className="pt-[10px] w-full p-10">
        <div className="container mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {productsData.map((data) => (
            <div
              key={data.id}
              className="w-[140px] h-[155px] ssm:w-[165px] ssm:h-[180px] sm:w-[180px] sm:h-[205px] md:w-[180px] md:h-[215px] lg:w-[260px] lg:h-[295px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group">
              <div className="w-[140px] h-[73px] ssm:w-[165px] ssm:h-[98px] sm:w-[180px] sm:h-[113px] md:w-[180px] md:h-[95px] lg:w-[260px] lg:h-[183px]">
                <img
                  src={data["uploadUrl-Image2D"] || CustomImage}
                  alt={data.imageName}
                  className="h-full w-full overflow-hidden relative rounded-t-[10px] mx-auto border-none max-h-full cursor-pointer"
                  onClick={() => openModal(data)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = CustomImage;
                  }}
                />
              </div>

              <div className="flex-col justify-start px-4 py-2 sm:p-4">
                <p className="text-[9px] text-neutral-20 font-light dark:text-primary-100">
                  {data.imageName}
                </p>
                <h4 className="text-neutral-10 text-[9px] ssm:text-[11px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-semibold dark:text-primary-100">
                  {data.description}
                </h4>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLikeClick(data.id)}
                    className="flex justify-start items-center mr-2">
                    {likedProducts[data.id] ? (
                      <FaHeart className="text-red-600" />
                    ) : (
                      <FaRegHeart className="text-neutral-10 text-[11px] sm:text-[14px] dark:text-primary-100 " />
                    )}
                    <p className="ml-2 text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      ({likedProducts[data.id] || 0})
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
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 max-w-2xl w-full mx-4 flex relative">
            <button
              className="absolute top-1 sm:top-2 right-3 text-gray-600 dark:text-gray-400 text-2xl"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedProduct["uploadUrl-Image2D"] || CustomImage}
              alt={selectedProduct.imageName}
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-100">
                {selectedProduct.imageName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100">
                Rp. {selectedProduct.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm mb-2 dark:text-primary-100">
                {selectedProduct.description}
              </p>
              <p className="text-sm mb-2 dark:text-primary-100">
                Kategori: {selectedProduct.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}