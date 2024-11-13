<<<<<<< HEAD
/* eslint-disable no-unused-vars */
//11/4/24
=======
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
import Breadcrumb from "../../breadcrumbs/Breadcrumbs";
import IconField from "../../../assets/icon/iconField/icon.svg";
import HeaderNav from "../../HeaderNav/HeaderNav";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase/firebaseConfig";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
<<<<<<< HEAD
=======
import DefaultPreview from "../../../assets/assetmanage/Iconrarzip.svg";
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c

function EditNewAsset3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertError, setAlertError] = useState(false);
<<<<<<< HEAD
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
=======
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c

  const categories = [
    { id: 1, name: "Animations" },
    { id: 2, name: "Characters" },
<<<<<<< HEAD
    { id: 3, name: "Environment" },
    { id: 4, name: "GUI" },
    { id: 5, name: "Props" },
    { id: 6, name: "Vegetation" },
    { id: 7, name: "Vehicles" },
  ];

  const [asset3D, setAsset3D] = useState({
    datasetName: "",
    category: "",
    description: "",
    price: "",
    asset3DThumbnail: null,
=======
    { id: 3, name: "Environtment" },
    { id: 4, name: "GUI" },
    { id: 5, name: "Props" },
    { id: 6, name: "Vegetation"},
    { id: 7, name: "Vehicle" },
  ];

  const [asset3D, setAsset3D] = useState({
    asset3DName: "",
    category: "",
    description: "",
    price: "",
    asset3DImage: null,
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
  });

  // Fetch existing data based on id
  useEffect(() => {
    const fetchasset3D = async () => {
      try {
        const docRef = doc(db, "assetImage3D", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAsset3D(data);

<<<<<<< HEAD
          if (data.asset3DThumbnail) {
            setImagePreview(data.asset3DThumbnail);
          }
        } else {
          // console.log("No such document!");
          navigate("/manage-asset-3D");
        }
      } catch (error) {
        // console.error("Error fetching Asset 3D:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataset();
=======
          if (data.asset3DImage) {
            setImagePreview(data.asset3DImage);
          }
        } else {
          console.log("No such document!");
          navigate("/manage-asset-asset3D");
        }
      } catch (error) {
        console.error("Error fetching asset3D:", error);
      }  
    };

    fetchasset3D();
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

<<<<<<< HEAD
    if (name === "asset3DThumbnail" && files[0]) {
      setAsset3D({
        ...asset3D,
        asset3DThumbnail: files[0],
=======
    if (name === "asset3DImage" && files[0]) {
      setAsset3D({
        ...asset3D,
        asset3DImage: files[0],
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
      });

      // Create image preview
      if (files[0].type.includes("image")) {
<<<<<<< HEAD
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
        // Reset preview jika file bukan gambar
        setImagePreview(files.asset3DThumbnail);
=======
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        // Reset preview jika file bukan gambar
        setImagePreview(files.asset3DImage);
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
      }
    } else {
      setAsset3D({
        ...asset3D,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const priceAsNumber = parseInt(asset3D.price);

      if (isNaN(priceAsNumber)) {
        // Validasi jika harga yang diinput tidak valid
        throw new Error("Invalid price: must be a number.");
<<<<<<< HEAD
      }

      let asset3DThumbnail = asset3D.asset3DThumbnail;
      if (imagePreview !== asset3D.asset3DThumbnail) {
        const storageFileName = `images-asset-3d/asset3D-${id}.jpg`;
        // Delete the old image if a new image is being uploaded
        const oldImageRef = ref(storage, storageFileName);
        await deleteObject(oldImageRef); // Delete the old image

        // Upload the new image
        const imageRef = ref(storage, `images-asset-3d/asset2d-${id}.jpg`);
        await uploadBytes(imageRef, asset3D.asset3DThumbnail);
        asset3DThumbnail = await getDownloadURL(imageRef);
      } else {
        // If no new image is uploaded, keep the old image URL
        // eslint-disable-next-line no-unused-vars
        asset3DThumbnail = imagePreview;
      }

=======
      }

      let asset3DImage = asset3D.asset3DImage;

      if (imagePreview !== asset3D.asset3DImage) {
        const fileName = imagePreview.split("/").pop().split("?")[0];
        const fileExtension = fileName.split(".").pop(); // Ekstensi file
        // console.log(fileExtension);

        const storageFileName = `images-asset-3D/asset3D-${id}.${fileExtension}`;

        // Delete the old image if a new image is being uploaded
        const oldImageRef = ref(storage, storageFileName);
        await deleteObject(oldImageRef); // Delete the old image

        const originalFileName = asset3D.asset3DImage.name;
        const newFileExtension = originalFileName.split(".").pop();
        // console.log(newFileExtension);
        // Upload the new image
        const imageRef = ref(
          storage,
          `images-asset-3D/asset3D-${id}.${newFileExtension}`
        );
        await uploadBytes(imageRef, asset3D.asset3DImage);
        asset3DImage = await getDownloadURL(imageRef);
      } else {
        // If no new image is uploaded, keep the old image URL
        asset3DImage = imagePreview;
      }

>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
      const asset3DRef = doc(db, "assetImage3D", id);
      await updateDoc(asset3DRef, {
        asset3DName: asset3D.asset3DName,
        category: asset3D.category,
        description: asset3D.description,
<<<<<<< HEAD
        price: asset3D.price,
        asset3DThumbnail: asset3DThumbnail,
=======
        price: priceAsNumber,
        asset3DImage: asset3DImage,
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
      });

      setAlertSuccess(true);
      setTimeout(() => {
        navigate("/manage-asset-3D");
      }, 2000);
    } catch (error) {
<<<<<<< HEAD
      // console.error("Error updating asset 2D: ", error);
=======
      console.error("Error updating asset3D: ", error);
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
      setAlertError(true);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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
                <span>asset 3D berhasil diperbarui.</span>
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
                <span>Gagal memperbarui Asset 3D silahkan coba lagi</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mx-0 sm:mx-0 md:mx-0 lg:mx-0 xl:mx-28 2xl:mx-24   h-[1434px] gap-[50px]  overflow-hidden  mt-4 sm:mt-0 md:mt-0 lg:-mt-0 xl:mt-0 2xl:-mt-0">
            <h1 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-10 dark:text-primary-100 p-4">
              Edit asset3D
            </h1>
            <div className="p-8 -mt-4  bg-primary-100  dark:bg-neutral-20 rounded-sm shadow-lg">
              <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                asset 3D Information
              </h2>

              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-[150px] md:w-[170px] lg:w-[200px] xl:w-[220px] 2xl:w-[170px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                      Edit Thumbnail Asset 3D
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-3 lg:w-3 xl:w-3 2xl:w-3 h-2 sm:h-2 md:h-3 lg:h-3 xl:h-3 2xl:h-3 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[12px] mb-2">
<<<<<<< HEAD
                    Format thumbnail harus .jpg, jpeg, png dan ukuran minimal
                    300 x 300 px.
=======
                    Format Asset harus jpg, jpeg, png dan zip
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                  </p>
                </div>
                <div className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-2 md:gap-2 lg:gap-6 xl:gap-6 2xl:gap-10">
                    <div className="mt-2 md:ml-2 lg:ml-4 xl:ml-6 2xl:ml-4 flex justify-center items-center border border-dashed border-neutral-60 w-[100px] h-[100px] sm:w-[100px] md:w-[120px] lg:w-[150px] sm:h-[100px] md:h-[120px] lg:h-[150px] relative">
                      <label
                        htmlFor="fileUpload"
                        className="flex flex-col justify-center items-center cursor-pointer text-center"
                      >
                        {!imagePreview && (
                          <>
                            <img
                              alt=""
                              className="w-6 h-6"
                              src="path_to_your_icon"
                            />
                            <span className="text-primary-0 text-xs font-light mt-2 dark:text-primary-100">
<<<<<<< HEAD
                              Upload Thumbnail
=======
                              Upload asset 3D
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                            </span>
                          </>
                        )}

                        <input
                          type="file"
                          id="fileUpload"
                          name="asset3DThumbnail"
                          onChange={handleChange}
                          multiple
<<<<<<< HEAD
                          accept=".jpg,.jpeg,.png"
=======
                          accept=".jpg,.jpeg,.png,.zip,.rar,.csv,.xls,.xlsx,"
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                          className="hidden"
                        />

                        {imagePreview && (
                          <div className="mt-2 relative">
                            <img
                              src={imagePreview || DefaultPreview}
                              alt="Preview"
                              onError={(e) => {
                                e.target.src = DefaultPreview;
                              }}
                              className="w-40 sm:w-40 md:w-40 lg:w-[150px] xl:w-[150px] 2xl:w-[150px] h-40 sm:h-40 md:h-40 lg:h-[156px] xl:h-[156px] 2xl:h-[157px] -mt-2.5 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setAsset3D({
                                  ...asset3D,
                                  asset3DThumbnail: null,
                                });
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

              {/* asset3D Name */}
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-1">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                      Asset 3D Name
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-3 lg:w-3 xl:w-3 2xl:w-3 h-2 sm:h-2 md:h-3 lg:h-3 xl:h-3 2xl:h-3 -mt-5"
                    />
                  </div>
                  <p className="w-full text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[12px]">
                    Masukkan Nama Untuk Asset 3D Maximal 40 Huruf
                  </p>
                </div>
                <div className="flex justify-start items-start w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      name="asset3DName"
                      value={asset3D.asset3DName}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px]"
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
                    Silahkan Pilih Kategori Yang Sesuai Dengan Asset 3D Anda.
                  </p>
                </div>

                <div className="flex justify-start items-center w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <select
                      name="category"
<<<<<<< HEAD
                      value={asset3D.category} // Bind value to dataset.category
                      onChange={(e) =>
                        setAsset3D((prevState) => ({
                          ...prevState,
                          category: e.target.value, // Update category inside dataset state
                        }))
                      }
                      className="w-full border-none focus:outline-none focus:ring-0 text-neutral-20 text-[12px] bg-transparent h-[40px] -ml-2 rounded-md"
                    >
=======
                      value={asset3D.category} // Bind value to asset3D.category
                      onChange={(e) =>
                        setAsset3D((prevState) => ({
                          ...prevState,
                          category: e.target.value, // Update category inside asset3D state
                        }))
                      }
                      className="w-full border-none focus:outline-none focus:ring-0 text-neutral-20 text-[12px] bg-transparent h-[40px] -ml-2 rounded-md">
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                      <option value="" disabled>
                        Pick an option
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </label>
<<<<<<< HEAD
=======

                  {/* <div className="h-[48px] w-[48px] bg-blue-700 text-white flex items-center justify-center rounded-md shadow-md hover:bg-secondary-50 transition-colors duration-300 cursor-pointer ml-2 text-4xl">
                    +
                  </div> */}
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
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
                    Berikan Deskripsi Pada asset3D Anda Maximal 200 Huruf
                  </p>
                </div>
                <div className="flex justify-start items-start w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <textarea
                      name="description"
                      value={asset3D.description}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] h-[48px] sm:h-[60px] md:h-[80px] lg:h-[80px] xl:h-[100px] bg-transparent"
                      placeholder="Deskripsi"
                      required
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
                    Silahkan Masukkan Harga Untuk asset3D jika asset gratis
                    silahkan dikosongkan.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-full h-auto border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
<<<<<<< HEAD
                      type="Rp"
=======
                      type="number"
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                      name="price"
                      value={asset3D.price}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0  w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Rp"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
            {/* Save and Cancel button */}
            <div className="w-full inline-flex sm:gap-6 xl:gap-[21px] justify-center sm:justify-center md:justify-end  gap-6 mt-12 sm:mt-12 md:mt-14 lg:mt-14 xl:mt-12  ">
              <button
                type="button"
                onClick={handleCancel}
<<<<<<< HEAD
                className="btn bg-neutral-60 border-neutral-60 hover:bg-neutral-60 hover:border-neutral-60 rounded-lg  font-semibold   text-primary-100 text-center text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]"
              >
=======
                className="btn bg-neutral-60 border-neutral-60 hover:bg-neutral-60 hover:border-neutral-60 rounded-lg  font-semibold   text-primary-100 text-center text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]">
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                Cancel
              </button>
              <button
                type="submit"
<<<<<<< HEAD
                className="btn  bg-secondary-40 border-secondary-40 hover:bg-secondary-40 hover:border-secondary-40 rounded-lg  font-semibold leading-[24px]  text-primary-100 text-center  text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]"
              >
=======
                className="btn  bg-secondary-40 border-secondary-40 hover:bg-secondary-40 hover:border-secondary-40 rounded-lg  font-semibold leading-[24px]  text-primary-100 text-center  text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]">
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditNewAsset3D;
<<<<<<< HEAD
//11/4/24
=======
>>>>>>> fb09a340469d176aaa44804cb2426094d33f614c
