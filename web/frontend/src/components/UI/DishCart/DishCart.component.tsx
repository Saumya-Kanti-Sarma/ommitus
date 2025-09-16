"use client";
import Link from 'next/link';
import React from 'react'
import DishCartTypes from '@/types/DishCart.types';

const Dish: React.FC<DishCartTypes> = ({
  idx,
  allDishes = [],
  redirectUrl,
  dish
}) => {
  return (
    <Link
      key={idx}
      id={idx === allDishes.length - 1 ? "last-dish" : undefined} // attach observer to last dish
      href={`${redirectUrl}/${dish?._id}`}
      className="bg-[var(--white)] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-200 max-w-[320px] max-md:w-[300px] max-md:mx-auto max-md:my-0 hover:scale-101"
    >
      <img src={dish?.image?.[0] || ""} alt={dish?.dishName} className="w-full h-40 object-cover" />
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-[var(--black)]">{dish?.dishName}</p>
          <span
            className={`w-3 h-3 rounded-full ${dish?.veg ? "bg-[var(--green)]" : "bg-[var(--red)]"}`}
          />
        </div>
        <p
          className={`text-sm font-medium ${dish?.available ? "text-[var(--green)]" : "text-[var(--red)]"}`}
        >
          {dish?.available ? "Available" : "Unavailable"} | {dish?.category}
        </p>
        <div className="flex gap-4 text-sm text-[var(--dark-blue)]">
          {dish?.fullPlate && <p className="font-medium">₹{dish?.fullPlate}{dish?.halfPlate == 0 ? "" : ` / ₹${dish.halfPlate}`}</p>}
        </div>
      </div>
    </Link>
  )
}

export default Dish
