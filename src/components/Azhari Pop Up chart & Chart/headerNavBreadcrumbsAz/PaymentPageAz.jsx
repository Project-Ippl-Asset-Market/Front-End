import { useEffect, useState } from 'react';
import IconUser from "../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../assets/logo/logoLogin.png";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.png";
import IconMenu from "../../assets/icon/iconSidebar/iconMenu.png";
import IconHapus from "../../assets/icon/iconCRUD/iconHapus.png";
import { collection, getDocs,addDoc,deleteDoc,doc,query,where } from 'firebase/firestore';
import {db, auth} from "../../firebase/firebaseConfig";
import {NavbarSection} from "../website/web_User-LandingPage/NavbarSection";
import Header from "../headerNavBreadcrumbs/HeaderWebUser";
import { onAuthStateChanged } from 'firebase/auth';

// Payment Component
function PaymentPage() {

  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [user, setUser] = useState([0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State untuk popup
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const displayUsername = windowWidth < 420 ? username.slice(0, 4) : username;
  const [isAllSelected, setIsAllSelected] = useState(true);

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    try {
      // Menambahkan data ke koleksi 'users' di Firestore
      await addDoc(collection(db, "users"), {
        firstName,
        lastName,
        email,
        phoneNumber,
      });
      alert("Payment and user details submitted successfully!");
      // Reset form setelah submit
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error submitting form data: ", error);
    }
  };

  //Isi Chart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(
          currentUser.displayName || currentUser.email.split("@")[0] || "User"
        );
      } else {
        setUser(null);
        setUsername("");
      }
    });

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log('No user logged in');
        return; // Jika tidak ada pengguna yang login, tidak perlu mengambil data
      }
      
      try {
        console.log('Logged in user UID:', user.uid);
        const q = query(collection(db, 'cartPopUp'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        setItems(data); // Simpan item ke state
        setItemCount(querySnapshot.size); // Simpan jumlah dokumen/item

        const totalPrice = data.reduce((sum, item) => {
            return sum + (item.price || 0); // Pastikan field price ada, jika tidak, gunakan 0
          }, 0);
        const formattedTotalPrice = totalPrice.toLocaleString('id-ID');
  
        setTotalPrice(formattedTotalPrice);

      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Fungsi untuk menghapus item dari Firestore dan state
  const handleRemove = async (id) => {
    try {
      const docRef = doc(db, 'cartPopUp', id);
      await deleteDoc(docRef);
      setItems(items.filter((item) => item.id !== id));
      setSelectedItems(selectedItems.filter((item) => item.id !== id)); // Hapus dari selectedItems jika dihapus
      updateItemCountAndTotalPrice(selectedItems.filter((item) => item.id !== id)); // Perbarui itemCount dan totalPrice
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  // Fungsi untuk menangani perubahan checkbox 'Pilih Semua'
  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedItems([]); // Kosongkan semua jika 'Pilih Semua' dinonaktifkan
    } else {
      setSelectedItems(items); // Pilih semua item jika 'Pilih Semua' diaktifkan
    }
    setIsAllSelected(!isAllSelected); // Toggle status 'Pilih Semua'
    updateItemCountAndTotalPrice(!isAllSelected ? items : []); // Update itemCount dan totalPrice
  };

  // Fungsi untuk mengubah status checkbox dan memperbarui item terpilih
  const handleCheckboxChange = (item) => {
    let updatedSelectedItems;
  
    if (selectedItems.includes(item)) {
      updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
    } else {
      updatedSelectedItems = [...selectedItems, item];
    }
  
    setSelectedItems(updatedSelectedItems);
    updateItemCountAndTotalPrice(updatedSelectedItems);
  
    // Cek apakah semua item sudah dipilih untuk memperbarui status 'Pilih Semua'
    setIsAllSelected(updatedSelectedItems.length === items.length);
  };

   // Fungsi untuk memperbarui itemCount dan totalPrice
   const updateItemCountAndTotalPrice = (selectedItems) => {
    setItemCount(selectedItems.length);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalPrice(totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }));
  };

  return (
    //Header     
    <div className="bg-white dark:bg-[#212121]">
      <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
        <div className="pt-[80px]  w-full">
          <Header />
        </div>
        <NavbarSection />
      </div>

      {/* Content */}
      <main className="mt-[10%] justify-items-center flex-col md:flex-row flex justify-center px-4 md:">
        {/* Cart Items */}
        <div className="w-full">
          <h1 className="text-lg text-2xl font-semibold mb-3 text-black text-3xl dark:text-white">Keranjang Belanja</h1>
          <div className="border-t border-gray-600 mb-4"></div>
          <p className='mt-4 text-black dark:text-white'>Anda mempunyai 3 item dalam keranjang</p>
          <div className='h-[700px] rounded-lg overflow-y-auto h-3'>
            <div className='flex font-medium w-40 h-8 mt-6 items-center p-2.5 shadow-lg border rounded-lg ml-[5%] text-black dark:text-white'>
              <input
                type="checkbox"
                className="flex w-5 h-5 mr-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-black dark:focus:ring-black dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={isAllSelected} // Checkbox 'Pilih Semua' dicentang jika semua item terpilih
                onChange={handleSelectAllChange} // Panggil fungsi saat status berubah
              />
              <p>Pilih Semua</p>
            </div>
            <div className="mt-5 space-y-[26px]">
            {items.map((item, index) => (
              <div key={index} className="w-[90%] h-[165px] mx-auto flex flex-col align-middle justify-between md:flex-row bg-transparent shadow-lg text-black dark:text-white border p-4 rounded-lg">
                {/* Content for each item */}
                <div className="flex items-center">
                <input
                      id={`checkbox-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-black dark:focus:ring-black dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedItems.includes(item)} // Checkbox tercentang jika item terpilih
                      onChange={() => handleCheckboxChange(item)} // Mengubah status checkbox
                    />
                  <label htmlFor="red-checkbox" className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'></label>
                  <img src={item.datasetImage || Logo} alt="Product" className="w-14 h-14 mr-4" />
                  <div>
                    {/* Pastikan mengakses properti spesifik dari objek */}
                    <h2 className="font-semibold truncate overflow-hidden whitespace-nowrap w-[450px]">{item.datasetName || item.imageName} - {item.description}</h2>
                    <p className="text-sm">PixelStoreID</p>
                  </div>
                </div>
                <div className='my-auto'>
                  {/* Akses properti price dari objek */}
                  <p className='ml-3 mt-1 text-[#141414] justify-self-end text-sm'>
                    {item.price?.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    })}
                  </p>

                </div>
                {/* Tombol Hapus */}
                <div className="flex flex-col items-start">
                  <button 
                  onClick={() => handleRemove(item.id)}
                  className='my-auto bg-grey hidden md:block'>
                    <img src={IconHapus} alt="IconHapus"/>
                  </button>
                  <button 
                  onClick={() => handleRemove(item.id)}
                  className='my-auto block md:hidden hover:text-red-500 hover:underline'>
                    <p className="text-base">Delete</p>
                  </button>
                </div>
              </div>
            ))}
            </div> 
          </div> 
        </div>     

        {/* Payment Details */}
        <div className="w-[80%] md:w-[600px] h-[20%] mx-auto overflow-hidden mt-[7%] bg-transparent shadow-lg border border-grey p-4 sm:p-2 rounded-lg text-black dark:text-white sticky top-[20px]">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cardType" className="block mb-2 text-xl font-bold">
                Detail Pembayaran
              </label>
              <label className="block mb-2 text-sm">({itemCount}) item terpilih</label>
            </div>
            {/*Nama*/}
            <div className='mb-4 flex justify-between items-center'>
            {/* Input Nama Depan */}
              <div className='mr-2'>
                <label htmlFor="firstName" className="block mb-2 text-sm">Nama Depan</label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              {/* Input Nama Belakang */}
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm">Nama Belakang</label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Input Nomor HP */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2 text-sm">Nomor HP</label>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {/* Bagian Ringkasan dan Total */}
            <div className="text-black dark:text-white">
              <div className="border-t border-gray-600 mb-4"></div>
              <div className="flex justify-between items-center">
                <p className="w-[70px] h-[24px] text-sm font-bold text-xl">subtotal</p>
                <p className="text-sm font-semibold">Rp.{totalPrice}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="w-[172px] h-[24px] text-sm font-semi-bold mt-2">
                  Total <span className="font-normal">(termasuk PPN)</span>
                </p>
                <p className="text-sm font-semibold mt-2">Rp.{totalPrice}</p>
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full h-[43px] mt-6 bg-green-500 justify-center p-2 rounded-md text-white flex"
            >
              <div>Proses ke Pembayaran</div>
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#ECECEC] text-black dark:bg-[#201E43] mt-[100px] dark:text-white text-sm py-6 font-roboto">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-center font-semibold">
          <a href="#" className="hover:underline">Terms And Conditions</a>
          <a href="#" className="hover:underline">File Licenses</a>
          <a href="#" className="hover:underline">Refund Policy</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        <p className="text-center mt-4">Copyright © 2024 - All rights reserved by ACME Industries Ltd</p>
      </footer>
    </div>
  );
}

export default PaymentPage;
