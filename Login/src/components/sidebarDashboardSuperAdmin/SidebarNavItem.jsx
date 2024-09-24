/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const SidebarNavItem = ({ item }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!item) {
    return null;
  }

  const isActive = item?.href && location.pathname === item.href;
  const itemClass = `flex items-center w-full p-2 text-primary-12 font-normal rounded-r-full hover:text-primary-12 hover:font-semibold hover:rounded-lg dark:text-primary-12 hover:bg-primary-2 dark:hover:bg-primary-2 ${
    isActive ? "bg-primary-2 dark:bg-primary-2" : ""
  }`;

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (item.type === "dropdown") {
    return (
      <div>
        <button className={itemClass} onClick={toggleDropdown}>
          {item.icon}
          <span className="ml-3">{item.label}</span>
          <span className="ml-auto">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 font-bold -ml-32 mt-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.292 7.292a1 1 0 011.416 0L10 10.586l3.292-3.294a1 1 0 011.416 1.416l-4 4a1 1 0 01-1.416 0l-4-4a1 1 0 010-1.416z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 font-bold -ml-32 mt-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M14.707 7.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        </button>
        {isOpen && (
          <ul className="pl-6 mt-2 space-y-2">
            {item.children?.map((child, index) => (
              <li key={index}>
                <Link to={child.href || "#"} className={itemClass}>
                  {child.icon}
                  <span className="ml-3">{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (item?.href) {
    return (
      <Link to={item.href} className={itemClass} onClick={item.onClick}>
        {item.icon}
        <span className="ml-3">{item.label}</span>
      </Link>
    );
  }

  return null;
};

export default SidebarNavItem;
