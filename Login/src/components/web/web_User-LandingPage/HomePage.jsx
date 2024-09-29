import React from "react";
import Navbar from "./Navbar/Navbar";
import Banner from "./Banner/Banner";
import AllProducts from "./AllProducts/AllProducts";
import Footer from "./Footer/Footer";
import PopUp from "./PopUp/PopUp";

function HomePage() {
  return (
    <>
      <Navbar />
      <Banner />
      <AllProducts />
      <Footer />
      <PopUp />
    </>
  );
}

export default HomePage;
