/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import axios from "axios";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import Header from "../headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../website/web_User-LandingPage/NavbarSection";
import CustomImage from "../../assets/assetmanage/Iconrarzip.svg";
import Footer from "../website/Footer/Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (searchTerm) {
      const results = cartItems.filter(
        (asset) =>
          asset.datasetName &&
          asset.datasetName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCartItems(results);
    } else {
      setCartItems(cartItems);
    }
  }, [searchTerm, cartItems]);

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const cartCollectionRef = collection(db, "cartAssets");
      const queryRef = query(cartCollectionRef, where("userId", "==", userId));

      const unsubscribe = onSnapshot(queryRef, async (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const boughtAssetsQuery = query(
          collection(db, "buyAssets"),
          where("boughtBy", "==", userId)
        );

        const boughtAssetsSnapshot = await getDocs(boughtAssetsQuery);
        const boughtAssetIds = new Set(
          boughtAssetsSnapshot.docs.map((doc) => doc.id)
        );

        const filteredItems = items.filter(
          (item) => !boughtAssetIds.has(item.assetId)
        );

        setCartItems(
          filteredItems.map((item) => ({
            ...item,
            selected: false,
            userId: item.userId,
          }))
        );
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-QM4rGhnfcyjCT3LL");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const handlePayment = async () => {
    if (selectedItems.length === 0) {
      setErrorMessage("Please select at least one item to proceed.");
      return;
    }
  
    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phoneNumber
    ) {
      setErrorMessage("Please fill out all customer information.");
      return;
    }
  
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const orderId = `order_${Date.now()}`;
      const assetDetails = selectedItems.map((item) => ({
        assetId: item.assetId,
        price: item.price,
        name: item.name || "Item Name Not Available",
        image:
          item.image ||
          item.Image_umum ||
          item.video ||
          item.assetImageGame ||
          item.datasetThumbnail ||
          item.audioThumbnail ||
          "url tidak ada",
        datasetFile: item.datasetFile || item.file || "tidak ada",
        docId: item.id,
        file: item.file,
        userId: item.userId,
        description: item.description || "No Description",
        category: item.category || "Uncategorized",
        assetOwnerID: item.assetOwnerID || "Asset Owner ID Not Available",
        size: item.size || item.resolution || "size & Resolution tidak ada",
      }));
  
      const apiBaseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : "https://pixelstore-be.up.railway.app";
  
      const response = await axios.post(
        `${apiBaseUrl}/api/transactions/create-transaction`,
        {
          orderId,
          grossAmount: subtotal,
          uid: user.uid,
          assets: assetDetails,
          customerDetails: {
            fullName: customerInfo.fullName,
            email: customerInfo.email,
            phoneNumber: customerInfo.phoneNumber,
          },
        }
      );
  
      const transactionData = response.data;
  
      window.snap.pay(transactionData.token, {
        onSuccess: async (result) => {
          try {
            // Kirim token dan selectedItems ke backend untuk memeriksa status pembayaran
            const assetDetails = selectedItems.map((item) => ({
              assetId: item.assetId,
              price: item.price,
              name: item.name || "Item Name Not Available",
              image:
                item.image ||
                item.Image_umum ||
                item.video ||
                item.assetImageGame ||
                item.datasetThumbnail ||
                item.audioThumbnail ||
                "url tidak ada",
              datasetFile: item.datasetFile || item.file || "tidak ada",
              docId: item.id,
              file: item.file,
              userId: item.userId,
              description: item.description || "No Description",
              category: item.category || "Uncategorized",
              assetOwnerID: item.assetOwnerID || "Asset Owner ID Not Available",
              size: item.size || item.resolution || "size & Resolution tidak ada",
            }));

            const paymentStatusResponse = await axios.post(
              `${apiBaseUrl}/api/transactions/payment-status`,
              {
                orderId,
                assets: assetDetails,
                selectedItems: selectedItems, // Kirim selectedItems yang akan dipindahkan
              }
            );
  
            if (paymentStatusResponse.data.status === "settlement") {
              setSuccessMessage("Transaction completed successfully.");
              resetCustomerInfoAndCart();
            } else {
              setErrorMessage("Payment not completed successfully.");
            }
          } catch (saveError) {
            console.error("Error in transaction success handling:", saveError);
            setErrorMessage("Payment successful, but failed to move assets.");
          }
        },
        onPending: async (result) => {
          try {
            // Simpan transaksi dengan status "Pending"
            await saveTransaction(
              "Pending",
              orderId,
              subtotal,
              transactionData.token,
              assetDetails
            );
            pollPaymentStatus(orderId); // Polling status pembayaran jika status pending
          } catch (saveError) {
            console.error("Error saving pending transaction:", saveError);
          }
        },
        onError: function (result) {
          console.error("Payment error:", result);
          setErrorMessage("Payment failed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error during transaction:", error);
      setErrorMessage("Failed to process payment.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const saveTransaction = async (
    status,
    orderId,
    subtotal,
    token,
    assetDetails
  ) => {
    const transactionDocRef = doc(collection(db, "transactions"));
    try {
      await setDoc(transactionDocRef, {
        orderId,
        uid: user.uid,
        grossAmount: subtotal,
        token,
        status,
        createdAt: new Date(),
        assets: assetDetails.map((asset) => ({
          docId: asset.docId,
          userId: user.uid,
          name: asset.name,
          price: asset.price,
          description: asset.description,
          category: asset.category,
          image: asset.image || "url tidak ada",
          datasetFile: asset.datasetFile || "tidak ada",
          assetOwnerID: asset.assetOwnerID,
          size: asset.size || asset.resolution || "size & Resolution tidak ada",
        })),
        customerDetails: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phoneNumber: customerInfo.phoneNumber,
        },
      });
      if (status === "Success") {
        await moveAssetsToBuyAssets(assetDetails);
      }
    } catch (error) {
      throw error;
    }
  };

  const moveAssetsToBuyAssets = async (assets) => {
    try {
      if (!Array.isArray(assets) || assets.length === 0) {
        console.error("Invalid assets array:", assets);
        return;
      }
  
      const buyAssetsPromises = assets.map(async (asset) => {
        if (!asset.assetId) {
          console.warn("Skipping asset without ID:", asset);
          return; // Skip jika assetId tidak ada
        }
  
        const newAsset = {
          assetId: asset.assetId,
          price: asset.price || 0,
          name: asset.name || "No Name",
          image: asset.image || "url tidak ada",
          datasetFile: asset.datasetFile || "tidak ada",
          docId: asset.docId || "No Doc ID",
          userId: asset.userId || "No User ID",
          description: asset.description || "No Description",
          category: asset.category || "Uncategorized",
          assetOwnerID: asset.assetOwnerID || "Asset Owner ID Not Available",
          size: asset.size || "size tidak ada",
        };
  
        try {
          await setDoc(doc(db, "buyAssets", asset.assetId), newAsset);
          console.log(`Successfully moved asset with ID: ${asset.assetId}`);
        } catch (error) {
          console.error(`Error moving asset with ID: ${asset.assetId}`, error);
        }
      });
  
      await Promise.all(buyAssetsPromises);
      console.log("All assets have been moved to buyAssets.");
    } catch (error) {
      console.error("Error moving assets to buyAssets:", error);
    }
  };
  
  

  const deletePurchasedAssets = async (selectedItems) => {
    try {
      if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
        console.warn("No items to delete:", selectedItems);
        return;
      }
  
      const deletePromises = selectedItems.map((item) => {
        if (!item.id) {
          console.warn("Skipping item without ID:", item);
          return null;
        }
        const itemDoc = doc(db, "cartAssets", item.id);
        return deleteDoc(itemDoc)
          .then(() => console.log(`Deleted item with ID: ${item.id}`))
          .catch((error) => console.error(`Error deleting item with ID: ${item.id}`, error));
      });
  
      await Promise.all(deletePromises.filter(Boolean)); // Pastikan hanya promise valid yang dijalankan
      console.log("All selected items have been deleted from cartAssets.");
    } catch (error) {
      console.error("Error deleting purchased assets:", error);
    }
  };
  

  const resetCustomerInfoAndCart = () => {
    setCustomerInfo({ fullName: "", email: "", phoneNumber: "" });
    setCartItems((prevItems) => prevItems.filter((item) => !item.selected));
  };

  const pollPaymentStatus = async (
    orderId,
    interval = 5000,
    timeout = 30000
  ) => {
    const startTime = Date.now();

    const checkStatus = async () => {
      if (Date.now() - startTime >= timeout) {
        console.error("Polling timeout reached");
        return;
      }
      
      const apiBaseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://pixelstore-be.up.railway.app";
      const response = await axios.get(
        `${apiBaseUrl}/api/transactions/check-status/${orderId}`
      );
      if (response.data.status === "settlement") {
        await updateTransactionStatus(orderId, "Success");
      } else if (response.data.status === "expire") {
        await updateTransactionStatus(orderId, "Expired");
      } else {
        console.log(`Transaction status: ${response.data.status}`);
      }
      setTimeout(checkStatus, interval);
    };

    checkStatus();
  };

  const updateTransactionStatus = async (orderId, status) => {
    const transactionDocRef = doc(collection(db, "transactions"), orderId);
    await setDoc(transactionDocRef, { status }, { merge: true });
  };

  const handleCheckboxChange = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleDeleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "cartAssets", id);
      await deleteDoc(itemDoc);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredAssetsData = cartItems.filter((asset) => {
    const datasetName =
      asset.name ||
      asset.audioName ||
      asset.asset2DName ||
      asset.asset3DName ||
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
          <Header />
        </div>
        <div className="mt-0 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
          <NavbarSection />
        </div>
      </div>

      <div className="container mx-auto py-20">
        <h2 className="text-2xl font-semibold mb-4 mt-16">Keranjang Belanja</h2>
        <p className="mb-4">
          Anda mempunyai {cartItems.length} item dalam keranjang
        </p>
        <div className="flex flex-col md:flex-row md:justify-center p-4 max-w-screen mx-auto">
          <div className="md:w-2/3 space-y-4">
            {filteredAssetsData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-gray-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-20 p-3 rounded-lg shadow-md mb-4"
              >
                <div className="flex flex-row items-center sm:w-full">
                  <input
                    type="checkbox"
                    className="mr-2 sm:mr-4"
                    checked={item.selected}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  {item.video ? (
                    <video
                      src={item.video}
                      className="h-20 w-20 sm:h-24 sm:w-24 lg:h-20 lg:w-20 rounded overflow-hidden border-none cursor-pointer"
                      controls
                    />
                  ) : (
                    <img
                      src={
                        item.thumbnailGame?.[0] ||
                        item.asset2DThumbnail?.[0] ||
                        item.asset3DThumbnail?.[0] ||
                        item.audioThumbnail ||
                        item.datasetThumbnail ||
                        item.image ||
                        item.Image ||
                        item.Image_umum ||
                        item.uploadUrlImage ||
                        item.datasetImage ||
                        item.assetAudiosImage ||
                        item.asset2DImage ||
                        item.asset3DImage ||
                        CustomImage
                      }
                      alt="Asset"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = CustomImage;
                      }}
                      className="h-20 w-20 sm:h-24 sm:w-24 lg:h-20 lg:w-20 rounded overflow-hidden"
                    />
                  )}
                  <div className="ml-2 sm:ml-4 w-full">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {item.name ||
                        item.datasetName ||
                        item.videoName ||
                        item.assetNameGame ||
                        item.imageName ||
                        item.asset2DName ||
                        item.asset3DName ||
                        "Tidak ada nama"}
                    </h3>
                    <p className="text-sm sm:text-base">
                      Category: {item.category || "Unknown Category"}
                    </p>
                    <p className="text-gray-700 mt-1 text-sm sm:text-base">
                      Rp. {(item.price || 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm sm:text-base">
                      Size: {item.size || item.resolution || "Tidak ada size"}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 mt-2 sm:mt-0 sm:ml-auto"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-200 p-5 rounded-lg shadow-md w-full md:w-[320px] mt-4 md:mt-0 mx-auto">
            <h4 className="text-gray-950 font-semibold mb-2 text-sm md:text-base">
              Detail Pembayaran
            </h4>
            <p className="text-gray-700">
              Harga ({selectedItems.length} items): Rp.{" "}
              {subtotal.toLocaleString("id-ID")}
            </p>
            <div className="mt-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={customerInfo.fullName}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded text-sm md:text-base"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded text-sm md:text-base"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={customerInfo.phoneNumber}
                onChange={handleInputChange}
                className="block w-full mb-4 p-2 border rounded text-sm md:text-base"
                required
              />
            </div>
            {isLoading && (
              <p className="text-blue-600 text-sm md:text-base">
                Memproses pembayaran, harap tunggu...
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm md:text-base">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm md:text-base">
                {successMessage}
              </p>
            )}
            <button
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md text-sm md:text-base"
              onClick={handlePayment}
            >
              Proses Ke Pembayaran
            </button>
          </div>
        </div>
      </div>

      <div className="mt-96">
        <Footer />
      </div>
    </div>
  );
};

export default Cart;