import React from "react";
import Navbar from "./Navbar/Navbar";
import Banner from "./Banner/Banner";
import AllProducts from "./AllProducts/AllProducts";
import Footer from "./Footer/Footer";

function HomePage() {
  return (
    <>
      <Navbar />
      <Banner />
      <AllProducts />
      <Footer />
    </>
  );
}

export default HomePage;
