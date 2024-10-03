import React, { useState } from "react";
import { Link } from "react-router-dom";

import Image1 from "../web_User-LandingPage/Banner/bg.jpg";

import Img1 from "../../web/web_User-LandingPage/products/image1.jpg";
import Img2 from "../../web/web_User-LandingPage/products/image2.jpg";
import Img3 from "../../web/web_User-LandingPage/products/image3.jpg";
import Img4 from "../../web/web_User-LandingPage/products/image4.jpg";
import Img5 from "../../web/web_User-LandingPage/products/image1.jpg";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Header from "../../headerNavBreadcrumbs/HeaderWebUser";

// import PopUp from "./PopUp"; // Import VideoModal

// Banner ImageList
const ImageList = [
  {
    id: 1,
    img: Image1,
    description: (
      <>
        Butuh Asset berkualitas untuk Tugas dan Proyekmu? Jelajahi <br />
        ribuan Asset menarik di website kami
        <div></div>
        <div></div>
        <div></div>
      </>
    ),
  },
];

// List data product
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
    type: "jpeg",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 5,
    img: Img5,
    title: "Gicss Photograph",
    description: "Dataset Visual  - Dataset ini menye...",
    type: "jpeg",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 6,
    img: Img3,
    title: "Gicss Photograph",
    description: "Font 3D - Font yang membuat lebih....",
    type: "jpeg",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 7,
    img: Img1,
    title: "Gicss Photograph",
    description: "Video Ombak Laut - Sore tenang dipi..",
    type: "jpeg",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
  {
    id: 8,
    img: Img2,
    title: "Gicss Photograph",
    description: "Gambar Ombak Laut - Sore tenang dipi..",
    type: "jpeg",
    likes: 12301,
    price: "Rp. 25.000,00",
  },
];

const Navbar = () => {
  // State untuk menyimpan status like
  const [likedProducts, setLikedProducts] = useState({});

  const handleLikeClick = (id) => {
    setLikedProducts((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div>
      <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
        <div className="pt-[80px]">
          <Header />
        </div>
        <nav className="hidden sm:flex bg-neutral-5 dark:bg-neutral-5 text-primary-100 dark:text-primary-100  min-h-[50px] p-1 sm:text-[11px] md:text-[14px] lg:text-[16px] font-semibold items-center">
          <div className="mx-[60px] w-full flex justify-between items-center">
            <div className="flex sm:space-x-4 md:space-x-5 lg:space-x-10 justify-start items-center">
              <a
                href="#home"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Telusuri Semua
              </a>
              <a href="#" className="sm:text-base lg:text-lg flex items-center">
                |{" "}
              </a>
              <a
                href="#about"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Asset Video
              </a>
              <a
                href="#product"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Asset Gambar
              </a>
              <a
                href="#"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Asset Dataset
              </a>
              <a
                href="#"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Asset Game
              </a>
              <a
                href="#"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Asset Grati
              </a>
            </div>
            <div className="flex space-x-5 justify-end items-center">
              <p className="sm:text-base lg:text-lg flex items-center"> | </p>
              <Link
                to="/dashboard"
                className="pb-1 border-b-2 border-transparent focus:border-blue-500 flex items-center">
                Jual Asset
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Banner section */}
      <div
        className="relative overflow-hidden h-[140px] md:h-[160px] lg:h-[179px] flex justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="container sm:pb-0 text-white text-center">
          {ImageList.map((data) => (
            <div
              key={data.id}
              className="flex flex-col justify-center items-center gap-4">
              <div className="flex flex-col justify-start items-center gap-4">
                <h1 className="text-[14px] sm:text-[18px] md:text-[23px] lg:text-[30px] xxs:text-[36px] font-bold">
                  {data.description}
                </h1>
              </div>
              <div className="flex justify-center items-center w-full max-w-md gap-4">
                <div className="w-1/12 sm:w-1/7 md:w-1/6 lg:w-1/5 h-1 bg-blue-600"></div>
                <div className="w-1/12 sm:w-1/7 md:w-1/6 lg:w-1/5 h-1 bg-blue-600"></div>
                <div className="w-1/12 sm:w-1/7 md:w-1/6 lg:w-1/5 h-1 bg-blue-600"></div>
                <div className="w-1/12 sm:w-1/7 md:w-1/6 lg:w-1/5 h-1 bg-blue-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products section */}
      <div className="dark:text-primary-100 bg-primary-100 dark:bg-neutral-20 dark:shadow-lg dark:shadow-neutral-10">
        <div className="flex flex-col ml-[51px]">
          {/* Header section */}
          <div className="w-[225px] sm:w-[252px] md:w-[291px] lg:w-[315px] text-left mb-[18px] mt-[16px] pr-4 pt-3 text-[13px] sm:text-[15px] md:text-[18px] lg:text-[20px] font-semibold border-b-[1px] border-black dark:border-white">
            <ul>
              <li className="flex w-[386px] justify-start items-center">
                <a
                  href="#"
                  className="pb-2 sm:pb-2 mb:pb-3 lg:pb-4 mr-7 border-b-[3px] border-transparent focus:border-blue-500">
                  Paling Disukai
                </a>
                <a
                  href="#"
                  className="pb-2 sm:pb-2 mb:pb-3 lg:pb-4 border-b-[3px] mr-7 border-transparent focus:border-blue-500">
                  Terlaris
                </a>
                <a
                  href="#"
                  className="pb-2 sm:pb-2 mb:pb-3 lg:pb-4 border-b-[3px] border-transparent focus:border-blue-500">
                  Terbaru
                </a>
              </li>
            </ul>
          </div>

          {/* Body section */}
          <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-5 place-items-center">
            {ProductsData.map((data) => (
              <div
                key={data.id}
                className="w-[190px] h-[215px] sm:w-[180px] sm:h-[205px] md:w-[230px] md:h-[265px] lg:w-[300px] lg:h-[335px] rounded-[10px] bg-[#D9D9D9] dark:bg-[#171717] group">
                {/* image section */}
                <div className="w-[190px] h-[123px] sm:w-[180px] sm:h-[113px] md:w-[230px] md:h-[155px] lg:w-[300px] lg:h-[223px]">
                  <a href="">
                    <img
                      src={data.img}
                      alt=""
                      className="h-full w-full overflow-hidden relative rounded-t-[10px] mx-auto drop-shadow-md max-h-full"
                    />
                  </a>
                </div>

                {/* details section */}
                <div className="flex-col justify-start p-4">
                  <p className="text-[13px] text-[#212121] font-light dark:text-white">
                    {data.title}
                  </p>
                  <h4 className="text-black text-[11px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-semibold dark:text-white">
                    {data.description}
                  </h4>
                  <div className="flex justify-between items-center ">
                    <button
                      onClick={() => handleLikeClick(data.id)}
                      className="flex justify-start items-center mr-2">
                      {likedProducts[data.id] ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-black dark:text-white " />
                      )}
                      <p className="ml-2 text-[12px] sm:text-[11px] md:text-[13px] lg:text-[15px]">
                        ({data.likes})
                      </p>
                    </button>
                    <p className="flex justify-end w-full text-[12px] sm:text-[11px] md:text-[13px] lg:text-[15px]">
                      {data.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-darknavy text-white min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[13px] sm:text-[14px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>

        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All right reserved by ACME Industries Ltd
        </p>
      </footer>
    </div>
  );
};

export default Navbar;
