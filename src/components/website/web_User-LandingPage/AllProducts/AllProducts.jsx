import React from "react";
import Img1 from "../products/image1.jpg";
import Img2 from "../products/image2.jpg";
import Img3 from "../products/image3.jpg";
import Img4 from "../products/image4.jpg";
import { FaHeart } from "react-icons/fa";

// Data produk yang akan ditampilkan
const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Gicss Photograph",
    description: "Video Ombak Laut - Sore tenang dipi..",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 2,
    img: Img2,
    title: "Gicss Photograph",
    description: "Gambar Ombak Laut - Sore tenang dipi..",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 3,
    img: Img3,
    title: "Gicss Photograph",
    description: "Font 3D - Font yang membuat lebih....",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 4,
    img: Img4,
    title: "Gicss Photograph",
    description: "Video Ombak Laut - Sore tenang dipi..",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
];

// Komponen TopProducts
const TopProducts = ({ handleOrderPopup }) => {
  return (
    <div className="container mx-auto">
      {/* Bagian header */}
      <div className="flex flex-col ml-[51px]">
        <div className="w-[386px] text-left mb-[18px] mt-[16px] pr-4 pt-3 pb-[19px] text-[20px] font-semibold border-b-2 border-gray-300">
          <ul>
            <li className="flex w-[386px] justify-between items-center">
              <a href="#" className="hover:underline">
                Paling Disukai
              </a>
              <a href="#" className="hover:underline">
                Terlaris
              </a>
              <a href="#" className="hover:underline">
                Terbaru
              </a>
            </li>
          </ul>
        </div>

        {/* Bagian body */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-5 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              className="h-[335px] w-[300px] rounded-[10px] bg-[#D9D9D9] group max-w-[300px] max-h-[335px] shadow-md">
              {/* Bagian gambar */}
              <div>
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[223px] w-[300px] rounded-t-[10px] mx-auto drop-shadow-md max-h-full object-cover"
                />
              </div>

              {/* Bagian detail */}
              <div className="flex flex-col justify-start p-4">
                <p className="text-[13px] text-[#212121] font-light">
                  {data.title}
                </p>
                <h4 className="text-black text-[14px] font-semibold">
                  {data.description}
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <button
                    className="flex justify-start items-center mr-2"
                    onClick={() => handleOrderPopup(data.id)}>
                    <FaHeart className="text-[#980019] mr-1" />
                    <p>({data.likes})</p>
                  </button>
                  <p className="flex justify-end w-full text-sm font-medium">
                    {data.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
