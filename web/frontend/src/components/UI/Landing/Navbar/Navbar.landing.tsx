"use client";
import "./Navbar.landing.css";
import Link from "next/link";
import { LandingPageTypes } from "@/types/Landing.types";
import { useState } from "react";
import TypingAnimation from "../../Typing-Animation/TypingAnimation.UI.Component";
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
          <img src="/logo/ommitus-logo.svg" alt="menu-logo" className="max-w-[35px] mr-1 nav-img" />
          <div className="flex flex-col justify-start items-start">
            <TypingAnimation text="OMMITUS" extraStyles="text-[20px] font-black m-0" />
            <TypingAnimation text="Restaurant Services" extraStyles="text-[14px]" />
          </div>
        </div>
      </Link>
      {/* Navigation Links */}
      <div className="flex justify-between items-center gap-6">
        <ul className="hidden md:flex items-center gap-6">
          {['Features', 'About', 'Pricing', 'FAQs'].map((item, index) => (
            <li className="landing-nav-links cursor-pointer text-xl" key={index}>{item}</li>
          ))}
          <Link
            target="blank"
            href="/auth/get-started"
            className="landing-nav-links cursor-pointer text-xl"
          >
            Login
          </Link>
        </ul>
        <Link
          target="blank"
          href="/auth/get-started"
          className="get-started-btn bg-white text-[var(--black)] px-4 py-1 rounded-md font-medium"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
