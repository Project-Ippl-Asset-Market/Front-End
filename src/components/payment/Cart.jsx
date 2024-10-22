/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Header from "../../components/headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../components/website/web_User-LandingPage/NavbarSection";
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
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch cart items
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

        // Fetch the IDs of purchased assets from the buyAssets collection
        const boughtAssetsQuery = query(
          collection(db, "buyAssets"),
          where("boughtBy", "==", userId)
        );

        const boughtAssetsSnapshot = await getDocs(boughtAssetsQuery);
        const boughtAssetIds = new Set(
          boughtAssetsSnapshot.docs.map((doc) => doc.id)
        );

        // Filter out items that have already been bought
        const filteredItems = items.filter(
          (item) => !boughtAssetIds.has(item.assetId)
        );

        setCartItems(
          filteredItems.map((item) => ({ ...item, selected: false }))
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
  const taxRate = 0.1; // PPN 10%
  const totalWithTax = subtotal + subtotal * taxRate;

  const handlePayment = async () => {
    // Validate selected items and customer details
    if (selectedItems.length === 0) {
      setErrorMessage("Tidak ada item dalam keranjang untuk pembayaran.");
      return;
    }

    if (
      !customerInfo.fullName ||
      !customerInfo.email ||
      !customerInfo.phoneNumber
    ) {
      setErrorMessage("Mohon lengkapi detail pelanggan.");
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
        name: item.datasetName || "Unknown Asset",
        docId: item.id, // Save document ID
      }));

      // Send request to create a transaction
      const response = await fetch(
        "http://localhost:3000/api/transactions/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            grossAmount: subtotal,
            uid: user.uid,
            assets: assetDetails,
            customerDetails: {
              fullName: customerInfo.fullName,
              email: customerInfo.email,
              phoneNumber: customerInfo.phoneNumber,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Response tidak baik");
      }

      const transactionData = await response.json();

      // Call Midtrans to process payment
      window.snap.pay(transactionData.token, {
        onSuccess: async (result) => {
          console.log(result); // Log successful result
          await handleMoveAssets(assetDetails); // Move assets and delete from cart
        },
        onPending: function (result) {
          setSuccessMessage(
            "Pembayaran tertunda, cek status di dashboard transaksi."
          );
        },
        onError: function (result) {
          console.error(result);
          setErrorMessage("Pembayaran gagal, silakan coba lagi.");
        },
        onClose: function () {
          console.log("Payment dialog closed");
        },
      });
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle moving assets after payment
  const handleMoveAssets = async (assetDetails) => {
    try {
      // Call the API to move assets from cart to buy assets
      const moveResponse = await fetch(
        "http://localhost:3000/api/assets/move-assets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            assets: assetDetails.map(({ assetId }) => ({ assetId })),
          }),
        }
      );

      if (!moveResponse.ok) {
        const errorResponse = await moveResponse.json();
        throw new Error(
          errorResponse.message || "Gagal untuk memindahkan aset"
        );
      }

      // If successful, delete assets from cart and update local state
      await Promise.all(
        assetDetails.map(async (asset) => {
          // Delete asset from Firestore
          const itemDoc = doc(db, "cartAssets", asset.docId);
          await deleteDoc(itemDoc); // Remove the item from Firestore
        })
      );

      // Update local state to remove items from the cart
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) => !assetDetails.some((asset) => asset.docId === item.id)
        )
      );

      setSuccessMessage("Pembayaran berhasil dan aset sudah dipindahkan.");
    } catch (moveError) {
      console.error("Error moving assets:", moveError);
      setErrorMessage("Gagal memindahkan aset.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      // Delete from Firestore first
      const itemDoc = doc(db, "cartAssets", id);
      await deleteDoc(itemDoc);
      // Update state to remove the item from the cart
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

  return (
    <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen bg-primary-100">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40">
        <div className="pt-[80px] w-full">
          <Header />
        </div>
        <NavbarSection />
      </div>
      <div className="container mx-auto py-40">
        <h2 className="text-2xl font-semibold mb-4">Keranjang Belanja</h2>
        <p className="mb-4">
          Anda mempunyai {cartItems.length} item dalam keranjang
        </p>

        <div className="flex flex-col md:flex-row md:justify-center p-4">
          <div className="md:w-2/3 space-y-6">
            {cartItems.map((item) => (
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
                  {item.uploadUrlVideo ? (
                    <video
                      src={item.uploadUrlVideo}
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
                      {item.datasetName ||
                        item.videoName ||
                        item.imageName ||
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
            <p className="text-gray-700">
              Total (Termasuk PPN 10%): Rp.
              {totalWithTax.toLocaleString("id-ID")}
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
