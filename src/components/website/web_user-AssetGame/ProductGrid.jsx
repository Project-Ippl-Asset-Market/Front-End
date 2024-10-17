import React, { useState } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const [category, setCategory] = useState(null);
  const [dropdown, setDropdown] = useState(null);

  const products = [
    {
      id: 1,
      image: "src/assets/assetgame/fantasy.png",
      title: "Complete Fantasy RPG Music Bundle",
      author: "M Cahyo Abdul Syukur",
      price: "Rp. 1000.000",
      likes: "354k",
      category: null,
    },
    // Produk lainnya...
  ];

  const toggleDropdown = (btn) => {
    setDropdown((prev) => (prev === btn ? null : btn));
  };

  // Filter produk berdasarkan kategori yang dipilih
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-10 py-8">
      <div className="flex flex-wrap items-center space-x-4 mb-4">
        {/* Button 2D */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("2D")}
            className={`${
              category === "2D"
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            } font-semibold px-4 py-2`}>
            2D
          </button>
          {dropdown === "2D" && (
            <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
              <button
                onClick={() => setCategory("Characters")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Characters
              </button>
              <button
                onClick={() => setCategory("Font")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Font
              </button>
              <button
                onClick={() => setCategory("GUI")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                GUI
              </button>
            </div>
          )}
        </div>

        {/* Button 3D */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("3D")}
            className={`${
              category === "3D"
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            } font-semibold px-4 py-2`}>
            3D
          </button>
          {dropdown === "3D" && (
            <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
              <button
                onClick={() => setCategory("Animations")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Animations
              </button>
              <button
                onClick={() => setCategory("Characters")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Characters
              </button>
              <button
                onClick={() => setCategory("GUI")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                GUI
              </button>
              <button
                onClick={() => setCategory("Vegetation")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Vegetation
              </button>
            </div>
          )}
        </div>

        {/* Button Audio */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("Audio")}
            className={`${
              category === "Audio"
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            } font-semibold px-4 py-2`}>
            Audio
          </button>
          {dropdown === "Audio" && (
            <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
              <button
                onClick={() => setCategory("Music")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Music
              </button>
              <button
                onClick={() => setCategory("Sound FX")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Sound FX
              </button>
              <button
                onClick={() => setCategory("Ambient")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Ambient
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">Tidak ada produk dalam kategori ini.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              author={product.author}
              price={product.price}
              likes={product.likes}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
