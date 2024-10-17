// eslint-disable-next-line no-unused-vars
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
} from "firebase/firestore";
import Header from "../../components/headerNavBreadcrumbs/HeaderWebUser";
import NavbarSection from "../../components/website/web_User-LandingPage/NavbarSection";
import CustomImage from "../../assets/assetmanage/Iconrarzip.svg";

const Cart = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [refreshData, setRefreshData] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const cartCollection = collection(db, "cartAssets");
      const q = query(cartCollection, where("userId", "==", userId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched items:", items);
        setSelectedItems(items.map((item) => ({ ...item, selected: false })));
        setRefreshData((prev) => !prev);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const selected = selectedItems.filter((item) => item.selected);
  const subtotal = selected.reduce((total, item) => total + item.price, 0);
  const total = subtotal + subtotal * 0.1;
  const formattedTotal = Math.floor(total);

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

  const handlePayment = async () => {
    if (selected.length === 0) {
      console.error("Tidak ada item yang dipilih untuk pembayaran.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/transactions/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: `order-${Math.random().toString(36).substr(2, 9)}`,
            grossAmount: formattedTotal,
            customerDetails: {
              first_name: "Dafa",
              last_name: "gaming",
              email: "dafagaming@gmail.com",
              phone: "08123456789",
            },
          }),
        }
      );

      const transactionData = await response.json();

      if (transactionData.token) {
        window.snap.pay(transactionData.token, {
          onSuccess: async function (result) {
            console.log("Payment success:", result);
            await updateTransaction(result.order_id, "success");
          },
          onPending: async function (result) {
            console.log("Payment pending:", result);
            await updateTransaction(result.order_id, "pending");
          },
          onError: function (result) {
            console.log("Payment error:", result);
          },
          onClose: function () {
            console.log("Payment popup closed");
          },
        });
      } else {
        console.error("Token Snap tidak ditemukan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateTransaction = async (orderId, status) => {
    try {
      await fetch("http://localhost:3000/api/transactions/update-transaction", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          status: status,
        }),
      });
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "cartAssets", id);
      await deleteDoc(itemDoc);
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
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
          Anda mempunyai {selected.length} item dalam keranjang
        </p>

        <div className="flex flex-col md:flex-row md:justify-center p-4">
          <div className="col-span-4 space-y-6 md:w-2/3">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-20 p-4 rounded-lg shadow-md mb-4 mx-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-4"
                    checked={item.selected}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  {item.Image ? (
                    <img
                      src={item.Image || item.datasetImage}
                      alt={item.datasetName || "Dataset image"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={CustomImage}
                      alt="Custom image"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="ml-4">
                    <h3 className="font-semibold">
                      {item.imageName || item.datasetName}
                    </h3>
                    <p>Category: {item.category}</p>
                    <p className="text-gray-700 mt-1">
                      Rp. {(item.price || 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteItem(item.id)}>
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          {/* Detail Pembayaran Section */}
          <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full md:w-[320px] mt-4 md:mt-0 mx-auto">
            <h4 className="text-gray-950 font-semibold mb-2">
              Detail Pembayaran
            </h4>
            <p className="text-gray-700">
              Subtotal ({selected.length} items): Rp.
              {subtotal.toLocaleString("id-ID")}
            </p>
            <p className="text-gray-700">
              Total (Termasuk PPN 10%): Rp.
              {formattedTotal.toLocaleString("id-ID")}
            </p>
            <button
              className="mt-6 sm:mt-0 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 w-full bg-blue-600 text-white py-2 rounded-md"
              onClick={handlePayment}>
              Proses Ke Pembayaran
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-darknavy dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90  min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[10px] sm:text-[12px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All right reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
};

export default Cart;
