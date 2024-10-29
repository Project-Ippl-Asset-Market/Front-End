/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebase/firebaseConfig";
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
import { useUserContext } from "../../../contexts/UserContext";

const CartBuyNow = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [snapReady, setSnapReady] = useState(false); // To track if the script is loaded
  const auth = getAuth();
  const user = auth.currentUser;
  const { userRole } = useUserContext();

  // Load the Midtrans snap script and set snapReady to true when it's fully loaded
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-QM4rGhnfcyjCT3LL");
    script.async = true;

    script.onload = () => {
      setSnapReady(true); // Set to true when script is loaded
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (user) {
      const userId = user.uid;
      console.log("User ID:", userId);
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

  // Automatically initiate payment when cart items are available and Snap is ready
  useEffect(() => {
    if (cartItems.length > 0 && snapReady && !isPaymentOpen) {
      handlePayment(cartItems);
    }
  }, [cartItems, snapReady]); // Trigger when both cartItems and snap script are ready

  const itemName = (item) => {
    return (
      item.audioName ||
      item.asset2DName ||
      item.asset3DName ||
      item.datasetName ||
      item.imageName ||
      item.videoName ||
      "Unknown Name"
    );
  };

  const itemImage = (item) => {
    return (
      item.Image ||
      item.uploadUrlImage ||
      item.datasetImage ||
      item.assetAudiosImage ||
      item.asset2DImage ||
      item.asset3DImage ||
      "Unknown Image"
    );
  };

  const handlePayment = async (selectedItems) => {
    if (selectedItems.length === 0 || !userRole || isPaymentOpen) {
      return;
    }

    setIsLoading(true);
    setIsPaymentOpen(true);

    try {
      const orderId = `order_${Date.now()}`;
      console.log("Order ID:", orderId);

      const assetDetails = selectedItems.map((item) => ({
        assetId: item.assetId,
        price: item.price,
        name: itemName(item),
        image: itemImage(item),
        docId: item.id,
        userId: item.userId,
        description: item.description || "No Description",
        category: item.category || "Uncategorized",
        uid: user.uid,
        assetOwnerID: item.assetOwnerID,
      }));

      console.log("Asset Details:", assetDetails);
      const subtotal = assetDetails.reduce(
        (total, item) => total + Number(item.price),
        0
      );
      console.log("Subtotal:", subtotal);

      const response = await axios.post(
        "http://localhost:3000/api/transactions/create-transaction",
        {
          orderId,
          grossAmount: subtotal,
          uid: user.uid,
          assets: assetDetails,
          customerDetails: {
            fullName: user.displayName || "No Name Provided",
            email: user.email || "No Email Provided",
            phoneNumber: "No Phone Provided",
          },
        }
      );
      console.log("Transaction Response:", response);
      const transactionData = response.data;

      // Trigger Midtrans Snap
      window.snap.pay(transactionData.token, {
        onSuccess: async (result) => {
          // Step 1: Save Transaction
          await saveTransaction(
            "Success",
            orderId,
            subtotal,
            transactionData.token,
            assetDetails
          );

          // Step 2: Move Assets to buyAssets
          const moveAssetsSuccess = await handleMoveAssets(assetDetails);

          if (moveAssetsSuccess) {
            // Step 3: Delete items from cartAssets
            await deleteCartItems(assetDetails);
            setSuccessMessage(
              "Pembayaran berhasil. Aset telah dipindahkan ke koleksi dan item lainnya dihapus dari keranjang."
            );
          } else {
            setErrorMessage("Gagal memindahkan aset ke koleksi.");
          }

          resetCustomerInfoAndCart();
        },
        onPending: async (result) => {
          await saveTransaction(
            "Pending",
            orderId,
            subtotal,
            transactionData.token,
            assetDetails
          );
          setSuccessMessage(
            "Pembayaran tertunda, cek status di dashboard transaksi."
          );
        },
        onError: function (result) {
          console.error("Snap Payment Error:", result);
          setErrorMessage("Pembayaran gagal, silakan coba lagi.");
        },
      });
    } catch (error) {
      console.error(
        "Error during transaction process:",
        error.response || error.message
      );
      setErrorMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveAssets = async (assetDetails) => {
    try {
      const moveResult = await Promise.all(
        assetDetails.map(moveAssetToBuyAssets)
      );
      // Return whether all assets were moved successfully
      return moveResult.every((result) => result !== null);
    } catch (moveError) {
      console.error("Error moving assets:", moveError);
      setErrorMessage("Gagal memindahkan aset.");
      return false; // Return false if there was any error
    }
  };

  const moveAssetToBuyAssets = async (asset) => {
    try {
      const buyAssetDocRef = doc(collection(db, "buyAssets"));
      const assetData = {
        uid: user.uid,
        assetId: asset.assetId,
        name: asset.name,
        price: 0, // Assuming you want to set it to zero for clarity
        assetOwnerID: asset.assetOwnerID,
        description: asset.description || "No Description",
        category: asset.category || "Uncategorized",
        image: asset.image,
        purchasedAt: new Date(),
      };
      await setDoc(buyAssetDocRef, assetData);
      return assetData; // Return the asset data to indicate success
    } catch (error) {
      console.error("Error moving asset to buyAssets:", error);
      return null; // Return null to indicate failure
    }
  };

  const deleteCartItems = async (assetDetails) => {
    try {
      await Promise.all(
        assetDetails.map(async (asset) => {
          const cartDocRef = doc(db, "cartAssets", asset.docId);
          await deleteDoc(cartDocRef);
        })
      );
    } catch (error) {
      console.error("Error deleting cart items:", error);
      setErrorMessage("Gagal menghapus item dari keranjang.");
    }
  };

  const saveTransaction = async (
    status,
    orderId,
    subtotal,
    token,
    assetDetails
  ) => {
    try {
      const transactionDocRef = doc(collection(db, "transactions"));
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
          image: { url: asset.image },
          assetOwnerID: asset.assetOwnerID,
        })),
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      setErrorMessage("Gagal menyimpan transaksi.");
    }
  };

  const resetCustomerInfoAndCart = () => {
    setCartItems((prevItems) => prevItems.filter((item) => !item.selected));
  };

  return (
    <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen bg-primary-100 opacity-90">
      <div className="container mx-auto py-40">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-60 w-60 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CartBuyNow;
