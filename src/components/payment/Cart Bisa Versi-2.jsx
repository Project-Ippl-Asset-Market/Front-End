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
        docId: item.id,
      }));

      // Send request to create a transaction
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
          console.log(result);

          // Panggil fungsi untuk menghapus item setelah pembayaran berhasil
          await deleteCartItems(selectedItems);

          // Setel pesan sukses dan reset data jika perlu
          setSuccessMessage("Pembayaran berhasil. Aset telah dipindahkan.");

          // Reset informasi pelanggan dan cartItems jika diperlukan
          setCustomerInfo({ fullName: "", email: "", phoneNumber: "" });
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

  // Fungsi untuk menghapus item dari cartAssets
  const deleteCartItems = async (selectedItems) => {
    try {
      await Promise.all(
        selectedItems.map(async (item) => {
          const docId = `${user.uid}_${item.assetId}`; // Menggunakan format ID dokumen yang ada
          const itemDoc = doc(db, "cartAssets", docId);

          // Menghapus dokumen dari Firestore
          await deleteDoc(itemDoc);
          console.log(`Item dengan ID ${docId} telah dihapus dari cartAssets.`);
        })
      );
      // Perbarui cartItems setelah penghapusan
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !selectedItems.some((selected) => selected.assetId === item.assetId)
        )
      );
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
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
                        e.target.onerror = null; // Prevents infinite fallback loop
                        e.target.src = CustomImage; // Set a default image if error occurs
                      }}
                      className="h-20 sm:h-40 md:h-20 lg:h-20 xl:h-20 2xl:h-20 w-full md:w-48 overflow-hidden relative mx-auto border-none cursor-pointer"
                    />
                  )}
                  <div className="flex flex-col justify-between p-4 w-full">
                    <h3 className="font-semibold text-lg">
                      {item.datasetName || "Nama aset tidak tersedia"}
                    </h3>
                    <p className="text-gray-600">{item.category}</p>
                    <p className="text-xl font-bold">{item.price} IDR</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          <div className="md:w-1/3 md:ml-4 mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-4">Detail Pelanggan</h3>
            <input
              type="text"
              name="fullName"
              value={customerInfo.fullName}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="mb-2 p-2 border border-gray-300 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="mb-2 p-2 border border-gray-300 rounded w-full"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              value={customerInfo.phoneNumber}
              onChange={handleInputChange}
              placeholder="Nomor Telepon"
              className="mb-2 p-2 border border-gray-300 rounded w-full"
              required
            />
            <div className="flex justify-between mt-4">
              <p className="font-semibold">Subtotal:</p>
              <p>{subtotal} IDR</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-gray-700">
                Subtotal ({selectedItems.length} items): Rp.
                {subtotal.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-gray-700">
                Total (Termasuk PPN 10%): Rp.
                {totalWithTax.toLocaleString("id-ID")}
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="mt-4 bg-blue-500 text-white p-2 rounded w-full">
              {isLoading ? "Memproses..." : "Bayar Sekarang"}
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
