import NavbarSection from "../web_User-LandingPage/NavbarSection";
import DropDownAssetGame from "./DropDownAssetGame";
import { AssetAudio } from "./asset_audio/AssetAudio";

export function AssetGame() {
  return (
    <>
      <div className=" dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
        <div className="w-full shadow-md bg-primary-100 dark:bg-neutral-20 text-primary-100 dark:text-primary- relative z-40 ">
          <NavbarSection />
        </div>
        <div className="pt-[0px] ">
          <DropDownAssetGame />
        </div>

        <div className="pt-[0px]">
          <AssetAudio />
        </div>
      </div>

      <footer className=" min-h-[181px] flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 text-[10px] sm:text-[12px] lg:text-[16px] font-semibold mb-8">
          <a href="#">Teams And Conditions</a>
          <a href="#">File Licenses</a>
          <a href="#">Refund Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="text-[10px] md:text-[12px]">
          Copyright © 2024 - All right reserved by ACME Industries Ltd
        </p>
      </footer>
    </>
  );
}
