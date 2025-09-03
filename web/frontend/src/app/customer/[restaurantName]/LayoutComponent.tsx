"use client";

import CustomerNavbar from "@/components/UI/Customer/Navbar.customer.component";
import { useParams } from "next/navigation";

const LayoutComponent = () => {
  const { restaurantName } = useParams();
  return (
    <CustomerNavbar RestaurantName={decodeURIComponent(`${restaurantName}`)} />
  )
}

export default LayoutComponent
