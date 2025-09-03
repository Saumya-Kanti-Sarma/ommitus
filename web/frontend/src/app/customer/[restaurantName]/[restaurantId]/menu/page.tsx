"use client";
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const { restaurantName, restaurantId } = useParams();
  return (
    <div>
      {restaurantName + " " + restaurantId}
    </div>
  )
}

export default page
