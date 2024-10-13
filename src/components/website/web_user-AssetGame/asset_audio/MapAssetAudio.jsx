import HeaderNav from "../../../HeaderNav/HeaderNav";
import NavbarSection from "../../web_User-LandingPage/NavbarSection";
import ProductGrid from "./ProductGrid";
export function MapAssetAudio() {
  return (
    <>
      <div>
        <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
          <div className="pt-[70px]  w-full">
            <HeaderNav />
          </div>
          <NavbarSection />
        </div>
        <ProductGrid />
      </div>
    </>
  );
}
