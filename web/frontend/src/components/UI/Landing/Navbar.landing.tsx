"use client";

import Link from "next/link";
import { LandingPageTypes } from "@/types/Landing.types";
import { useState } from "react";
const LandingNavbar = ({ handleNavbtnClick = () => { } }: LandingPageTypes) => {
  const [navImg, setNavImg] = useState("/icons/menu.svg");
  return (
    <nav className="h-[70px] bg-[var(--black)] text-white py-4 px-8 flex justify-between items-center shadow-md relative border-b-1 border-[#ffffff42]">
      {/* Menu Button for Mobile */}
      <button className="block md:hidden cursor-pointer" onClick={() => {
        handleNavbtnClick();
        setNavImg((prev) => prev == "/icons/menu.svg" ? "/icons/gray-menu.svg" : "/icons/menu.svg")
      }}>
        <img src={navImg} alt="menu" className="w-8" />
      </button>
      {/* Brand */}
      <Link href={"/"}>
        <div className="flex justify-start items-center gap-1">
          <img src="/icons/logo5.png" alt="menu-logo" className="max-w-[50px]" />
          <div className="flex flex-col justify-start items-start">
            <h1 className="text-[18px] font-black m-0">OMMITUS</h1>
            <p className="text-[816x]">Restaurant Services</p>
          </div>
        </div>
      </Link>
      {/* Navigation Links */}
      <div className="flex justify-between items-center gap-6">
        <ul className="hidden md:flex items-center gap-6">
          {['Features', 'About', 'Pricing', 'FAQs'].map((item, index) => (
            <li className="hover:opacity-100 cursor-pointer transition-colors opacity-70" key={index}>{item}</li>
          ))}
          <Link
            target="blank"
            href="/auth/get-started"
            className="hover:opacity-100 cursor-pointer transition-colors opacity-70"
          >
            Login
          </Link>
        </ul>
        <Link
          target="blank"
          href="/auth/get-started"
          className="bg-white text-[var(--black)] px-4 py-1 rounded-md font-medium hover:opacity-90 transition-all"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
