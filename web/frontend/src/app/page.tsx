"use client";
import MainLanding from "@/components/UI/Landing/Main/MainLanding";
import LandingNavbar from "@/components/UI/Landing/Navbar/Navbar.landing";
import LandingSideBar from "@/components/UI/Landing/Sidebar.landing";
import { useState } from "react";
export default function Home() {
  const [sidebar, setSideBar] = useState(false);
  return (
    <main className=" bg-[var(--black)] h-[100vh] w-full text-white ">
      <LandingNavbar handleNavbtnClick={() => setSideBar((prev) => !prev)} />
      <LandingSideBar showSideBar={sidebar} />
      <MainLanding />
    </main>
  );
}
