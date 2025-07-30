import React from 'react';
import './Footer.comp.css';
import { Link } from "react-router-dom";
const Footer = ({ RestaurantData, onClick }) => {
  return (
    <footer className="footer">
      <section>
        <p
          onClick={onClick || null}
        >{RestaurantData?.restaurantName}</p>

        <div className="footer-info">
          <br />
          <p><strong>Contact:</strong></p>
          <p>{RestaurantData?.phoneNumber}</p>
          <p>{RestaurantData?.email}</p>
          <br />
          <p>Propt. of: {RestaurantData?.ownerName}</p>
          <p>Joined Ommitus at: {RestaurantData?.created?.slice(0, 16)}</p>
        </div>
        <br />
      </section>
      <div className="footer-branding">Menu Powered by <Link to={"/"} style={{ color: "orange" }}>ommitus.pages.dev</Link></div>
    </footer>
  );
};

export default Footer;
