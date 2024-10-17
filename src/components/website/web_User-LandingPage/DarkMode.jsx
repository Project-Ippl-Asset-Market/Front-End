import React from "react";
import { RiMoonLine } from "react-icons/ri";
import { BiSun } from "react-icons/bi";

const DarkMode = () => {
  const [theme, setTheme] = React.useState("light");

  const element = document.documentElement;  

  React.useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="min-h-[44px] w-[40px] bg-[#F2F2F2] text-black rounded-[5px] border-[1px] border-black flex items-center justify-center gap-1"
      >
        {theme === "light" ? (
          <RiMoonLine className="text-xl text-black drop-shadow-sm cursor-pointer" />
        ) : (
          <BiSun className="text-xl text-black drop-shadow-sm cursor-pointer" />
        )}
      </button>
    </div>
  );
};

export default DarkMode;
