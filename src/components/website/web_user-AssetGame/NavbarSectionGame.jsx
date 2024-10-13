import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarSectionGame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown2D, setDropdown2D] = useState(false);
  const [dropdown3D, setDropdown3D] = useState(false);
  const [dropdownAudio, setDropdownAudio] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown2D = () => {
    setDropdown2D(!dropdown2D);
  };

  const toggleDropdown3D = () => {
    setDropdown3D(!dropdown3D);
  };

  const toggleDropdownAudio = () => {
    setDropdownAudio(!dropdownAudio);
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="flex dark:bg-neutral-5 dark:text-primary-100 text-neutral-10 w-full fixed font-poppins bg-neutral-90 bg-opacity-90">
        <div className="mx-[20px] flex justify-start items-start mt-0 w-full">
          <div className="flex-grow " />
          <button
            onClick={toggleNavbar}
            className="p-2 pr-14 focus:outline-none mt-8 mb-2 sm:flex md:hidden lg:hidden 2xl:hidden ">
            {isOpen ? (
              <FaTimes className="text-2xl text-primary-30" />
            ) : (
              <FaBars className="text-2xl text-secondary-40" />
            )}
          </button>
        </div>

        {/* Asset Game 2D */}
        <div className="relative group">
          <Link
            to="/mapAsset2D"
            className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
              w-full text-start rounded-md h-10 p-2
              ${
                isLinkActive("/mapAsset2D")
                  ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                  : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
              }
              hover:bg-secondary-40 dark:hover:bg-secondary-40 text-neutral-10 group-hover:no-underline`}
            onClick={toggleDropdown2D}>
            Asset 2D
          </Link>
          {dropdown2D && (
            <div className="absolute left-0 mt-2 w-[200px] bg-neutral-90 shadow-lg z-10">
              <Link to="/2/option1" className="block p-2 hover:bg-secondary-40">
                Sub-menu 1
              </Link>
              <Link to="/2/option2" className="block p-2 hover:bg-secondary-40">
                Sub-menu 2
              </Link>
              <Link to="/2/option3" className="block p-2 hover:bg-secondary-40">
                Sub-menu 3
              </Link>
              <Link to="/2/option4" className="block p-2 hover:bg-secondary-40">
                Sub-menu 4
              </Link>
            </div>
          )}
        </div>

        {/* Asset Game 3D */}
        <div className="relative group">
          <Link
            to="/3"
            className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
              w-full text-start rounded-md h-10 p-2
              ${
                isLinkActive("/t")
                  ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                  : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
              }
              hover:bg-secondary-40 dark:hover:bg-secondary-40 text-neutral-10 group-hover:no-underline`}
            onClick={toggleDropdown3D}>
            Asset 3D
          </Link>
          {dropdown3D && (
            <div className="absolute left-0 mt-2 w-[200px] bg-neutral-90 shadow-lg z-10">
              <Link to="/3/option1" className="block p-2 hover:bg-secondary-40">
                Sub-menu 1
              </Link>
              <Link to="/3/option2" className="block p-2 hover:bg-secondary-40">
                Sub-menu 2
              </Link>
              <Link to="/3/option3" className="block p-2 hover:bg-secondary-40">
                Sub-menu 3
              </Link>
              <Link to="/3/option4" className="block p-2 hover:bg-secondary-40">
                Sub-menu 4
              </Link>
            </div>
          )}
        </div>

        {/* Asset Audio */}
        <div className="relative group">
          <Link
            to="/audio"
            className={`relative inline-block text-[12px] sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] 
              w-full text-start rounded-md h-10 p-2
              ${
                isLinkActive("/t")
                  ? "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
                  : "dark:bg-neutral-5 dark:text-primary-100 text-neutral-10"
              }
              hover:bg-secondary-40 dark:hover:bg-secondary-40 text-neutral-10 group-hover:no-underline`}
            onClick={toggleDropdownAudio}>
            Asset Audio
          </Link>
          {dropdownAudio && (
            <div className="absolute left-0 mt-2 w-[200px] bg-neutral-90 shadow-lg z-10">
              <Link
                to="/audio/option1"
                className="block p-2 hover:bg-secondary-40">
                Sub-menu 1
              </Link>
              <Link
                to="/audio/option2"
                className="block p-2 hover:bg-secondary-40">
                Sub-menu 2
              </Link>
              <Link
                to="/audio/option3"
                className="block p-2 hover:bg-secondary-40">
                Sub-menu 3
              </Link>
              <Link
                to="/audio/option4"
                className="block p-2 hover:bg-secondary-40">
                Sub-menu 4
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarSectionGame;
