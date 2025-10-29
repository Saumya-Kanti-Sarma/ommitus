import Link from "next/link";
import React from "react";

const LandingNavbar = () => {
  return (
    <nav className="bg-[#1191D0] text-white py-4 px-8 flex justify-between items-center shadow-md relative">
      {/* Brand */}
      <h1 className="text-2xl font-bold tracking-wide">Ommitus</h1>

      {/* Navigation Links */}
      <div className="flex justify-between items-center gap-6">
        <ul className="hidden md:flex items-center gap-6">
          <li className="hover:text-gray-200 cursor-pointer transition-colors">Features</li>
          <li className="hover:text-gray-200 cursor-pointer transition-colors">About</li>
          <li className="hover:text-gray-200 cursor-pointer transition-colors">Pricing</li>
          <li className="hover:text-gray-200 cursor-pointer transition-colors">FAQs</li>
          <Link
            target="blank"
            href="/auth/get-started"
            className="hover:text-gray-200 cursor-pointer transition-colors"
          >
            Login
          </Link>
        </ul>
        <Link
          target="blank"
          href="/auth/get-started"
          className="bg-white text-[#1191D0] px-4 py-1 rounded-md font-medium hover:opacity-90 transition-all"
        >
          Get Started
        </Link>
        {/* Menu Button for Mobile */}
        <button className="block md:hidden cursor-pointer">
          <img src="/icons/menu.svg" alt="menu" className="w-8" />
        </button>
      </div>
    </nav>
  );
};

export default LandingNavbar;
