import React, { useState } from 'react'
import NavbarComponent from '../../../components/Navbar/Navbar.comp'
import { Outlet } from "react-router-dom";
import "./ResHome.res.css";
const ResHome = () => {
  // const [support, setSupport] = useState('none');
  return (
    <>
      <main id='res-main-area'>
        <section id='nav-area-restaurant'>

          <NavbarComponent />
        </section>

        <section id='outlet-area-restaurant'>
          <Outlet />
          {/* Save it for future */}
          {/* <p id='customer-support-txt'
            style={{ display: support }}
            onMouseEnter={() => setSupport("")}
            onMouseLeave={() => setSupport("none")}
          >Need any help? Talk to our customer <Link to={"#"}>support</Link></p>
          <button id='whatsapp-btn'
          >
            <img src="/whatsapp.svg"
              onMouseEnter={() => setSupport("")}
              onMouseLeave={() => setSupport("none")}
              id="customer-supporrt-whatsapp" />

          </button> */}
        </section>
      </main>
    </>
  )
}

export default ResHome
