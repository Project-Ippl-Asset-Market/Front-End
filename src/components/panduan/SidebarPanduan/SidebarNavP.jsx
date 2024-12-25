/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const SidebarNav = ({ item }) => {
  const location = useLocation();
  

  if (!item) return null;

  // ini akan menentukan apakah item ini aktif berdasarkan rute saat ini
  const isActive = item?.href && location.pathname === item.href;
  const isChildActive = item.children?.some(
    (child) => location.pathname === child.href
  );
  

  const itemClass = `font-poppins flex items-center w-full p-2 text-neutral-10 font-semibold rounded-r-full hover:text-primary-100 hover:font-semibold hover:rounded-lg dark:text-primary-100 hover:bg-secondary-40 dark:hover:bg-secondary-40 ${
    isActive ? "bg-secondary-40 dark:bg-secondary-40" : ""
  }`;
  if (item?.href) {
    return (
      <Link to={item.href} className={itemClass} onClick={item.onClick}>
        {item.icon}
        <span className="ml-3 text-lg">{item.label}</span>
      </Link>
    );
  }

  return null;
};

export default SidebarNav;