"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Navbar() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  useEffect(() => {
    const id = Cookies.get("restaurantId");
    const name = Cookies.get("restaurantName");
    if (id) setRestaurantId(id);
    if (name) setRestaurantName(name);
  }, []);

  if (!restaurantId || !restaurantName) return null;

  return (
    <nav className="w-full bg-[var(--blue)] text-[var(--white)] flex justify-between items-center px-6 py-3 shadow-md">
      <h1 className="text-xl font-bold">{restaurantName}</h1>
      <ul className="flex gap-6 text-lg">
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
            QR
          </Link>
        </li>
        <li>
          <Link href={`/restaurant/${restaurantId}/analytics`} className="hover:text-[var(--black)]">
            Analytics
          </Link>
        </li>
      </ul>
    </nav>
  );
}
