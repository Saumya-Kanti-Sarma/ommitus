"use client";
import "./Navbar.landing.css";
import Link from "next/link";
import TypingAnimation from "../../Typing-Animation/TypingAnimation.UI.Component";
import GetStartedBtn from "../GetstartedBtn/GetStarted.component";
const LandingNavbar = () => {
  return (
    <nav className="h-[70px] bg-[var(--black)] text-white py-4 px-8 flex justify-between items-center shadow-md relative border-b-1 border-[#ffffff42]">

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
        <GetStartedBtn />
      </div>
    </nav>
  );
};

export default LandingNavbar;
