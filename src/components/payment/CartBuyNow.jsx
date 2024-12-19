/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const CartBuyNow = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    loadSnapScript();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length > 0 && snapReady && !isPaymentOpen) {
      handlePayment(cartItems);
    }
  }, [cartItems, snapReady]);

  // Load Midtrans Snap script
  const loadSnapScript = () => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-QM4rGhnfcyjCT3LL");
    script.async = true;

    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  };

  const fetchCartItems = () => {
    const userId = user.uid;
    const cartCollectionRef = collection(db, "buyNow");
    const queryRef = query(cartCollectionRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(queryRef, async (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const boughtAssetIds = await fetchBoughtAssetIds(userId);
      const filteredItems = items.filter(
        (item) => !boughtAssetIds.has(item.assetId)
      );

      setCartItems(filteredItems.map((item) => ({ ...item, selected: false })));
    });

    return () => unsubscribe();
  };

  const fetchBoughtAssetIds = async (userId) => {
    const boughtAssetsQuery = query(
      collection(db, "buyAssets"),
      where("boughtBy", "==", userId)
    );
    const boughtAssetsSnapshot = await getDocs(boughtAssetsQuery);
    return new Set(boughtAssetsSnapshot.docs.map((doc) => doc.id));
  };

  const handlePayment = async (selectedItems) => {
    if (selectedItems.length === 0 || isPaymentOpen) return;

    setIsLoading(true);
    setIsPaymentOpen(true);

    try {
      const orderId = `order_${Date.now()}`;
      const assetDetails = createAssetDetails(selectedItems);
      const subtotal = calculateSubtotal(assetDetails);
      const transactionData = await createTransaction(
        orderId,
        subtotal,
        assetDetails
      );

      window.snap.pay(transactionData.token, {
        onSuccess: async () => {
          await completeTransaction(
            "Success",
            orderId,
            subtotal,
            transactionData.token,
            assetDetails
          );
        },
        onPending: async () => {
          await completeTransaction(
            "Pending",
            orderId,
            subtotal,
            transactionData.token,
            assetDetails
          );
        },
        onError: navigateBack,
        onClose: navigateBack,
      });
    } catch (error) {
      console.error("Error during transaction process:", error);
      navigateBack();
    } finally {
      setIsLoading(false);
    }
  };

  const completeTransaction = async (
    status,
    orderId,
    subtotal,
    token,
    assetDetails
  ) => {
    await saveTransaction(status, orderId, subtotal, token, assetDetails);

    if (status === "Success") {
      const moveAssetsSuccess = await handleMoveAndDeleteAssets(assetDetails);
      if (moveAssetsSuccess) {
        setSuccessMessage(
          "Pembayaran berhasil. Aset telah dipindahkan ke koleksi."
        );
      }
    } else {
      setSuccessMessage(
        `Pembayaran ${status.toLowerCase()}, cek status di dashboard transaksi.`
      );
    }

    resetCustomerInfoAndCart();
  };

  const handleMoveAndDeleteAssets = async (assetDetails) => {
    console.log("Handling move and delete for assets:", assetDetails);
    try {
      const moveResults = await Promise.all(
        assetDetails.map(moveAssetToBuyAssets)
      );
      const allMovedSuccessfully = moveResults.every(
        (result) => result !== null
      );

      if (allMovedSuccessfully) {
        console.log("All assets moved successfully, deleting from cart.");
        await deleteCartItems(assetDetails);
      } else {
        console.warn("Some assets failed to move, aborting delete process.");
      }
      return allMovedSuccessfully;
    } catch (error) {
      console.warn("Error moving and deleting assets:", error);
      return false;
    }
  };

  const moveAssetToBuyAssets = async (asset) => {
    console.log("Attempting to move asset:", asset);
    try {
      const apiBaseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://pixelstore-be.up.railway.app";
      const response = await axios.post(
        `${apiBaseUrl}/api/moveAsset/${asset.docId}`
      );

      if (response.status === 200) {
        console.log("Asset moved to buyAssets successfully:", asset);
        return asset;
      } else {
        console.warn("Failed to move asset:", response.data.error);
        return null;
      }
    } catch (error) {
      console.warn("Error moving asset:", error);
      return null;
    }
  };

  const deleteCartItems = async (assetDetails) => {
    console.log("Deleting cart items:", assetDetails);
    try {
      await Promise.all(
        assetDetails.map(async (asset) => {
          const cartDocRef = doc(db, "buyNow", asset.docId);
          await deleteDoc(cartDocRef);
          console.log(`Deleted asset from buyNow: ${asset.docId}`);
          const apiBaseUrl =
          window.location.hostname === "localhost"
            ? "http://localhost:3000"
            : "https://pixelstore-be.up.railway.app";
          await axios.delete(
            `${apiBaseUrl}/api/assets/delete/${asset.docId}`
          );
        })
      );
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };

  const createAssetDetails = (items) => {
    return items.map((item) => ({
      assetId: item.assetId,
      price: item.price,
      size: item.size || item.resolution || "size & Resolution tidak ada",
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
      uid: user.uid,
      assetOwnerID: item.assetOwnerID || "Owner not available",
    }));
  };

  const calculateSubtotal = (details) => {
    return details.reduce((total, item) => total + Number(item.price), 0);
  };

  const createTransaction = async (orderId, subtotal, assetDetails) => {
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
          fullName: user.displayName || "No Name Provided",
          email: user.email || "No Email Provided",
          phoneNumber: "No Phone Provided",
        },
      }
    );
    return response.data;
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
        userId: user.uid,
        grossAmount: subtotal,
        token,
        status,
        createdAt: new Date(),
        assets: assetDetails.map((asset) => ({
          docId: asset.docId,
          userId: user.uid,
          assetId: asset.assetId,
          name: asset.name,
          price: asset.price,
          description: asset.description,
          size: asset.size || "No Size Provided",
          category: asset.category,
          image:
            asset.image ||
            asset.Image_umum ||
            asset.video ||
            asset.assetImageGame ||
            asset.datasetThumbnail ||
            "url not found",
        })),
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const resetCustomerInfoAndCart = () => {
    setIsPaymentOpen(false);
    setCartItems([]);
    setSuccessMessage("");
  };

  const navigateBack = () => {
    setIsPaymentOpen(false);
    setSuccessMessage("Pembayaran dibatalkan.");
    setIsLoading(false);
    navigate(-1);
  };

  return (
    <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90">
      <div className="text-center">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-60 w-60 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          successMessage && <p className="text-green-500">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CartBuyNow;
