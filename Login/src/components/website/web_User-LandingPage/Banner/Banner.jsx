import React from "react";
import Image1 from "../Banner/bg.jpg";

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

const Banner = ({ handleOrderPopup }) => {
  return (
    <div
      className="relative overflow-hidden h-[183px] flex justify-center items-center dark:text-white duration-200"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Image1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      {/* Banner section */}
      <div className="container pb-8 sm:pb-0 text-white text-center">
        {ImageList.map((data) => (
          <div key={data.id}>
            <div className="flex flex-col justify-center items-center gap-4">
              <h1 className="text-sm sm:text-base md:text-xl font-bold">
                {data.description}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
