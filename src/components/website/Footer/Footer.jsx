import logoWeb from "../../../assets/logo/logoWeb.png";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 mt-10 border-t border-gray-300 dark:bg-neutral-20 text-neutral-10 dark:text-primary-100 min-h-screen font-poppins  ">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start pb-8">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <img
              src={logoWeb}
              alt="PixelStore Logo"
              className="w-24 h-24 md:w-32 md:h-32 mb-3"
              loading="lazy"
            />
            <p className="text-gray-500 text-xs text-center md:text-left dark:text-primary-100">
              Bringing you the best assets from the digital world.
            </p>
          </div>

          <div className="flex flex-col justify-start text-center md:text-left space-y-2 md:space-y-3 mt-4 md:mt-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-primary-100">
              Follow Us
            </h3>
            <div className="flex items-center justify-center md:justify-start">
              <FaInstagram className="w-6 h-6 mr-2 text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100" />
              <a
                href="https://www.instagram.com/asset.bypixel/profilecard/?igsh=MXR1b2Z5ejE3aHcwaA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
                Instagram: @asset.bypixel
              </a>
            </div>
          </div>

          <nav className="flex flex-col justify-start mt-4 md:mt-0 space-y-2 ">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-primary-100">
              Company
            </h3>
            <a
              href="#"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              About Us
            </a>
            <a
              href="#"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Contact Us
            </a>
          </nav>
          <nav className="flex flex-col justify-start mt-4 md:mt-0 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-primary-100">
              Asset Navigation
            </h3>
            <a
              href="/asset-video"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Asset Video
            </a>
            <a
              href="/asset-image"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Asset Image
            </a>
            <a
              href="/asset-dataset"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Asset Dataset
            </a>
            <a
              href="/asset-game"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Asset Game
            </a>
            <a
              href="/asset-gratis"
              className="text-sm md:text-lg text-gray-700 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Asset Gratis
            </a>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-300 mt-4">
          <span className="text-gray-600 text-sm dark:text-primary-100">
            © 2024 Pixelstore. All rights reserved.
          </span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Terms of Service
            </a>
            <span className="text-gray-600 dark:text-primary-100">|</span>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 transition duration-200 dark:text-primary-100">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
