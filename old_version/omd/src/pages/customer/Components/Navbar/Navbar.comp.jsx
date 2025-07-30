import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Navbar.comp.css';
import axios from 'axios';

const CustomerNavbar = () => {
  const { nameOfRestaurant, idOfRestaurant } = useParams();
  const [menuTransform, setMenuTransforn] = useState(100);
  const navigate = useNavigate();
  const handleToggle = () => {
    setMenuTransforn((prev) => prev == 100 ? 0 : 100)
  }

  const [availableCategories, setAvailableCategories] = useState(["all-items", "starter", "main-course", "curry", "beverages", "special", "rice", "chinese", "roti", "salad", "momos", "noodles", "birayani", "tandoori", "drinks", "fries", "soup", "stakes", "roast", "rolls", "cutlets",]);
  const [activeClass, setActiveClass] = useState(null);
  useEffect(() => {
    async function fetchData() {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/all-categories/${idOfRestaurant}`)
        .then((response) => setAvailableCategories(response.data.data))
        .catch((err) => console.log(err.message))
    }
    fetchData();
  }, [])
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/customer/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu`)
          }}
        >{nameOfRestaurant || "Name of restaurant"}</h1>
        <p>powered by Ommitus</p>
      </div>
      <img src="/logo4.png"
        alt="ommitus.com"
        //onClick={handleToggle}
        onClick={() => navigate("/")}
      />
      <div className='nav-category-area'
        onClick={() => setMenuTransforn(100)}
        style={{ right: `-${menuTransform}%` }}>
        <section
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Menu Categories</h1>
          <p className={`menu-item-category-list ${activeClass == -1 ? "menu-list-active" : ""}`}
            onClick={() => {
              setActiveClass(-1);
              setTimeout(() => {
                setMenuTransforn(100)
              }, 120);
            }}
          >all-items</p>
          {availableCategories.map((item, index) => (
            <>
              <p className={`menu-item-category-list ${activeClass == index ? "menu-list-active" : ""}`}
                onClick={() => {
                  setActiveClass(index);
                  setTimeout(() => {
                    setMenuTransforn(100)
                  }, 120);
                }}
              >{item}</p>
            </>
          ))}
        </section>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
