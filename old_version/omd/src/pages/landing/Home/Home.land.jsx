import React, { useEffect, useState } from 'react';
import "./Home.land.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';
import QRCode from "react-qr-code";
const HomeLanding = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const cookie = Cookies.get("restaurantCredentialToken");
    if (cookie !== undefined) {
      async function getUser() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/search/${cookie}`);
          setToken(response.data); // Set token once
          console.log(response.data); // Log the response directly
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      }
      getUser();
    } else {
      console.log("No token found");
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <>
      <head>
        <title>
          Welcome to Ommitus || The best Restaurant Menu Management App
        </title>
      </head>
      {/* NAVBAR AREA */}
      <nav className='landing-nav-area'>
        <h1>
          <img src="/logo1.png" className="nav-logo" />
          <Link to={`/`}>Ommitus Menus</Link></h1>
        <ul>
          <button>About</button>
          <button>Contact</button>
          <button>FaQ</button>
          <button>Pricing</button>
          <Link
            to={
              !token
                ? "/restaurant/create-account"
                : `/restaurant/${token.restaurantName.replace(/\s+/g, "-")}/${token.restaurantID}/profile`
            }
          >
            {token?.restaurantName || "Get Started"}
          </Link>
        </ul>
      </nav>
      <main className='landing-main'>
        <section className='landing-section'>
          <div className="landing-main-child landing-main-text-area">
            <h1 className='landing-heading'>
              Welcome to <span>OMMITUS MENU</span>, your one stop solution to bring your menu <span>ONLINE</span>...
            </h1>
            <button className='get-started-btn opacity-trans' onClick={() => navigate('/restaurant/create-account')}> Get Started </button>
          </div>
          <div className="landing-main-child landing-main-logo-area">

            <img src="/logo3.png" className="landing-logo" />
          </div>
        </section>
        <div className="landing-start-your-journery">
          <h1>Start your new journey with us...</h1>
          <section className='lading-restaurant-types-slideShow'>
            <p>RESTAURANT</p>
            <p>CAFES</p>
            <p>HOTELS</p>
            <p>PUBS</p>
            <p>CLUBS</p>
          </section>
        </div>
        <br /><br /><br /><br /><br /><br />
        <h1 className='bring-your-menu'>BRING YOUR MENU ONLINE <span style={{ color: "#f96305" }}>TODAY!</span></h1>
        <br />
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button className='get-started-btn opacity-trans' onClick={() => navigate('/restaurant/create-account')}> GET STARTED NOW </button>
        </div>

        <br /><br /><br /><br /><br /><br />
        <span className='demo-qrcode-area'>
          <h1>
            Scan this QR code and visit our demo restaurant

          </h1>
          <QRCode
            value={`https://ommitus.pages.dev/customer/restaurant/Gourmate-heavens/6741bbdd429688875d7bf1cc/menu`}
            style={{
              backgroundColor: "white",
              padding: "15px",
              border: "2px solid black",
              borderRadius: "12px",
              boxShadow: "0 0 10px 0 #00000057",
            }}
          />
        </span>
        <br /><br /><br /><br /><br /><br />
        <section className='landing-features-section'>
          <h1><span>We</span> are <span>North-East</span> India based startup working day and night to provide you the best <span>features</span>.. </h1>
          <span className='listof-features opacity-trans'>FEATURES WE PROVIDE </span>
          <ul className='all-list-of-features'>
            <section>
              <img src="/landing/online.svg" />
              <p>ONLINE WEBSITE</p>
            </section>
            <section>
              <img src="/landing/food.svg" />
              <p>ONLINE MENU</p>
            </section>
            <section>
              <img src="/landing/database.svg" />
              <p>SECURED DATA</p>
            </section>
            <section>
              <img src="/landing/menu.svg" />
              <p>UNLIMITED MENUS</p>
            </section>
            <section>
              <img src="/landing/payment.svg" />
              <p>ONE TIME PAYMENT</p>
            </section>
            <section>
              <img src="/landing/qrcode.svg" />
              <p>CUSTOM QR CODE</p>
            </section>
            <section>
              <img src="/landing/webdev.svg" />
              <p>CUSTOM WEB DESIGN</p>
            </section>
            <section>
              <img src="/landing/support.svg" />
              <p>24x7 CUSTOMER SUPPORT</p>
            </section>
            <section>
              <img src="/landing/handshake.svg" />
              <p>SCALE WITH YOU</p>
            </section>
            <section>
              <img src="/landing/box.svg" />
              <p>MANY MORE</p>
            </section>
          </ul>
        </section>
        <br />
        <br /><br />

      </main>
    </>
  )
}

export default HomeLanding
