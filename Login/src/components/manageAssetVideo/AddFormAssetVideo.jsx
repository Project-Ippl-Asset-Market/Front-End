// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";

const AddVideoForm = () => {
  const [videoName, setVideoName] = useState("");
  const [category, setCategory] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      videoName,
      category,
      videoFile,
      description,
      price,
    });
  };

  return (
    <div className=" mx-auto p-0 font-poppins bg-primary-100">
      {/* Header */}
      <header className="bg-black w-full h-28 px-5 mb-5 flex items-center justify-between">
        <h4 className="text-white m-0 pl-2 font-poppins font-semibold text-2xl leading-8">
          Manage Asset Video
        </h4>
        <div className="flex items-center text-white">
          <img
            src="https://via.placeholder.com/50"
            alt="Admin Profile"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="mr-1">Admin Name</span>
          <span>▼</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="w-full h-5 p-2">
        <Breadcrumb />
      </nav>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit}>
          <h3 className="mb-5 pl-16 font-poppins font-semibold text-4xl leading-12">
            Add New Video
          </h3>

          {/* Video Information Section */}
          <div className="max-w-4xl mx-auto border border-gray-300 rounded-lg bg-gray-200 p-6">
            <section className="flex flex-col">
              <h3 className="text-gray-800 text-2xl font-semibold">
                Video Information
              </h3>

              <div className="mt-4">
                <label className="block mb-1 font-semibold">
                  Video Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                  required
                  className="w-full h-12 p-3 border border-gray-300 rounded-md"
                />
                <h5 className="text-gray-500">
                  nama videonya apa gitu bisa disebutkan
                </h5>
              </div>

              {/* Category */}
              <div className="mt-4">
                <label className="block mb-1 font-semibold">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md">
                  <option value="">Pick an option</option>
                  <option value="Category 1">Category 1</option>
                  <option value="Category 2">Category 2</option>
                  <option value="Category 3">Category 3</option>
                </select>
                <h5 className="text-gray-500">
                  Pilih kategori yang sesuai karena biaya layanan akan
                  tergantung pada kategori.
                </h5>
              </div>
            </section>
          </div>

          {/* Detail Video Container */}
          <div className="max-w-4xl mx-auto border border-gray-300 rounded-lg bg-gray-200 p-6 mt-6">
            <section className="flex flex-col">
              <h3 className="text-gray-800 text-2xl font-semibold">
                Detail Video
              </h3>

              {/* Upload Video */}
              <div className="mt-4">
                <label className="block mb-1 font-semibold">
                  Upload Video <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  required
                  className="border border-gray-300 p-3 rounded-md"
                />
                <h5 className="text-gray-500">
                  bisa dituliskan keterangan minimum dan maksimal ukuran video
                </h5>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block mb-1 font-semibold">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe your video here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full h-32 p-3 border border-gray-300 rounded-md"
                />
              </div>

              {/* Harga */}
              <div className="mt-4">
                <label className="block mb-1 font-semibold">
                  Harga <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Rp"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full h-12 p-3 border border-gray-300 rounded-md"
                />
                <h5 className="text-gray-500">Masukkan harga per assetnya</h5>
              </div>
            </section>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-5 rounded-md">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-5 rounded-md">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideoForm;
