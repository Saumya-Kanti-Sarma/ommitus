import React, { useEffect, useState } from 'react';
import "./Menu.cus.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MenuCategory from "./MenuCategory.jsx";
import Footer from '../Components/Footer/Footer.comp.jsx';

const CustomerMenu = () => {
  const [RestaurantData, setRestaurantData] = useState(null);
  const { idOfRestaurant, nameOfRestaurant } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [filteredMenuData, setFilteredMenuData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all-items");
  const [newMenuData, setNewMenuData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [contentLoaading, setContentLoading] = useState("100%");
  const [loader, setLoader] = useState("none");
  const [dispTotalItems, setDispTotalItems] = useState("none");

  const [categories, setCategories] = useState(["all-items"]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/${idOfRestaurant}&available=true`);
        //console.log(response.data.data);
        setData(response.data.data);
        setNewMenuData(response.data.data);
        setFilteredMenuData(response.data.data); // Initially show all items
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    }
    fetchData();
  }, [idOfRestaurant]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/restaurant/${idOfRestaurant}/get-all-categories`
        );
        const fetchedCategories = response.data.categories || [];
        setCategories((prev) => Array.from(new Set(["all-items", ...prev, ...fetchedCategories])));
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategory();
  }, [idOfRestaurant]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/get-info/${idOfRestaurant}`);
        //console.log(response.data.restaurantDetails);
        setRestaurantData(response.data.restaurantDetails);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }

    fetchData();
  }, [idOfRestaurant]); // Trigger the effect only when idOfRestaurant changes


  if (data == null && !RestaurantData) {
    return (
      <>
        <span className='menu-span-container'>
          <section className='cus-menu-section'>
            {Array(8).fill().map((_, index) => (
              <div key={index} className='menu-item-area-animated add-animation'>
                <img src="/food.png" alt="" />
                <span></span>
              </div>
            ))}
          </section>
        </span>
      </>
    );
  }

  // Handle filter button click
  const handleFilterClick = (category) => {
    setActiveFilter(category);
    setLoader("");
    setContentLoading("0%");
    if (category === "all-items") {
      //console.log(newMenuData);
      setTotalItems(newMenuData.length);
      setFilteredMenuData(newMenuData); // Show all items
      setDispTotalItems("");
      setTimeout(() => {
        setLoader("none");
        setContentLoading("100%");
      }, 300);
    } else {
      const filteredData = newMenuData.filter((item) => item.category === category);
      setFilteredMenuData(filteredData);
      setTotalItems(filteredData.length);
      setDispTotalItems("");
      setTimeout(() => {
        setLoader("none");
        setContentLoading("100%");
      }, 500);
    }
  };

  // Group menu data by category
  const groupedMenuData = filteredMenuData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});


  return (
    <>
      <section className='cus-menu-section'>
        <div className="filter-dish-section">
          <h3>Filter:</h3>
          <div className='filter-btns-div'>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`cus-filter-dish-section-btns ${activeFilter === category ? "cusactivebtn" : ""}`}
                onClick={() => handleFilterClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <hr />
        <br />
        <div className='def-loader' style={{ display: loader }}></div>

        <div style={{ opacity: contentLoaading || "100%" }} className='cus-dish-container-area'>
          <h1 className='cus-category-heading'>| {activeFilter} |</h1>
          <p className='cus-category-total' style={{ display: dispTotalItems }}>Total items: {totalItems}</p>
          {Object.keys(groupedMenuData).map((category, index) => (
            <MenuCategory
              key={index}
              title={category}
              items={groupedMenuData[category]}
              navigate={navigate}
              nameOfRestaurant={nameOfRestaurant}
              idOfRestaurant={idOfRestaurant}
            />
          ))}
        </div>
        <Footer RestaurantData={RestaurantData}
        />
      </section>

    </>
  );
};

export default CustomerMenu;
