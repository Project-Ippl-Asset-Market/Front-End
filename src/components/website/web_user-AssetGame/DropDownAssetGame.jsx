// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";

const DropdownMenu = () => {
  const [isHovered, setIsHovered] = useState(null);

  // Item untuk dropdown
  const dropdownItems = {
    "3D": [
      { name: "Animations", path: "/3d/animations" },
      { name: "Characters", path: "/3d/characters" },
      { name: "Environments", path: "/3d/environments" },
      { name: "GUI", path: "/3d/gui" },
      { name: "Props", path: "/3d/props" },
      { name: "Vegetation", path: "/3d/vegetation" },
      { name: "Vehicles", path: "/3d/vehicles" },
    ],
    "2D": [
      { name: "2D Animations", path: "/2d/animations" },
      { name: "2D Characters", path: "/2d/characters" },
      { name: "2D Environments", path: "/2d/environments" },
      { name: "2D Props", path: "/2d/props" },
    ],
    Audio: [
      { name: "Audio Effects", path: "/audio/effects" },
      { name: "Background Music", path: "/audio/background" },
      { name: "Voice Overs", path: "/audio/voice" },
      { name: "Sound Design", path: "/audio/sound" },
    ],
  };

  return (
    <>
      <div className="flex space-x-8 fixed z-40  left-0 p-[35px] mt-[170px] sm:mt-[170px] md:mt-[130px] lg:mt-[150px] xl:mt-[170px] 2xl:mt-[170px]">
        {Object.keys(dropdownItems).map((category) => (
          <div
            key={category}
            className="relative inline-block group"
            onMouseEnter={() => setIsHovered(category)}
            onMouseLeave={() => setIsHovered(null)}>
            <button
              className={`relative px-4 py-2 text-neutral-20 bg-neutral-90 rounded-md transition duration-300 ease-in-out`}
              aria-haspopup="true"
              aria-expanded={isHovered === category}>
              {category}
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-secondary-40 transition-all duration-1000 transform group-hover:left-0 group-hover:w-1/2 z-50"></span>
              <span className="absolute bottom-0 right-1/2 w-0 h-[2px] bg-secondary-40 transition-all duration-1000 transform group-hover:right-0 group-hover:w-1/2 z-50"></span>
            </button>

            {isHovered === category && (
              <div
                className="absolute left-0 z-40 w-64 mt-0.5 bg-neutral-90 rounded-md shadow-lg transition-opacity duration-300 ease-in-out"
                onMouseEnter={() => setIsHovered(category)}
                onMouseLeave={() => setIsHovered(null)}>
                <div className="p-4 text-neutral-20">
                  <h4 className="font-bold mb-1">{category}</h4>
                  {dropdownItems[category].map(({ name, path }) => (
                    <Link
                      to={path}
                      key={name}
                      className="block py-2 hover:bg-gray-700 transition duration-200">
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DropdownMenu;
