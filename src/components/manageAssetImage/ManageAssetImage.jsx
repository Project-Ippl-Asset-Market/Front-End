import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import NavigationItem from "../sidebarDashboardAdmin/navigationItemsAdmin";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.svg";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconHapus from "../../assets/icon/iconCRUD/iconHapus.png";
import IconEdit from "../../assets/icon/iconCRUD/iconEdit.png";
import HeaderSidebar from "../headerNavBreadcrumbs/HeaderSidebar";
import { db, auth } from '../../firebase/firebaseConfig'; // Pastikan ini mengarah ke file konfigurasi Firebase Anda
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore"; // Impor yang diperlukan
import { onAuthStateChanged } from 'firebase/auth';


function ManageAssetImage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [assets, setAssets] = useState([]);
  const [user, setUser] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    // Mengamati perubahan status autentikasi pengguna
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // CRUD (READ) ---------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log('No user logged in');
        return; // Jika tidak ada pengguna yang login, tidak perlu mengambil data
      }
      
      try {
        console.log('Logged in user UID:', user.uid);
        const q = query(collection(db, 'assetImages'), where('userID', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const items = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          console.log('Data fetched:', data);

          const creatAt = data.uploadedAt?.toDate().toLocaleDateString("id-ID", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) || 'N/A';

          // Susun data ke dalam format assets
          items.push({
            id: doc.id, // Simpan ID dokumen untuk keperluan penghapusan
            title: data.imageName,
            description: data.description,
            price: `Rp. ${data.price}`,
            image: data.uploadUrlImage,
            category: data.category,
            creatAt,
          });
        }
       
        setAssets(items);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // CRUD (DELETE) ---------------------------------------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
  
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'assetImages', id)); // Menghapus dokumen dari Firestore
        setAssets(assets.filter(asset => asset.id !== id)); // Perbarui state untuk menghapus item dari tampilan
        alert("Images deleted successfully");
      } catch (error) {
        console.error('Error deleting image: ', error);
        alert('Failed to delete');
      }
    } else {
      // Optional: Provide feedback if the user cancels the deletion
      alert("Deletion cancelled");
    }
  };

  return (
    <>
      <div className="dark:bg-neutral-90 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
        <HeaderSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <aside
          ref={sidebarRef}
          id="sidebar-multi-level-sidebar"
          className={`fixed top-0 left-0 z-40 w-[280px] transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-neutral-10 bg-neutral-100 dark:text-primary-100 text-neutral-10 pt-10">
            <NavigationItem />
          </div>
        </aside>

        {/* Isi Konten */}
        <div className="p-8 sm:ml-[280px] h-full bg-primary-100 text-neutral-10 dark:bg-neutral-20 dark:text-neutral-10 min-h-screen pt-24">
          <div className="breadcrumbs text-sm mt-1 mb-10">
            <Breadcrumb />
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* Button Container */}
            <div className="w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-start">
                <div className="flex bg-primary-2 rounded-lg items-center w-full md:w-36">
                  <Link
                    to="/manageAssetImage/add"
                    className="rounded-lg flex justify-center items-center text-[14px] bg-secondary-40 hover:bg-secondary-30 text-primary-100 dark:text-primary-100 mx-auto h-[45px] w-full md:w-[400px]">
                    + Add Image
                  </Link>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="form-control w-full">
              <div className="relative h-[48px] bg-primary-100 dark:bg-neutral-20 rounded-lg border border-neutral-90 dark:border-neutral-25 dark:border-2">
                <img
                  src={IconSearch}
                  alt="iconSearch"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="input border-none bg-primary-100 dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 pl-10 h-[40px] w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg p-8 dark:bg-neutral-25">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-primary-100 dark:text-neutral-90">
              <thead className="text-xs text-neutral-20 uppercase dark:bg-neutral-25 dark:text-neutral-90 border-b dark:border-neutral-20">
                <tr>
                  <td scope="col" className="px-6 py-3">
                    Image Preview
                  </td>
                  <th scope="col" className="px-6 py-3">
                    Image Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="justify-center mx-auto">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <tr key={asset.id} className="bg-primary-100 dark:bg-neutral-25 dark:text-neutral-9">
                    <td>
                      <img
                       src={asset.image}
                        alt={asset.title}
                        className="w-12 h-12 rounded-lg" />
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-neutral-90 whitespace-nowrap">
                      {asset.title}
                    </th>
                    <td className="px-6 py-4">{asset.category}</td>
                    <td className="px-6 py-4">{asset.price}</td>
                    <td className="px-6 py-4">{asset.creatAt || 'N/A'}</td>
                    <td className="mx-auto flex gap-4 mt-2">
                      <Link to={`/manageAssetImage/edit/${asset.id}`}>
                        <img src={IconEdit} alt="icon edit" className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(asset.id)}>
                        <img src={IconHapus} alt="icon hapus" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex join pt-72 justify-end ">
            <button className="join-item btn bg-secondary-40 hover:bg-secondary-50 border-secondary-50 hover:border-neutral-40 opacity-70">
              «
            </button>
            <button className="join-item btn dark:bg-neutral-25 bg-neutral-60 text-primary-100 hover:bg-neutral-70 hover:border-neutral-25 border-neutral-60 dark:border-neutral-25">
              Page 1
            </button>
            <button className="join-item btn bg-secondary-40 hover:bg-secondary-50 border-secondary-50 hover:border-neutral-40 opacity-70">
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageAssetImage;
