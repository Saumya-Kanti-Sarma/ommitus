"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function Navbar() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const id = Cookies.get("restaurantId");
    const name = Cookies.get("restaurantName");
    if (!name || !id) redirect("/auth/get-started");
    setRestaurantId(id);
    setRestaurantName(name as string);
  }, []);

  if (!restaurantId || !restaurantName) return null;

  return (
    <nav className="w-full h-[70px] bg-[var(--blue)] text-[var(--white)] flex justify-between items-center px-6 py-3 shadow-md relative max-md:h-[60px]">
      <h1 className="text-xl font-bold">{restaurantName}</h1>

      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-6 text-lg">
        <li>
          <Link href={`/restaurant/${restaurantId}/create`} className="hover:text-[var(--black)]">
            Create
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/menus`} className="hover:text-[var(--black)]">
            Menus
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/qr`} className="hover:text-[var(--black)]">
            Get QR
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/analytics`} className="hover:text-[var(--black)]">
            Analytics
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
        className={`fixed top-[60px] right-0 w-64 h-[calc(100vh-60px)] bg-[var(--gray)] text-[var(--black)] shadow-lg md:hidden transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col ">
          <Link
            href={`/restaurant/${restaurantId}/create`}
            className="p-4 text-[var(--black)] underline underline-offset-2"
            onClick={() => setMenuOpen(false)}
          >
            Create
          </Link>
          <Link
            href={`/restaurant/${restaurantId}/menus`}
            className="bg-[#e7e7e7] p-4 text-[var(--black)] underline underline-offset-2"
            onClick={() => setMenuOpen(false)}
          >
            Menus
          </Link>
          <Link
            href={`/restaurant/${restaurantId}/qr`}
            className="p-4 text-[var(--black)] underline underline-offset-2"
            onClick={() => setMenuOpen(false)}
          >
            Get QR
          </Link>
          <Link
            href={`/restaurant/${restaurantId}/analytics`}
            className="bg-[#e7e7e7] p-4 text-[var(--black)] underline underline-offset-2"
            onClick={() => setMenuOpen(false)}
          >
            Analytics
          </Link>
        </div>
      </div>
    </nav>
  );
}
