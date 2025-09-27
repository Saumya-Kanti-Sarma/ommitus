"use client";
import { useDropdown } from '@/store/Store';
import { useParams, usePathname } from 'next/navigation';
import { DropdownStateTypes } from '@/types/Store.types';
import Link from 'next/link';
import { useEffect } from 'react';

const CustomerNavbar = () => {
  const { restaurantName, restaurantId } = useParams();
  const pathName = usePathname();
  const desiredPath = [`/customer/${restaurantName}/${restaurantId}/menu`, `/customer/${restaurantName}/${restaurantId}/menu/`];
  const toggleBtn = useDropdown((state: DropdownStateTypes) => state.toggleDropdown)
  const handleClick = () => toggleBtn();

  useEffect(() => {
    console.log(pathName);

  })
  return (
    <nav className="realtive flex items-center justify-between bg-[#43AF8E] text-white px-6 py-3 shadow-md">
      {
        desiredPath.includes(pathName) ?
          <>
            <button className="p-1" onClick={handleClick}>
              <img
                src="/icons/menu.svg"
                alt="menu.ico"
                className="w-7 h-7 "
              />
            </button>
          </>
          :
          <>
            <Link className="p-1" href={`/customer/${restaurantName}/${restaurantId}/menu`}>
              <img
                src="/icons/back.svg"
                alt="menu.ico"
                className="w-9 h-9 "
              />
            </Link>
          </>
      }
      <h1 className="text-lg font-semibold">
        <Link href={`/customer/${restaurantName}/${restaurantId}/menu`}>{decodeURIComponent(`${restaurantName}`)}</Link>
      </h1>
    </nav>
  )
}

export default CustomerNavbar
