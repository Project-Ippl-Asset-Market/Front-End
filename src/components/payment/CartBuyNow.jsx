import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import axios from "axios";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CartBuyNow = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
        onSuccess: async (result) => {
          try {
            await saveToBuyAssets(assetDetails, orderId);
            await saveTransaction(
              orderId,
              subtotal,
              transactionData.token,
              assetDetails
            );
            resetCustomerInfoAndCart();
            setSuccessMessage("Transaksi berhasil.");
          } catch (saveError) {
            setErrorMessage("Transaksi berhasil, tetapi gagal menyimpan aset.");
          }
        },
        onPending: async (result) => {
          // Handle pending payment if necessary
        },
        onError: function (result) {
          setErrorMessage("Terjadi kesalahan pembayaran.");
        },
        onClose: function () {
          navigateBack();
        },
      });
    } catch (error) {
      setErrorMessage("Gagal memproses pembayaran.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToBuyAssets = async (assetDetails, orderId) => {
    try {
      const response = await fetch(
        "https://pixelstore-be.up.railway.app/api/transactions/save-buy-assets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, assets: assetDetails }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Kesalahan saat menyimpan ke buyAssets: ${
            errorData.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      console.log(data.message);
      alert("Transaksi berhasil!");
    } catch (error) {
      // console.error("Kesalahan saat menyimpan ke buyAssets:", error);
      // alert("Terjadi kesalahan saat menyimpan transaksi: " + error.message);
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
        item.audioThumbnail ||
        item.datasetThumbnail ||
        item.asset2DThumbnail ||
        item.asset3DThumbnail ||
        "url tidak ada",
      datasetFile:
        item.datasetFile ||
        item.asset3DFile ||
        item.asset2DFile ||
        item.uploadUrlAudio ||
        item.thumbnailGame ||
        "tidak ada",
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
    const response = await axios.post(
      "https://pixelstore-be.up.railway.app/api/transactions/create-transaction",
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

  const saveTransaction = async (orderId, subtotal, token, assetDetails) => {
    try {
      const transactionDocRef = doc(collection(db, "buyAssets"));
      await setDoc(transactionDocRef, {
        orderId, // Ensure orderId is saved
        userId: user.uid,
        grossAmount: subtotal,
        token,
        status: "success",
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
          uid: user.uid,
        })),
      });
    } catch (error) {
      // console.error("Error saving transaction:", error);
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
          <>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default CartBuyNow;
