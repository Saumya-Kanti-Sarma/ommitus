"use client";
{/*
  file path:  web/frontend/src/app/components/UI/Restaurant/Navbar.tsx
  Note     :  this file has logic of Navbar of restaurant portal (all routes having /restaurant). It checks for cookies (restaurantId and restaurantName) and if it doesn't find it then redirects to `/auth/get-started` for registration or login. 
 */}

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { redirect, usePathname } from "next/navigation";

export default function Navbar() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null); // this will store cookie
  const [restaurantName, setRestaurantName] = useState<string | null>(null); // this will store cookie
  const [menuOpen, setMenuOpen] = useState(false); // this will show or hide the sidebar menu in lower width divices

  const pathname = usePathname();

  //get cookies from browser
  useEffect(() => {
    const id = Cookies.get("restaurantId");
    const name = Cookies.get("restaurantName");
    if (!name || !id) redirect("/auth/get-started");
    setRestaurantId(id);
    setRestaurantName(name as string);
  }, []);

  // gives an active class to links in navbar w.r.t routes
  const linkClass = (href: string) =>
    `transition duration-200 ease-in-out hover:text-[var(--black)] 
     ${pathname === href ? "text-[var(--black)]" : ""}`;

  return (
    <nav className="w-full h-[70px] bg-[var(--blue)] text-[var(--white)] flex justify-between items-center px-6 py-3 shadow-md relative max-md:h-[60px]">
      <Link href={`/restaurant/${restaurantId}`}>
        <h1 className="text-xl font-bold">{restaurantName}</h1>
      </Link>

      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-6 text-lg">
        <li>
          <Link href={`/restaurant/${restaurantId}`} className={linkClass(`/restaurant/${restaurantId}`)}>
            Profile
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/create`} className={linkClass(`/restaurant/${restaurantId}/create`)}>
            Create Menu
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/menu`} className={linkClass(`/restaurant/${restaurantId}/menu`)}>
            All Menus
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/qr`} className={linkClass(`/restaurant/${restaurantId}/qr`)}>
            Get QR
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <img src="/icons/menu.svg" alt="menu" className="w-8 h-8" />
      </button>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed z-100 top-[60px] right-0 w-64 h-[calc(100vh-60px)] bg-[var(--gray)] text-[var(--black)] shadow-lg md:hidden transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col ">
          <Link
            href={`/restaurant/${restaurantId}`}
            className={`${linkClass(`/restaurant/${restaurantId}`)} p-4`}
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href={`/restaurant/${restaurantId}/create`}
            className={`${linkClass(`/restaurant/${restaurantId}/create`)} p-4`}
            onClick={() => setMenuOpen(false)}
          >
            Create Menu
          </Link>
          <Link
            href={`/restaurant/${restaurantId}/menu`}
            className={`${linkClass(`/restaurant/${restaurantId}/menu`)} p-4`}
            onClick={() => setMenuOpen(false)}
          >
            All Menus
          </Link>
          <Link
            href={`/restaurant/${restaurantId}/qr`}
            className={`${linkClass(`/restaurant/${restaurantId}/qr`)} p-4`}
            onClick={() => setMenuOpen(false)}
          >
            Get QR
          </Link>
        </div>
      </div>
    </nav>
  );
}