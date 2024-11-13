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
  const [searchResults, setSearchResults] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (searchTerm) {
      const results = cartItems.filter(
        (asset) =>
          asset.datasetName &&
          asset.datasetName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(cartItems);
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
          "url not found",
        datasetFile: item.datasetFile || "not found",
        docId: item.id,
        userId: item.userId,
        description: item.description || "No Description",
        category: item.category || "Uncategorized",
        assetOwnerID: item.assetOwnerID || "Asset Owner ID Not Available",
        size: item.size || item.resolution || "size & Resolution not found",
      }));

      const response = await axios.post(
        "http://localhost:3000/api/transactions/create-transaction",
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
            await saveTransaction(
              "Success",
              orderId,
              subtotal,
              transactionData.token,
              assetDetails
            );
            await moveAssetsToBuyAssets(assetDetails);
            await deletePurchasedAssets(selectedItems);
            resetCustomerInfoAndCart();
            setSuccessMessage("Transaction completed successfully.");
          } catch (saveError) {
            console.error("Error in transaction success handling:", saveError);
            setErrorMessage(
              "Transaction completed, but failed to move assets."
            );
          }
        },
        onPending: async (result) => {
          try {
            await saveTransaction(
              "Pending",
              orderId,
              subtotal,
              transactionData.token,
              assetDetails
            );
            pollPaymentStatus(orderId);
          } catch (saveError) {
            console.error("Error saving pending transaction:", saveError);
          }
        },
        onError: function (result) {
          console.error("Payment error:", result);
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
          image:
            asset.image ||
            asset.Image_umum ||
            asset.video ||
            asset.assetImageGame ||
            asset.datasetThumbnail ||
            "url not found",
          datasetFile: asset.datasetFile || "not found",
          assetOwnerID: asset.assetOwnerID,
          size: asset.size || asset.resolution || "size & Resolution not found",
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
      const buyAssetsPromises = assets.map((asset) => {
        const newAsset = {
          assetId: asset.assetId,
          price: 0,
          name: asset.name,
          image:
            asset.image ||
            asset.Image_umum ||
            asset.video ||
            asset.assetImageGame ||
            asset.datasetThumbnail ||
            "url not found",
          datasetFile:
            asset.datasetFile || asset.datasetThumbnail || "not found",
          docId: asset.docId,
          userId: asset.userId,
          description: asset.description,
          category: asset.category,
          assetOwnerID: asset.assetOwnerID,
          size: asset.size || asset.resolution || "size & Resolution not found",
        };
        return setDoc(doc(collection(db, "buyAssets"), asset.docId), newAsset);
      });

      await Promise.all(buyAssetsPromises);
    } catch (error) {
      console.error("Error moving assets to buyAssets:", error);
    }
  };

  const deletePurchasedAssets = async (purchasedItems) => {
    try {
      const deletePromises = purchasedItems.map((item) => {
        const itemDoc = doc(db, "cartAssets", item.id);
        return deleteDoc(itemDoc);
      });
      await Promise.all(deletePromises);
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

      const response = await axios.get(
        `http://localhost:3000/api/transactions/check-status/${orderId}`
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
        <h2 className="text-2xl font-semibold mb-4">Keranjang Belanja</h2>
        <p className="mb-4">
          Anda mempunyai {cartItems.length} item dalam keranjang
        </p>
        <div className="flex flex-col md:flex-row md:justify-center p-4">
          <div className="md:w-2/3 space-y-4">
            {/* Reduced spacing */}
            {filteredAssetsData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between bg-gray-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-20 p-3 rounded-lg shadow-md mb-4 mx-2">
                <div className="flex flex-col md:flex-row items-center w-full">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={item.selected}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  {item.video ? (
                    <video
                      src={item.video}
                      alt="Asset Video"
                      className="h-20 sm:h-40 md:h-20 lg:h-20 xl:h-20 2xl:h-20 w-full md:w-48 overflow-hidden relative mx-auto border-none cursor-pointer"
                      controls
                    />
                  ) : (
                    <img
                      src={
                        item.Image ||
                        item.uploadUrlImage ||
                        item.datasetImage ||
                        item.assetAudiosImage ||
                        item.asset2DImage ||
                        item.asset3DImage ||
                        item.Image_umum ||
                        item.datasetThumbnail ||
                        item.datasetFile ||
                        CustomImage
                      }
                      alt="Asset Image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = CustomImage;
                      }}
                      className="h-full w-full md:w-48 overflow-hidden relative mx-auto border-none cursor-pointer"
                    />
                  )}
                  <div className="ml-2 md:ml-4 mt-2 md:mt-0 w-full">
                    {/* Reduced margin and padding */}
                    <h3 className="font-semibold text-sm md:text-base">
                      {item.name ||
                        item.datasetName ||
                        item.videoName ||
                        item.assetNameGame ||
                        item.imageName ||
                        item.asset2DName ||
                        item.asset3DName ||
                        "Item Name Not Available"}
                    </h3>
                    <p className="text-sm md:text-base">
                      Category: {item.category || "Unknown Category"}
                    </p>
                    <p className="text-gray-700 mt-1 text-sm md:text-base">
                      Rp. {(item.price || 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm md:text-base">
                      Size: {item.size || item.resolution || "Unknown size"}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 mt-2 md:mt-0"
                  onClick={() => handleDeleteItem(item.id)}>
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
              onClick={handlePayment}>
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
