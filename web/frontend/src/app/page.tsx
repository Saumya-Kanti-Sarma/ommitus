"use client";
import LandingNavbar from "@/components/UI/Landing/Navbar.landing";
import LandingSideBar from "@/components/UI/Landing/Sidebar.landing";
import { useState } from "react";
export default function Home() {
  const [sidebar, setSideBar] = useState(false);
  return (
    <main className=" bg-[var(--black)] h-[100vh] w-full text-white ">
      <LandingNavbar handleNavbtnClick={() => setSideBar((prev) => !prev)} />
      <LandingSideBar showSideBar={sidebar} />
    </main>
  );
}
