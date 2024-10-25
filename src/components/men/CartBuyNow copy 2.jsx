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
import CustomImage from "../../assets/assetmanage/Iconrarzip.svg";
import { useUserContext } from "../../contexts/UserContext";

const CartBuyNow = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const { userRole } = useUserContext();

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
          boughtAssetsSnapshot.docs.map((doc) => doc.id)
        );

        const filteredItems = items.filter(
          (item) => !boughtAssetIds.has(item.assetId)
        );

        setCartItems(
          filteredItems.map((item) => ({ ...item, selected: true }))
        );

        // Memanggil handlePayment jika ada item dalam keranjang
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
    if (itemsToPay.length === 0) {
      setErrorMessage("Tidak ada item dalam keranjang untuk pembayaran.");
      return;
    }

    if (!userRole) {
      setErrorMessage("Peran pengguna tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const orderId = `order_${Date.now()}`;

      // Calculate gross amount
      const grossAmount = itemsToPay.reduce((total, item) => {
        return total + item.price; // Add each item's price to total
      }, 0);

      const assetDetails = itemsToPay.map((item) => ({
        assetId: item.assetId,
        price: item.price,
        name: item.datasetName || "Unknown Asset",
        docId: item.id,
      }));

      // Send request to create a transaction
      const response = await axios.post(
        "http://localhost:3000/api/transactions/create-transaction",
        {
          orderId,
          grossAmount, // Send the calculated gross amount
          uid: user.uid,
          assets: assetDetails,
          customerDetails: {
            fullName: user.displayName || "Unknown User",
            email: user.email,
            phoneNumber: user.phoneNumber || "0000000000", // Replace this with the actual phone number if available
          },
        }
      );

      const transactionData = response.data;

      window.snap.pay(transactionData.token, {
        onSuccess: async (result) => {
          console.log(result);

          // Move assets to the buyAssets collection
          await handleMoveAssets(assetDetails); // Call to move assets

          // Show success message
          setSuccessMessage(
            "Pembayaran berhasil. Aset telah dipindahkan dan item dihapus dari keranjang."
          );

          // Clear the selected items if necessary
          setCartItems((prevItems) =>
            prevItems.filter((item) => !item.selected)
          );
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
      setErrorMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveAssets = async (assetDetails) => {
    try {
      // Move assets to the buyAssets collection
      await moveAssets(assetDetails);
      setSuccessMessage("Aset sudah dipindahkan.");
    } catch (moveError) {
      console.error("Kesalahan saat memindahkan aset:", moveError);
      setErrorMessage("Gagal memindahkan aset.");
    }

    // Delete assets from the cart
    await Promise.all(assetDetails.map(deleteAsset));
  };

  const moveAssets = async (assetDetails) => {
    // Create a buyAssets entry for each asset
    await Promise.all(
      assetDetails.map(async ({ assetId, price, name }) => {
        await axios.post("http://localhost:3000/api/assets/move-assets", {
          uid: user.uid,
          asset: {
            assetId,
            price,
            name,
          },
        });
      })
    );
  };

  const deleteAsset = async (asset) => {
    const docId = `${user.uid}_${asset.assetId}`;
    const url = `http://localhost:3000/api/assets/delete/${docId}`;

    await axios.delete(url);

    try {
      const assetDoc = doc(db, "cartBuyNow", asset.id);
      await deleteDoc(assetDoc);
      console.log(`Aset dengan ID ${asset.id} telah dihapus.`);
    } catch (error) {
      console.error(
        `Kesalahan saat menghapus aset dengan assetId ${asset.id}:`,
        error
      );
    }
  };

  return (
    <div className="font-poppins dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen bg-primary-100 opacity-90">
      <div className="container mx-auto py-40">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white p-4 shadow rounded">
            <div>
              <img src={CustomImage} alt={item.datasetName} />
            </div>
            <div className="flex-1 pl-4">
              <h4 className="text-lg font-semibold">{item.datasetName}</h4>
              <p className="text-sm">Harga: Rp{item.price}</p>
            </div>
          </div>
        ))}

        {isLoading && <p>Memproses pembayaran...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </div>
  );
};

export default CartBuyNow;
