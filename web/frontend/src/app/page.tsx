"use client";
import MainLanding from "@/components/UI/Landing/Main/MainLanding";
import LandingNavbar from "@/components/UI/Landing/Navbar/Navbar.landing";
export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className=" bg-[var(--black)] h-[calc(100vh-70px)] w-full text-white overflow-auto hideScrollbar">
        <MainLanding />
      </main>
    </>
  );
}
