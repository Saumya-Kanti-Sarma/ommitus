"use client";
import MainLanding from "@/components/UI/Landing/Main/MainLanding";
import LandingNavbar from "@/components/UI/Landing/Navbar/Navbar.landing";
import LandingSideBar from "@/components/UI/Landing/Sidebar.landing";
import { useState } from "react";
export default function Home() {
  const [sidebar, setSideBar] = useState(false);
  return (
    <>
      <LandingNavbar handleNavbtnClick={() => setSideBar((prev) => !prev)} />
      <main className=" bg-[var(--black)] h-[calc(100vh-70px)] w-full text-white overflow-auto">
        <LandingSideBar showSideBar={sidebar} />
        <MainLanding />
      </main>
    </>
  );
}
