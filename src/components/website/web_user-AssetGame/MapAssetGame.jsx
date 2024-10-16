import NavbarSection from "../web_User-LandingPage/NavbarSection";
import DropDownAssetGame from "./DropDownAssetGame";
import { MapAssetAudio } from "./asset_audio/MapAssetAudio";

export function MapAssetGame() {
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
          <MapAssetAudio />
        </div>
      </div>
    </>
  );
}
