"use client";
import { useDropdown } from '@/store/Store';
import { useParams } from 'next/navigation';
import { DropdownStateTypes } from '@/types/Store.types';

const CustomerNavbar = () => {
  const { restaurantName } = useParams();

  const toggleBtn = useDropdown((state: DropdownStateTypes) => state.toggleDropdown)
  const handleClick = () => toggleBtn();

  return (
    <nav className="realtive flex items-center justify-between bg-[#43AF8E] text-white px-6 py-3 shadow-md">
      <button className="p-1" onClick={handleClick}>
        <img
          src="/icons/menu.svg"
          alt="menu.ico"
          className="w-7 h-7 "
        />
      </button>
      <h1 className="text-lg font-semibold">{decodeURIComponent(`${restaurantName}`)}</h1>
    </nav>
  )
}

export default CustomerNavbar
