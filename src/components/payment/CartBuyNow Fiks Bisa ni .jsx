/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const CartBuyNow = () => {
  const navigate = useNavigate(); // Tambahkan navigasi
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const { userRole } = useUserContext();

  // Fungsi untuk kembali ke halaman sebelumnya jika transaksi gagal atau dibatalkan
  const navigateBack = () => {
    navigate(-1); // Arahkan kembali ke halaman sebelumnya
  };

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

  const handlePayment = async (selectedItems) => {
    if (selectedItems.length === 0 || !userRole || isPaymentOpen) {
      return;
    }

    setIsLoading(true);
    setIsPaymentOpen(true);

    try {
      const orderId = `order_${Date.now()}`;
      const assetDetails = selectedItems.map((item) => ({
        assetId: item.assetId,
        price: item.price,
        name: item.name || "Item Name Not Available",
        image:
          item.image || item.video || item.assetImageGame || "url not found",
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

      const transactionData = response.data;

      // Trigger Midtrans Snap
      window.snap.pay(transactionData.token, {
        onSuccess: async (result) => {
          await saveTransaction(
            "Success",
            orderId,
            subtotal,
            transactionData.token,
            assetDetails
          );

          const moveAssetsSuccess = await handleMoveAssets(assetDetails);

          if (moveAssetsSuccess) {
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
          navigateBack();
        },
        onClose: function () {
          setErrorMessage("Pembayaran dibatalkan.");
          navigateBack();
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
      navigateBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveAssets = async (assetDetails) => {
    try {
      const moveResult = await Promise.all(
        assetDetails.map(moveAssetToBuyAssets)
      );
      return moveResult.every((result) => result !== null);
    } catch (moveError) {
      console.error("Error moving assets:", moveError);
      setErrorMessage("Gagal memindahkan aset.");
      return false;
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
          asset.image || asset.video || asset.assetImageGame || "url not found",
        purchasedAt: new Date(),
      };
      await setDoc(buyAssetDocRef, assetData);
      return assetData;
    } catch (error) {
      console.error("Error moving asset to buyAssets:", error);
      return null;
    }
  };

  const deleteCartItems = async (assetDetails) => {
    try {
      await Promise.all(
        assetDetails.map(async (asset) => {
          const cartDocRef = doc(db, "cartAssets", asset.docId);
          await deleteDoc(cartDocRef);

          // Panggil API untuk menghapus cartAssets
          await axios.delete(
            `http://localhost:3000/api/assets/delete/${asset.docId}`
          );
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
          image:
            asset.image ||
            asset.video ||
            asset.assetImageGame ||
            "url not found",
          assetOwnerID: asset.assetOwnerID,
        })),
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      setErrorMessage("Gagal menyimpan transaksi.");
    }
  };

  const resetCustomerInfoAndCart = () => {
    setCartItems([]);
    setIsPaymentOpen(false);
  };

  return (
    <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90">
      <div className="text-center">
        {isLoading && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </div>
  );
};

export default CartBuyNow;
