// Web untuk user ntar pindahin

import { useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  UserCircleIcon,
  ImageIcon,
} from "lucide-react";

export default function AddNewImage() {
  const [imageName, setImageName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <header className="bg-[#212121] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Asset Gambar</h1>
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 mr-2" />
          <span>Admin Ardhy</span>
          <ChevronDownIcon className="h-4 w-4 ml-1" />
        </div>
      </header>

      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-4 py-3 overflow-x-auto whitespace-nowrap">
            <li>Dashboard</li>
            <li className="text-gray-500">Manage Asset Gambar</li>
            <li className="text-gray-500">Add New Image</li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Add New Image</h2>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Image Information</h3>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block w-full sm:w-1/4 text-lg">
                Image Name <span className="text-red-500">*</span>
              </label>
              <div className="hidden sm:block w-3/4">
                <input
                  type="text"
                  className="w-full p-3 border rounded-md shadow-sm"
                  placeholder="Type here"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:ml-1/4">
              <div className="block sm:hidden w-full mb-2">
                <input
                  type="text"
                  className="w-full p-3 border rounded-md shadow-sm"
                  placeholder="Type here"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Image name minimum 40 characters
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block w-full sm:w-1/4 text-lg">
                Category
                <span className="ml-2 px-2 py-1 bg-gray-200 text-sm rounded-md">
                  Required
                </span>
              </label>
              <div className="hidden sm:flex w-3/4 items-center">
                <div className="relative flex-grow">
                  <select
                    className="w-full p-3 border rounded-md shadow-sm appearance-none pr-10"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Pick your an option</option>
                    {/* Add your category options here */}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <button className="ml-2 bg-[#2563eb] text-white p-3 rounded-md">
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="sm:ml-1/4">
              <div className="block sm:hidden w-full mb-2">
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <select
                      className="w-full p-3 border rounded-md shadow-sm appearance-none pr-10"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}>
                      <option value="">Pick your an option</option>
                      {/* Add your category options here */}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <button className="ml-2 bg-[#2563eb] text-white p-3 rounded-md">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">Pick category for image</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Detail Image</h3>

          <div className="mb-6">
            <div className="flex items-start mb-2">
              <label className="block w-full sm:w-1/4 pt-2 text-lg">
                Photo
                <span className="ml-2 px-2 py-1 bg-gray-200 text-sm rounded-md">
                  Required
                </span>
              </label>
              <div className="hidden sm:block w-3/4">
                <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="sm:ml-1/4">
              <div className="block sm:hidden w-full mb-2">
                <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Format must be .jpg .jpeg .png and minimum size 300 x 300px
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-start mb-2">
              <label className="block w-full sm:w-1/4 pt-2 text-lg">
                Description
                <span className="ml-2 px-2 py-1 bg-gray-200 text-sm rounded-md">
                  Required
                </span>
              </label>
              <div className="hidden sm:block w-3/4">
                <textarea
                  className="w-full p-3 border rounded-md shadow-sm"
                  rows={4}
                  placeholder="Deskripsi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>
            <div className="sm:ml-1/4">
              <div className="block sm:hidden w-full mb-2">
                <textarea
                  className="w-full p-3 border rounded-md shadow-sm"
                  rows={4}
                  placeholder="Deskripsi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <p className="text-sm text-gray-500">Description for Image</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block w-full sm:w-1/4 pt-2 text-lg">
                Harga
              </label>
              <div className="hidden sm:block w-3/4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    Rp
                  </span>
                  <input
                    type="text"
                    className="w-full p-3 pl-10 border rounded-md shadow-sm"
                    placeholder="Type here"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="sm:ml-1/4">
              <div className="block sm:hidden w-full mb-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    Rp
                  </span>
                  <input
                    type="text"
                    className="w-full p-3 pl-10 border rounded-md shadow-sm"
                    placeholder="Type here"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">Enter price for image</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="w-full sm:w-[200px] h-[60px] bg-gray-300 rounded text-lg">
            Cancel
          </button>
          <button className="w-full sm:w-[200px] h-[60px] bg-[#2563eb] text-white rounded text-lg">
            Save
          </button>
        </div>
      </main>
    </div>
  );
}
