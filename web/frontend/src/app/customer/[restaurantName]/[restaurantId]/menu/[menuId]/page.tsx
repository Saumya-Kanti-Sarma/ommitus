"use client";
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const { menuId } = useParams();
  return (
    <>
      {menuId}
    </>
  )
}

export default page
