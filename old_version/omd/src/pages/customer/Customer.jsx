import React from 'react';
import { Outlet } from "react-router-dom";
import CustomerNavbar from "./Components/Navbar/Navbar.comp.jsx"
import "./Customer.css"
const Customer = () => {
  return (
    <>
      <head>
        <title>
          Welcome to our website
        </title>
      </head>
      <main className="cus-main">
        <section className='cus-nav-section'><CustomerNavbar /> </section>
        <section className='cus-main-section'> <Outlet /></section>
      </main>
    </>
  )
}

export default Customer
