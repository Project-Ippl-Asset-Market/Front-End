import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from "../../firebase/firebaseConfig";
import { useTheme } from "../../contexts/ThemeContext";
import IconLightMode from "../../assets/icon/iconDarkMode&LigthMode/ligth_mode.svg";
import IconDarkMode from "../../assets/icon/iconDarkMode&LigthMode/dark_mode.svg";
import IconUserDark from "../../assets/icon/iconDarkMode&LigthMode/iconUserDark.svg";
import IconUserLight from "../../assets/icon/iconDarkMode&LigthMode/iconUserLight.svg";
import IconLogoutDark from "../../assets/icon/iconDarkMode&LigthMode/logOutDark.svg";
import IconLogoutLight from "../../assets/icon/iconDarkMode&LigthMode/logOutLight.svg";
import IconCart from "../../assets/icon/iconHeader/iconCart.svg";
import IconMyAsset from "../../assets/icon/iconHeader/iconMyasset.svg";
import logoWeb from "../../assets/logo/logoWeb.png";
import DefaultPreview from "../../assets/icon/iconSidebar/datasetzip.png"

function HeaderSidebar() {

  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State untuk popup
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const displayUsername = windowWidth < 420 ? username.slice(0, 4) : username;
  

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
        const q = query(collection(db, 'cartAssets'), where('userId', '==', user.uid));
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



  // Handle klik di luar popup
  useEffect(() => {
    const handleClickOutside = (event) => {
        const popup = document.querySelector("#popup-cart"); // Sesuaikan selector popup
        if (popup && !popup.contains(event.target)) {
          setIsPopupVisible(false); // Tutup popup
        }
      };
    
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  // Fungsi toggle untuk mengubah status popup
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };


  // Fungsi handleLogout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleRemove = async (id, itemPrice) => {
    try {
      const docRef = doc(db, 'cartAssets', id);
      await deleteDoc(docRef);
      console.log(`Successfully deleted document with ID: ${id}`);
  
      // Update item count and total price after removing an item
      setItems(items.filter((item) => item.id !== id));
      setItemCount(itemCount - 1);
  
      // Pastikan itemPrice dalam bentuk angka dan kurangi dari totalPrice
      const updatedTotalPrice = totalPrice.replace(/[^0-9]/g, "") - itemPrice; // Hapus karakter non-numeric dari totalPrice sebelum dikurangi
      setTotalPrice(updatedTotalPrice.toLocaleString('id-ID')); // Set formatted total price
  
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };
  
   // Event handler untuk tombol "Lihat Keranjang"
   const handleViewCart = () => {
    navigate('/cart'); // Mengarahkan ke halaman Cart
  };
  

  return (
    <div className="h-20 sm:h-0 md:h-0 lg:h-0 xl:h-0 2xl:h-0">
      <section className="navbar h-28 fixed z-40 top-0 left-0 pt-0 text-neutral-10  font-poppins font-semibold dark:text-primary-100 bg-primary-100 dark:bg-neutral-20 gap-2">
        <div className="flex-1 gap-2 w-full">
          <img src={logoWeb} alt="logo" className="w-20 h-20" />
          <h2 className="text-[10px] sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl">
            PixelStore
          </h2>
        </div>

        <div className=" md:flex justify-center w-full ">
          {/* Form Search di Layar Besar */}
          <div className="hidden md:flex justify-center w-full ">
            <form className="w-full  mx-auto px-20">
              <div className="relative">
                <div className="relative">
                  <input
                    type="search"
                    id="location-search"
                    className="block w-full p-4 pl-24 placeholder:pr-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder=""
                    required
                  />
                  <span className="absolute inset-y-0 left-2 flex items-center text-gray-500 dark:text-gray-400">
                    Search
                  </span>
                  <span className="absolute inset-y-0 left-20 flex items-center text-neutral-20 dark:text-neutral-20 text-[20px]">
                    |
                  </span>
                </div>

                <button
                  type="submit"
                  className="absolute w-20 top-0 right-0 h-full p-4 mx-auto text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg
                    className="w-5 h-5 mx-auto"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only text-[8px] sm:text-[10px] md:text-[12px] lg:text-[12px] xl:text-[12px 2xl:text-[14px]">
                    Search
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* cart an my asset */}
        <div className="gap-14 sm:gap-1 md:gap-8 lg:gap-8 xl:gap-2 2xl:gap-10 flex justify-center items-center ">
          <Link
            to=""
            className="w-[45px] sm:w-[45px] md:w-[44px] lg:w-[44px] xl:w-[60px] 2xl:w-[34px] h-[20px]  sm:h-[28px] md:h-[28px] lg:h-[28px] xl:h-[28px] 2xl:h[28px] -ml-[30px]  sm:ml-1 md:ml-1 lg:ml-0 xl:ml-0 2xl:ml-2 gap-2  text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] xl:text-[10px 2xl:text-[10px]">
            <img
              src={IconMyAsset}
              alt="icon my asset"
              className="w-[24px] h-[24px]"
            />
            <label className="-ml-4 ">My asset</label>
          </Link>
          <div id="popup-cart" className="gap-14 sm:gap-1 md:gap-8 lg:gap-8 xl:gap-2 2xl:gap-10 flex justify-center items-center">
            <Link
              onClick={togglePopup}
              to=""
              className="dropdown dropdown-end w-[20px] sm:w-[45px] md:w-[28px] lg:w-[28px] xl:w-[28px] 2xl:w-[28px] h-[20px]  sm:h-[28px] md:h-[28px] lg:h-[28px] xl:h-[28px] 2xl:h[28px] -ml-[30px]  sm:ml-1 md:ml-1 lg:ml-0 xl:ml-0 2xl:ml-2 gap-2  text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] xl:text-[10px 2xl:text-[10px]">
              <img src={IconCart} alt="icon cart" className="w-[24px] h-[24px]" />
              <label className="">Cart</label>
            </Link>
            {isPopupVisible && (
                <div className="bg-white dark:text-white border rounded-lg dark:bg-[#212121] dark:text-white space-y-4 rounded-lg absolute flex-col top-20 right-8 w-[350px] h-[500px] bg-white shadow-lg rounded-lg pr-4 pl-4 pb-4 z-10">
                  <p className="dark:text-[#EBF4F6] mt-4 text-[#000000] font-semibold">Isi Keranjang</p>
                  {/* Video YouTube */}
                  <div className="relative h-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/MOZOtdeiaF0?autoplay=1"
                      title="YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="overflow-y-auto h-[270px]">
                    <div>
                      {items.length === 0 ? (
                            <p className="dark:text-white ">Kosong...</p>
                          ) : (  
                          items.map((item, index) => (
                            <div key={index} className="mb-4">
                              {/* Content for each item */}
                              <div className="flex bg-blue-100 h-20 rounded-[10px] dark:bg-[#1687A7] ">
                                <button className="mt-0 w-20 h-20 bg-[#F2F2F2] bg-contain rounded-[10px]">
                                  <img src={item.datasetImage || item.uploadUrlImage|| DefaultPreview || item.uploadUrlVideo } alt="Datasetzip" className='w-full h-full object-cover rounded-[10px]' />
                                </button>
                                <div className="ml-5 content-center text-left">
                                  <p className="dark:text-[#EBF4F6] text-xs text-[#141414]">Glics Photograpy</p>
                                  <p className="dark:text-[#EBF4F6] text-base font-bold text-[#141414] truncate overflow-hidden whitespace-nowrap w-[150px]">{item.datasetName || item.imageName} - {item.description}</p>
                                  <div className='flex'>
                                    <div>
                                    <button
                                      onClick={() => handleRemove(item.id, item.price)} // Tambahkan event handler untuk remove
                                      className='text-sm font-medium text-[#141414] hover:underline hover:text-red-600'>
                                      Remove
                                    </button>
                                    </div>
                                    <div>
                                    <p className='ml-3 mt-1 text-[#141414] justify-self-end text-sm'>
                                      {item.price?.toLocaleString('id-ID', {
                                          style: 'currency',
                                          currency: 'IDR'
                                      })}
                                      </p>

                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full h-0.5 bg-[#000000] opacity-50"></div>
                            </div>
                          ))
                        )}
                    </div>
                  </div>
                  {/* Checkout */}
                  <div className='dark:bg-[#212121] mt-80 sticky bottom-0 bg-white py-2 items-end'>
                    <div className='grid'>
                      <p className="dark:text-[#EBF4F6] justify-self-end text-sm text-[#000000] font-semibold mt-2">Subtotal ( {itemCount} Item ): Rp.{totalPrice},00 </p>
                    </div>
                    <div className='flex items-center justify-center mt-5'>
                      <button className="dark:bg-[#1687A7] text-center mt-1 bg-[#5487F8] text-white px-4 py-2 rounded hover:bg-[#2563EB]">
                        Checkout
                      </button>
                    </div>
                    <div className='flex items-center justify-center mt-2 mb-2'>
                      <button 
                        onClick={handleViewCart}
                        className="dark:text-[#1687A7] mt-0 text-[#2563EB] px-0 py-0 hover:underline">
                        Lihat Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Form Search untuk layar kecil */}
        <div className="md:hidden fixed top-16 w-full bg-primary-100 dark:bg-neutral-20 p-4 mt-12 -ml-2">
          <form className="flex items-center w-full">
            <input
              type="search"
              id="mobile-search"
              className="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="type..."
              required
            />
            <button
              type="submit"
              className="p-3 h-12 text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Search
            </button>
          </form>
        </div>

        <div className="flex-none gap-2">
          {user ? (
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex-none text-neutral-20 dark:text-primary-100">
                  <ul className="menu menu-horizontal">
                    <li>
                      <details className="relative ">
                        <summary className="cursor-pointer">
                          {displayUsername}
                        </summary>
                        <ul className="bg-neutral-90 dark:bg-neutral-20 rounded-lg w-48 shadow-lg">
                          <li className="flex mb-1 w-full h-8 transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                            <div className="flex items-center">
                              <img
                                src={darkMode ? IconUserDark : IconUserLight}
                                alt="User Icon"
                                className="w-5 h-5 me-2"
                              />
                              <button type="button">Profile</button>
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center justify-center p-2 bg-neutral-90 hover:rounded-lg dark:bg-neutral-20 transition-all duration-300 rounded-lg ">
                              <div
                                onClick={toggleDarkMode}
                                className="flex w-full h-8 transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none gap-4 p-1 ">
                                {darkMode ? (
                                  <img
                                    src={IconDarkMode}
                                    alt="icon dark mode"
                                    className="w-5 h-5 transition-transform duration-300"
                                  />
                                ) : (
                                  <img
                                    src={IconLightMode}
                                    alt="icon light mode"
                                    className="w-6 h-6 transition-transform duration-300"
                                  />
                                )}
                                <span
                                  className={`text-[13px] font-semibold transition-colors duration-300 hover:text-primary-100 ${
                                    darkMode
                                      ? "text-neutral-100"
                                      : "text-neutral-800"
                                  }`}>
                                  {darkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                              </div>
                            </div>
                          </li>
                          <li className="flex mb-1 w-full h-8 transition-colors duration-300 hover:bg-secondary-40 hover:text-primary-100 focus:outline-none">
                            <div
                              className="flex items-center"
                              onClick={handleLogout}
                            >
                              <img
                                src={
                                  darkMode ? IconLogoutDark : IconLogoutLight
                                }
                                alt="Logout Icon"
                                className="w-5 h-5 me-2"
                              />
                              <button type="button">Logout</button>
                            </div>
                          </li>
                        </ul>
                      </details>
                    </li>
                  </ul>
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar mx-2 w-14 h-14 rounded-full -ml-3">
                  <div className="w-14 h-14 p-3 rounded-full overflow-hidden bg-neutral-80 flex items-center justify-center text-secondary-40 font-bold text-2xl mx-auto">
                    {user ? (
                      user.photoURL ? (
                        <img
                          alt="Avatar"
                          src={user.photoURL}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-[22px] text-center mx-auto -ml-1">
                    
                        </span>
                      )
                    ) : (
                      <img
                        alt="Default User Icon"
                        src="/path/to/default-user-icon.svg"
                        className="w-10 h-10"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-none text-neutral-20 dark:text-primary-100">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <details>
                    <summary className="cursor-pointer">Hello, Sign in</summary>
                    <ul className="bg-neutral-90 dark:bg-neutral-20 rounded-t-none p-2">
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                      <li>
                        <Link to="/register">Register</Link>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HeaderSidebar;
