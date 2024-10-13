import HeaderNav from "../../HeaderNav/HeaderNav";
import NavbarSection from "../web_User-LandingPage/NavbarSection";
export function MapAssetVideo() {
  return (
    <>
      <div className=" dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100">
        <div className="w-full shadow-md bg-white dark:text-white relative z-40 ">
          <div className="pt-[70px]  w-full">
            <HeaderNav />
          </div>
          <NavbarSection />
        </div>
        <h1>MapAssetVideo</h1>
      </div>
    </>
  );
}
