/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
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
} from "firebase/firestore";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const CartBuyNow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const { userRole } = useUserContext();
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const cartCollectionRef = collection(db, "cartBuyNow");
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
          boughtAssetsSnapshot.docs.map((doc) => doc.assetId)
        );

        const filteredItems = items.filter(
          (item) => !boughtAssetIds.has(item.assetId)
        );

        if (filteredItems.length > 0) {
          handlePayment(filteredItems);
        }
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

  const handlePayment = async (itemsToPay) => {
    if (itemsToPay.length === 0 || !userRole || isPaymentOpen) {
      return;
    }

    setIsLoading(true);
    setIsPaymentOpen(true);

    try {
      const orderId = `order_${Date.now()}`;
      const grossAmount = itemsToPay.reduce(
        (total, item) => total + item.price,
        0
      );

      const assetDetails = itemsToPay.map((item) => ({
        assetId: item.assetId,
        price: item.price,
        name: item.videoName || "Unknown Asset",
        docId: item.id,
      }));

      // Send request to create a transaction
      const response = await axios.post(
        "http://localhost:3000/api/transactions/create-transaction",
        {
          orderId,
          grossAmount,
          uid: user.uid,
          assets: assetDetails,
          customerDetails: {
            fullName: user.displayName || "Unknown User",
            email: user.email,
            phoneNumber: user.phoneNumber || "0000000000",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transactionData = response.data;

      window.snap.pay(transactionData.token, {
        onSuccess: async () => {
          setIsPaymentOpen(false);
          await handleMoveAndDeleteAssets(assetDetails);
        },
        onPending: function () {
          setIsPaymentOpen(false);
        },
        onError: function () {
          setIsPaymentOpen(false);
        },
        onClose: function () {
          setIsPaymentOpen(false);
          navigate(-1);
        },
      });
    } catch (error) {
      // console.error("Error during payment process:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveAndDeleteAssets = async (assetDetails) => {
    try {
      await moveAssets(assetDetails);
      await Promise.all(assetDetails.map(deleteAsset));
      // eslint-disable-next-line no-unused-vars
    } catch (moveError) {
      // console.error("Error while moving assets:", moveError);
    }
  };

  const moveAssets = async (assetDetails) => {
    await axios.post("http://localhost:3000/api/assets/move-assets", {
      uid: user.uid,
      assets: assetDetails.map(({ assetId, name }) => ({
        assetId,
        price: 0,
        name,
      })),
    });
  };

  const deleteAsset = async (asset) => {
    const docId = `${user.uid}_${asset.assetId}`;
    const url = `http://localhost:3000/api/assets/delete/cart-buy-now/${docId}`;

    // Hapus item dari API
    await axios.delete(url);

    try {
      // Mencoba menghapus dokumen dari Firestore
      const assetDoc = doc(db, "cartBuyNow", asset.id);
      await deleteDoc(assetDoc);
      // console.log(`Aset dengan ID ${asset.id} telah dihapus.`);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // console.error(
      //   `Kesalahan saat menghapus aset dengan assetId ${asset.id}:`,
      //   error
      // );
    }
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
