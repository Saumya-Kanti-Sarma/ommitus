import React, { useState, useEffect } from 'react';
import "./Navbar.comp.css";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
const NavbarComponent = ({
}) => {
  const [activate0, setactivate0] = useState("");
  const [activate1, setactivate1] = useState("");
  const [activate2, setactivate2] = useState("");
  const [activate3, setactivate3] = useState("");
  const [activate4, setactivate4] = useState("");
  const navigate = useNavigate();
  const { nameOfRestaurant, idOfRestaurant } = useParams();
  const location = useLocation();
  useEffect(() => {
    // Check the current path and set the active state accordingly
    if (location.pathname === `/restaurant/${nameOfRestaurant}/${idOfRestaurant}/profile`) {
      setactivate0("active-link");
      setactivate1("")
      setactivate2("");
      setactivate3("");
      setactivate4("");

    } else if (location.pathname === `/restaurant/${nameOfRestaurant}/${idOfRestaurant}/create-menu`) {
      setactivate0("");
      setactivate1("active-link")
      setactivate2("");
      setactivate3("");
      setactivate4("");
    } else if (location.pathname === `/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu/available`) {
      setactivate0("");
      setactivate1("")
      setactivate2("active-link");
      setactivate3("");
      setactivate4("");
    } else if (location.pathname === `/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu/un-available`) {
      setactivate0("");
      setactivate1("")
      setactivate2("");
      setactivate3("active-link");
      setactivate4("");
    }
    else if (location.pathname === `/restaurant/${nameOfRestaurant}/${idOfRestaurant}/qr-code`) {
      setactivate0("");
      setactivate1("")
      setactivate2("");
      setactivate3("");
      setactivate4("active-link");
    }
  }, [location.pathname, nameOfRestaurant, idOfRestaurant]);
  return (
    <>
      <nav className='nav-componets'>
        <section className='nav-elements nav-name'>
          <h1
            className={`${activate0}`}
            onClick={() => {
              navigate(`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/profile`)
            }}
          >
            {nameOfRestaurant || "Name Of Restaurant"}
          </h1>
        </section>
        <section className='nav-elements nav-link-section'>
          <li className={`navlinks ${activate1}`}
            onClick={() => {
              navigate(`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/create-menu`)
            }}
          >
            CREATE MENU</li>
          <li className={`navlinks ${activate2}`}
            onClick={() => {
              navigate(`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu/available`)
            }}
          >
            AVAILABLE</li>
          <li className={`navlinks ${activate3}`}
            onClick={() => {
              navigate(`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu/un-available`)
            }}
          >
            UN-AVAILABLE</li>
          <li className={`navlinks ${activate4}`}
            onClick={() => {
              navigate(`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/qr-code`)
            }}
          >
            QR-CODE</li>
        </section>
      </nav>
    </>
  )
}

export default NavbarComponent
