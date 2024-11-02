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

  // Filter pencarian
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

  // Fetch cart items
  useEffect(() => {
    if (user) {
      const userId = user.uid;
      // console.log("User ID:", userId);
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

  // Load the Midtrans snap script
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
      // setErrorMessage("Tidak ada item dalam keranjang untuk pembayaran.");
      return;
    }

    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phoneNumber
    ) {
      // setErrorMessage("Mohon lengkapi detail pelanggan.");
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
        name:
          item.name ||
          item.audioName ||
          item.asset2DName ||
          item.asset3DName ||
          item.datasetName ||
          item.imageName ||
          item.videoName ||
          "Unknown Name",
        image:
          item.image ||
          item.video ||
          item.assetImageGame ||
          item.Image_umum ||
          item.datasetImage ||
          "Image not found",
        docId: item.id,
        userId: item.userId,
        description: item.description || "No Description",
        category: item.category || "Uncategorized",
        uid: user.uid,
        assetOwnerID: item.assetOwnerID,
      }));

      const subtotal = assetDetails.reduce(
        (total, item) => total + Number(item.price),
        0
      );
      // console.log("Subtotal:", subtotal);

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
      // console.log("Transaction Data:", transactionData);

      window.snap.pay(transactionData.token, {
        onSuccess: async (result) => {
          // console.log("Payment successful:", result);
          try {
            await saveTransaction(
              "Success",
              orderId,
              subtotal,
              transactionData.token,
              assetDetails
            );

            await handleMoveAssets(assetDetails);

            // setSuccessMessage(
            //   "Pembayaran berhasil. Aset telah dipindahkan ke koleksi dan item lainnya dihapus dari keranjang."
            // );
            resetCustomerInfoAndCart();
          } catch (saveError) {
            // console.error("Error saving transaction:", saveError);
            // setErrorMessage("Gagal menyimpan transaksi.");
          }
        },
        onPending: async (result) => {
          // console.log("Payment pending:", result);
          try {
            await saveTransaction(
              "Pending",
              orderId,
              subtotal,
              transactionData.token,
              assetDetails
            );
            // setSuccessMessage(
            //   "Pembayaran tertunda, cek status di dashboard transaksi."
            // );
            pollPaymentStatus(orderId);
          } catch (saveError) {
            // console.error("Error saving transaction:", saveError);
            // setErrorMessage("Gagal menyimpan transaksi.");
          }
        },
        onError: function (result) {
          // console.error("Payment error:", result);
          // setErrorMessage("Pembayaran gagal, silakan coba lagi.");
        },
      });
    } catch (error) {
      // console.error("Error during transaction:", error);
      // setErrorMessage(
      //   `Error: ${error.response?.data?.message || error.message}`
      // );
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
          uid: user.uid,
          name: asset.name,
          price: asset.price,
          description: asset.description,
          category: asset.category,
          image:
            asset.image ||
            asset.video ||
            asset.assetImageGame ||
            asset.Image_umum ||
            asset.datasetImage ||
            "Image not found",
          assetOwnerID: asset.assetOwnerID,
        })),
        customerDetails: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phoneNumber: customerInfo.phoneNumber,
        },
      });
      // console.log("Transaction saved successfully");
    } catch (error) {
      // console.error("Error saving transaction:", error);
      throw error;
    }
  };

  const resetCustomerInfoAndCart = () => {
    setCustomerInfo({ fullName: "", email: "", phoneNumber: "" });
    setCartItems((prevItems) => prevItems.filter((item) => !item.selected));
  };

  const handleMoveAssets = async (assetDetails) => {
    try {
      await Promise.all(assetDetails.map(moveAssetToBuyAssets));
      await Promise.all(assetDetails.map(deleteAsset));
      setSuccessMessage("Aset sudah dipindahkan.");
    } catch (moveError) {
      console.error("Error moving assets:", moveError);
      setErrorMessage("Gagal memindahkan aset.");
      return;
    }
  };

  const moveAssetToBuyAssets = async (asset) => {
    try {
      const buyAssetDocRef = doc(collection(db, "buyAssets"));
      const assetData = {
        uid: user.uid,
        assetId: asset.assetId,
        name: asset.name,
        price: 0,
        assetOwnerID: asset.assetOwnerID,
        description: asset.description || "No Description",
        category: asset.category || "Uncategorized",
        image:
          asset.image ||
          asset.video ||
          asset.assetImageGame ||
          asset.datasetImage ||
          asset.Image_umum ||
          "Image not found",
        purchasedAt: new Date(),
      };

      await setDoc(buyAssetDocRef, assetData);
    } catch (error) {
      console.error("Error saving asset to buyAssets:", error);
      throw error;
    }
  };

  const deleteAsset = async (asset) => {
    const docId = `${asset.assetId}`;
    const url = `http://localhost:3000/api/assets/delete/${docId}`;

    await axios.delete(url);

    try {
      const assetDoc = doc(db, "cartAssets", asset.docId);
      await deleteDoc(assetDoc);
    } catch (error) {
      console.error(
        `Kesalahan saat menghapus aset dengan assetId ${asset.id}:`,
        error
      );
    }
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

  const handleDeleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "cartAssets", id);
      await deleteDoc(itemDoc);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
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

  // Filter berdasarkan pencarian
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
    <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen bg-primary-100">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40">
        <div className="pt-[80px] w-full">
          <Header />
        </div>
        <NavbarSection />
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

      <div className="container mx-auto py-40">
        <h2 className="text-2xl font-semibold mb-4">Keranjang Belanja</h2>
        <p className="mb-4">
          Anda mempunyai {cartItems.length} item dalam keranjang
        </p>

        <div className="flex flex-col md:flex-row md:justify-center p-4">
          <div className="md:w-2/3 space-y-6">
            {filteredAssetsData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between bg-gray-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-20 p-4 rounded-lg shadow-md mb-4 mx-2">
                <div className="flex flex-col md:flex-row items-center w-full">
                  <input
                    type="checkbox"
                    className="mr-4 mb-2 md:mb-0"
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
                  <div className="ml-0 md:ml-4 mt-4 md:mt-0 w-full">
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

          <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full md:w-[320px] mt-4 md:mt-0 mx-auto">
            <h4 className="text-gray-950 font-semibold mb-2 text-sm md:text-base">
              Detail Pembayaran
            </h4>

            <p className="text-gray-700">
              Subtotal ({selectedItems.length} items): Rp.
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

      <footer className="bg-darknavy dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[10px] sm:text-[12px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All rights reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
};

export default Cart;
