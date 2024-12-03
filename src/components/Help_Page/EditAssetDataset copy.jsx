/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconField from "../../assets/icon/iconField/icon.svg";
import HeaderNav from "../HeaderNav/HeaderNav";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db, storage, auth } from "../../firebase/firebaseConfig";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import DefaultPreview from "../../assets/icon/iconSidebar/datasetzip.png";

function AddCategory({ isOpen, onClose, onAddCategory }) {
  const [user, setUser] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

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

      const newCategory = {
        id: docRef.id,
        name: categoryName,
        createdAt: new Date(),
      };

      onAddCategory(newCategory);
      setCategoryName("");
      onClose();
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan kategori. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-20 p-6 rounded-2xl w-[510px] h-[250px] font-poppins text-black dark:text-white">
        <h1 className="h-7 font-semibold">Category</h1>
        <h2 className="h-14 flex items-center">Add category</h2>
        <input
          type="text"
          placeholder="type here"
          className="border border-[#ECECEC] w-full h-12 mb-1 rounded-lg text-sm text-black placeholder:font-semibold placeholder:opacity-40"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="relative h-[70px]">
          <div className="absolute bottom-0 right-0 flex justify-end space-x-2 font-semibold text-sm">
            <button
              onClick={handleClose}
              className="bg-[#9B9B9B] text-white h-12 px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-[#2563EB] text-white h-12 px-4 py-2 rounded-lg ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditNewDataset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const [dataset, setDataset] = useState({
    datasetName: "",
    category: "",
    description: "",
    price: "",
    datasetFile: null,
    datasetThumbnail: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminQuery = query(
          collection(db, "admins"),
          where("uid", "==", currentUser.uid)
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          setRole(adminData.role);
        } else {
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", currentUser.uid)
          );
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            setRole("user");
          }
        }
      } else {
        setUser(null);
        setRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user || !role) return;

      try {
        let q;
        if (role === "superadmin") {
          q = query(collection(db, "categoryDataset"));
        } else {
          q = query(
            collection(db, "categoryDataset"),
            where("userId", "==", user.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(items);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [user, role]);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const docRef = doc(db, "assetDatasets", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDataset(data);
          setImagePreview(data.datasetThumbnail);
        } else {
          navigate("/manage-asset-dataset");
        }
      } catch (error) {
        console.error("Error fetching dataset:", error);
      }
    };

    fetchDataset();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "datasetThumbnail" && files[0]) {
      const file = files[0];
      setDataset((prevDataset) => ({
        ...prevDataset,
        datasetThumbnail: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      const priceAsNumber = parseInt(dataset.price);
      if (isNaN(priceAsNumber)) {
        throw new Error("Invalid price: must be a number.");
      }

      const updatedData = {
        datasetName: dataset.datasetName,
        category: dataset.category,
        description: dataset.description,
        price: dataset.price,
      };

      if (dataset.datasetFile) {
        updatedData.datasetFile = await uploadFile(
          dataset.datasetFile,
          `files/dataset-${id}.zip`
        );
      }

      if (dataset.datasetThumbnail) {
        updatedData.datasetThumbnail = await uploadFile(
          dataset.datasetThumbnail,
          `images-dataset/dataset-${id}.jpg`
        );
      }

      const datasetRef = doc(db, "assetDatasets", id);
      await updateDoc(datasetRef, updatedData);

      setAlertSuccess(true);
      setTimeout(() => {
        navigate("/manage-asset-dataset");
      }, 2000);
    } catch (error) {
      console.error("Error updating dataset:", error);
      setAlertError(true);
    }
  };

  const uploadFile = async (file, path) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  return (
    <>
      <div className="bg-primary-100 dark:bg-neutral-20 font-poppins h-full min-h-screen">
        <div className="bg-primary-100 p-4 mt-14">
          <HeaderNav />
        </div>

        <div className="overflow-scroll">
          <div className="bg-primary-100 dark:bg-neutral-20 dark:text-primary-100 flex flex-col">
            <div className="text-2xl dark:text-primary-100 p-4">
              <Breadcrumb />
            </div>
          </div>

          {alertSuccess && (
            <div
              role="alert"
              className="fixed top-10 left-1/2 transform -translate-x-1/2 w-[400px] p-4 bg-success-60 text-white text-center shadow-lg rounded-lg">
              <span>Dataset berhasil diperbarui.</span>
            </div>
          )}

          {alertError && (
            <div
              role="alert"
              className="fixed top-10 left-1/2 transform -translate-x-1/2 w-[400px] p-4 bg-primary-60 text-white text-center shadow-lg rounded-lg">
              <span>Gagal memperbarui dataset silahkan coba lagi</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mx-0 md:mx-28 h-[1434px] gap-[50px] overflow-hidden mt-4">
            {/* Dataset Information Section */}
            <h1 className="text-[14px] font-bold p-4">Edit Dataset</h1>
            <div className="p-8 bg-primary-100 dark:bg-neutral-20 rounded-sm shadow-lg">
              <h2 className="text-[14px] font-bold">Dataset Information</h2>

              {/* Upload File */}
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4">
                <div>
                  <h3 className="text-[14px] font-bold">Upload File</h3>
                  <p className="text-neutral-60 mt-4">Format file harus .zip</p>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleChange}
                    name="datasetFile"
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4">
                <div>
                  <h3 className="text-[14px] font-bold">
                    Edit Thumbnail Dataset
                  </h3>
                  <p className="text-neutral-60 mt-4">
                    Format thumbnail harus .jpg, jpeg, png dan ukuran minimal
                    300 x 300 px.
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleChange}
                    name="datasetThumbnail"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-40 h-40 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              {/* Dataset Name */}
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4">
                <div>
                  <h3 className="text-[14px] font-bold">Dataset Name</h3>
                  <input
                    type="text"
                    name="datasetName"
                    value={dataset.datasetName}
                    onChange={handleChange}
                    className="border border-neutral-60 rounded-md p-2 mt-2 w-full"
                    placeholder="Enter name..."
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4">
                <div>
                  <h3 className="text-[14px] font-bold">Category</h3>
                  <select
                    name="category"
                    value={dataset.category}
                    onChange={handleChange}
                    className="border border-neutral-60 rounded-md p-2 mt-2 w-full">
                    <option value="" disabled>
                      Pick an option
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(true)}>
                    Add Category
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4">
                <div>
                  <h3 className="text-[14px] font-bold">Description</h3>
                  <textarea
                    name="description"
                    value={dataset.description}
                    onChange={handleChange}
                    className="border border-neutral-60 rounded-md p-2 mt-2 w-full"
                    placeholder="Description..."
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4">
                <div>
                  <h3 className="text-[14px] font-bold">Price</h3>
                  <input
                    type="number"
                    name="price"
                    value={dataset.price}
                    onChange={handleChange}
                    className="border border-neutral-60 rounded-md p-2 mt-2 w-full"
                    placeholder="Rp"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex justify-center mt-12">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn bg-neutral-60 text-white rounded-lg ml-4">
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-700 text-white rounded-lg ml-4">
                Save
              </button>
            </div>
          </form>

          <AddCategory
            isOpen={isAddCategoryOpen}
            onClose={() => setIsAddCategoryOpen(false)}
            onAddCategory={(newCategory) =>
              setCategories([...categories, newCategory])
            }
          />
        </div>
      </div>
    </>
  );
}

export default EditNewDataset;
