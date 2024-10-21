// Kerjaan Fhiqi

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  Timestamp,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { db, storage, auth } from "../../firebase/firebaseConfig";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconField from "../../assets/icon/iconField/icon.svg";
import HeaderNav from "../HeaderNav/HeaderNav";
import DefaultPreview from "../../assets/icon/iconSidebar/datasetzip.png";

function AddCategory({ isOpen, onClose, onAddCategory }) {
  const [user, setUser] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user
      } else {
        setUser(null); // No user is logged in
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Nama kategori tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, "categoryDataset"), {
        name: categoryName,
        createdAt: new Date(),
        userId: user.uid,
      });

      // Buat objek kategori baru
      const newCategory = {
        id: docRef.id,
        name: categoryName,
        createdAt: new Date(),
      };

      // Panggil fungsi dari komponen induk untuk menambahkan kategori ke state
      onAddCategory(newCategory);

      setCategoryName(""); // Reset input
      onClose(); // Tutup modal
    } catch (error) {
      console.error("Error menambahkan kategori: ", error);
      alert("Terjadi kesalahan saat menambahkan kategori. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Fungsi untuk menutup popup
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-20 p-6 rounded-2xl w-[510px] h-[250px] font-poppins text-black dark:text-white">
        <h1 className="h-7 font-semibold">Category</h1>
        <h2 className="h-14 flex items-center">Add category</h2>
        {/* Form untuk menambahkan kategori */}
        <input
          type="text"
          placeholder="type here"
          className="border border-[#ECECEC] w-full h-12 mb-1 rounded-lg text-sm text-black placeholder:font-semibold placeholder:opacity-40"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)} // Mengambil input dari pengguna
          disabled={isSubmitting}
        />
        <div className="relative h-[70px]">
          <div className="absolute bottom-0 right-0 flex justify-end space-x-2 font-semibold text-sm">
            <button
              onClick={handleClose}
              className="bg-[#9B9B9B] text-white h-12 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting} // Disable tombol saat proses submit
              className={`bg-[#2563EB] text-white h-12 px-4 py-2 rounded-lg  ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddNewDataset() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false); // State untuk popup AddCategory
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (user) {
        const q = query(
          collection(db, "categoryDataset"),
          where("userId", "==", user.uid)
        );
        try {
          const querySnapshot = await getDocs(q);
          const categoriesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategories(categoriesData);
          console.log("Fetched categories", categoriesData);
        } catch (error) {
          console.error("Error fetching categories: ", error);
        }
      }
    };

    fetchCategories();
  }, [user]);

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  // Fungsi untuk membuka popup AddCategory
  const handleOpenAddCategory = () => {
    setIsAddCategoryOpen(true);
  };

  // Fungsi untuk menutup popup AddCategory
  const handleCloseAddCategory = () => {
    setIsAddCategoryOpen(false);
  };

  const [dataset, setDataset] = useState({
    datasetName: "",
    category: "",
    description: "",
    price: "",
    datasetImage: null,
  });

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user
      } else {
        setUser(null); // No user is logged in
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "datasetImage" && files[0]) {
      setDataset({
        ...dataset,
        datasetImage: files[0],
      });

      // Create image preview
      if (files[0].type.includes("image")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        // Reset preview jika file bukan gambar
        setPreviewImage(DefaultPreview);
      }
    } else {
      setDataset({
        ...dataset,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Konversi dataset.price menjadi number
      const priceAsNumber = parseInt(dataset.price);

      if (isNaN(priceAsNumber)) {
        // Validasi jika harga yang diinput tidak valid
        throw new Error("Invalid price: must be a number.");
      }

      // Save dataset details to Firestore
      const docRef = await addDoc(collection(db, "assetDatasets"), {
        category: dataset.category,
        createdAt: Timestamp.now(),
        datasetImage: "",
        datasetName: dataset.datasetName,
        description: dataset.description,
        price: priceAsNumber, // Simpan sebagai number
        uploadedByEmail: user.email,
        userId: user.uid,
      });

      const docId = docRef.id;

      // Upload dataset image/file to Firebase Storage
      let datasetImageUrl = "";
      if (dataset.datasetImage) {
        // Ambil nama asli file dan ekstrak ekstensi
        const originalFileName = dataset.datasetImage.name;
        const fileExtension = originalFileName.split(".").pop(); // Mengambil ekstensi file

        // Ref untuk upload file ke Storage dengan ekstensi asli
        const imageRef = ref(
          storage,
          `images-dataset/dataset-${docId}.${fileExtension}`
        );

        // Upload file ke Storage
        await uploadBytes(imageRef, dataset.datasetImage);
        datasetImageUrl = await getDownloadURL(imageRef);
      }

      // Update Firestore dengan URL gambar yang diupload
      await updateDoc(doc(db, "assetDatasets", docId), {
        datasetImage: datasetImageUrl,
      });

      // Reset the form
      setDataset({
        datasetName: "",
        category: "",
        description: "",
        price: "",
        datasetImage: null,
      });
      setPreviewImage(null);

      // Navigate back to /manage-asset-dataset
      setAlertSuccess(true);
      setTimeout(() => {
        navigate("/manage-asset-dataset");
      }, 2000);
    } catch (error) {
      console.error("Error menambahkan dataset: ", error);
      setAlertError(true);
    }
  };

  const handleCancel = () => {
    navigate("/manage-asset-dataset");
  };

  const closeAlert = () => {
    setAlertError(false);
  };

  return (
    <>
      <div className="bg-primary-100 dark:bg-neutral-20 font-poppins h-full min-h-screen">
        <div className="bg-primary-100 p-4 mt-14">
          <HeaderNav />
        </div>

        <div className="overflow-scroll ">
          <div className="bg-primary-100 dark:bg-neutral-20 dark:text-primary-100 flex flex-col">
            <div className="text-2xl dark:text-primary-100 p-4">
              <Breadcrumb />
            </div>
          </div>

          {/* Alert Success */}
          {alertSuccess && (
            <div
              role="alert"
              className="fixed top-10 left-1/2 transform -translate-x-1/2 w-[300px] sm:w-[300px] md:w-[400px] lg:w-[400px] xl:w-[400px] 2xl:w-[400px] text-[10px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] -translate-y-1/2 z-50 p-4  bg-success-60 text-white text-center shadow-lg cursor-pointer transition-transform duration-500 ease-out rounded-lg"
              onClick={closeAlert}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Dataset baru berhasil ditambahkan dan tersimpan.</span>
              </div>
            </div>
          )}

          {/* Alert Error */}
          {alertError && (
            <div
              role="alert"
              className="fixed top-10 left-1/2 transform -translate-x-1/2 w-[340px] sm:w-[300px] md:w-[400px] lg:w-[400px] xl:w-[400px] 2xl:w-[400px] text-[8px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[12px] 2xl:text-[12px] -translate-y-1/2 z-50 p-4  bg-primary-60 text-white text-center shadow-lg cursor-pointer transition-transform duration-500 ease-out rounded-lg"
              onClick={closeAlert}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Gagal menambahkan dataset baru silahkan coba lagi</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mx-0 sm:mx-0 md:mx-0 lg:mx-0 xl:mx-28 2xl:mx-24   h-[1434px] gap-[50px]  overflow-hidden  mt-4 sm:mt-0 md:mt-0 lg:-mt-0 xl:mt-0 2xl:-mt-0"
          >
            <h1 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-10 dark:text-primary-100 p-4">
              Add New Dataset
            </h1>
            <div className="p-8 -mt-4  bg-primary-100  dark:bg-neutral-20 rounded-sm shadow-lg">
              <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                Dataset Information
              </h2>

              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-[150px] md:w-[170px] lg:w-[200px] xl:w-[220px] 2xl:w-[170px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                      Upload File
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-3 lg:w-3 xl:w-3 2xl:w-3 h-2 sm:h-2 md:h-3 lg:h-3 xl:h-3 2xl:h-3 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px] mb-2">
                    Format foto harus .jpg, jpeg,png dan ukuran minimal 300 x
                    300 px.
                  </p>
                </div>
                <div className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-2 md:gap-2 lg:gap-6 xl:gap-6 2xl:gap-10">
                    <div className="mt-2 md:ml-2 lg:ml-4 xl:ml-6 2xl:ml-4 flex justify-center items-center border border-dashed border-neutral-60 w-[100px] h-[100px] sm:w-[100px] md:w-[120px] lg:w-[150px] sm:h-[100px] md:h-[120px] lg:h-[150px] xl:h-[150px] 2xl:h-[160px]">
                      <label
                        htmlFor="fileUpload"
                        className="flex flex-col justify-center items-center cursor-pointer text-center"
                      >
                        {!previewImage && (
                          <>
                            <img
                              alt=""
                              className="w-6 h-6"
                              src="path_to_your_icon"
                            />
                            <span className="text-primary-0 text-xs font-light mt-2 dark:text-primary-100">
                              Upload Foto
                            </span>
                          </>
                        )}

                        <input
                          type="file"
                          id="fileUpload"
                          name="datasetImage"
                          onChange={handleChange}
                          multiple
                          accept=".jpg,.jpeg,.png,.zip,.rar,.csv,.xls,.xlsx,.pdf"
                          className="hidden"
                        />

                        {previewImage && (
                          <div className="mt-2 relative">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-40 sm:w-40 md:w-40 lg:w-[150px] xl:w-[150px] 2xl:w-[150px] h-40 sm:h-40 md:h-40 lg:h-[156px] xl:h-[156px] 2xl:h-[157px] -mt-2.5 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(null);
                                setDataset({ ...dataset, datasetImage: null });
                              }}
                              className="absolute top-0 right-0 m-0 -mt-3 bg-primary-50 text-white px-2 py-1 text-xs rounded"
                            >
                              x
                            </button>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dataset Name */}
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                      Dataset Name
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-3 lg:w-3 xl:w-3 2xl:w-3 h-2 sm:h-2 md:h-3 lg:h-3 xl:h-3 2xl:h-3 -mt-5"
                    />
                  </div>
                  <p className="w-full text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[12px]">
                    Masukkan Nama Untuk Dataset Maximal 40 Huruf
                  </p>
                </div>

                <div className="flex justify-start items-start w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px]"
                      name="datasetName"
                      value={dataset.datasetName}
                      onChange={handleChange}
                      placeholder="Enter name...."
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                      Category
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-3 lg:w-3 xl:w-3 2xl:w-3 h-2 sm:h-2 md:h-3 lg:h-3 xl:h-3 2xl:h-3 -mt-5"
                    />
                  </div>
                  <p className="w-full text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[12px]">
                    Silahkan Pilih Kategori Yang Sesuai Dengan Dataset Anda.
                  </p>
                </div>

                <div className="flex justify-start items-center w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <select
                      name="category"
                      value={dataset.category}
                      onChange={(e) =>
                        setDataset((prevState) => ({
                          ...prevState,
                          category: e.target.value,
                        }))
                      }
                      className="w-full border-none focus:outline-none focus:ring-0 text-neutral-20 text-[12px] bg-transparent h-[40px] -ml-2 rounded-md"
                    >
                      <option value="" disabled>
                        Pick an option
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div
                    type="button"
                    onClick={handleOpenAddCategory}
                    className="h-[48px] w-[48px] bg-blue-700 text-white flex items-center justify-center rounded-md shadow-md hover:bg-secondary-50 transition-colors duration-300 cursor-pointer ml-2 text-4xl"
                  >
                    +
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Deskripsi
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-3 lg:w-3 xl:w-3 2xl:w-3 h-2 sm:h-2 md:h-3 lg:h-3 xl:h-3 2xl:h-3 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px]">
                    Berikan Deskripsi Pada Dataset Anda Maximal 200 Huruf
                  </p>
                </div>
                <div className="flex justify-start items-start w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <textarea
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] h-[48px] sm:h-[60px] md:h-[80px] lg:h-[80px] xl:h-[100px] bg-transparent"
                      name="description"
                      value={dataset.description}
                      onChange={handleChange}
                      placeholder="Deskripsi"
                      rows="4"
                    />
                  </label>
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                      Price
                    </h3>
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[12px]">
                    Silahkan Masukkan Harga Untuk Dataset jika asset gratis
                    silahkan dikosongkan.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="number"
                      className="input border-0 focus:outline-none focus:ring-0  w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      name="price"
                      value={dataset.price}
                      onChange={handleChange}
                      placeholder="Rp"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full inline-flex sm:gap-6 xl:gap-[21px] justify-center sm:justify-center md:justify-end  gap-6 mt-12 sm:mt-12 md:mt-14 lg:mt-14 xl:mt-12  ">
              <button
                onClick={handleCancel}
                className="btn bg-neutral-60 border-neutral-60 hover:bg-neutral-60 hover:border-neutral-60 rounded-lg  font-semibold   text-primary-100 text-center text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn  bg-secondary-40 border-secondary-40 hover:bg-secondary-40 hover:border-secondary-40 rounded-lg  font-semibold leading-[24px]  text-primary-100 text-center  text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]"
              >
                Save
              </button>
            </div>
          </form>
          <AddCategory
            isOpen={isAddCategoryOpen}
            onClose={handleCloseAddCategory}
            onAddCategory={handleAddCategory}
          />
        </div>
      </div>
    </>
  );
}

export default AddNewDataset;