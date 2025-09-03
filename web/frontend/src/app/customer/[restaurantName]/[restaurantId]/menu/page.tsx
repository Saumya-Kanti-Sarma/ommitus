"use client";
import { useParams } from 'next/navigation'
import React from 'react'
{/*
  1. get restaurant name and id from params
  1.1: make a navbar with restaurant name, side filter dish menu 
  2. fetch dish from backend
  3. use dishCard component to display dish
  3.1: use pagination
  3.2: use pagination for dish with filters
  
  */}
const page = () => {
  const { restaurantName, restaurantId } = useParams();
  return (
    <div>
      {restaurantName + " " + restaurantId}
    </div>
  )
}

export default page
