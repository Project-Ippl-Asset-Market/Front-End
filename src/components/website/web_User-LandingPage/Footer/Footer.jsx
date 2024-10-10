import React from "react";

const Footer = () => {
  return (
    <footer className="bg-darknavy text-white min-h-[181px] flex flex-col items-center justify-center">
      <div className="flex justify-center gap-4 text-[16px] font-semibold mb-8">
        <a href="#">Teams And Conditions</a>
        <a href="#">File Licenses</a>
        <a href="#">Refund Policy</a>
        <a href="#">Privacy Policy</a>
      </div>

      <p className="text[12px]">
        Copyright © 2024 - All right reserved by ACME Industries Ltd
      </p>
    </footer>
  );
};

export default Footer;
