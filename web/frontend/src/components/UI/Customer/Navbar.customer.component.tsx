"use client";

import React from 'react';
interface customerNavbarTypes {
  RestaurantName: string | undefined;
}
const CustomerNavbar: React.FC<customerNavbarTypes> = ({
  RestaurantName = ""
}) => {
  return (
    <nav className="flex items-center justify-between bg-[#43AF8E] text-white px-6 py-3 shadow-md">
      <button className="p-1">
        <img
          src="/icons/menu.svg"
          alt="menu.ico"
          className="w-7 h-7 "
        />
      </button>
      <h1 className="text-lg font-semibold">{RestaurantName}</h1>
    </nav>
  )
}

export default CustomerNavbar
