import React, { useEffect, useState } from 'react';
import "./Dish.cus.css";
import Button from '../Components/Btn/Button.comp.jsx';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import MenuCategory from '../Menus/MenuCategory.jsx';
import Footer from '../Components/Footer/Footer.comp.jsx';
const CustomerDish = () => {
  const navigate = useNavigate();
  const { idOfRestaurant, dishId, nameOfRestaurant } = useParams();
  const [data, setData] = useState(null);
  const [category, setCategory] = useState(null);
  const [categorydisplay, setCategoryDisplay] = useState("");
  const [imgBackground, setImgBackground] = useState("none");
  const [activeImage, setActiveImage] = useState("");
  const [categoryLoading, setCategoryLoading] = useState("none");

  const [RestaurantData, setRestaurantData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/get-one/${idOfRestaurant}/${dishId}`);
      setTimeout(() => {
        setData(response.data.data);
      }, 400);
    }
    fetchData();
  }, [idOfRestaurant]);
  useEffect(() => {
    async function fetchCategoryData() {
      setCategoryLoading("flex");
      setCategoryDisplay('none');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/all-items/${idOfRestaurant}/${data?.category}`);

      setCategory(response.data.data);
      setTimeout(() => {
        setCategoryDisplay("");
        setCategoryLoading("none")
      }, 2000);
    }
    fetchCategoryData();
  }, [idOfRestaurant, data])

  const groupedMenuData = category?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/get-info/${idOfRestaurant}`);
        console.log(response.data.restaurantDetails);
        setRestaurantData(response.data.restaurantDetails);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }

    fetchData();
  }, [idOfRestaurant]); // Trigger the effect only when idOfRestaurant changes



  if (!data && !RestaurantData) {
    return (
      <main className="cus-dish-main">
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "start", height: "100%", width: "100%"
        }}>
          <div className="cus-dish-area-loading">
            <img src="/food.png" alt="Loading" className='cus-loading-img' />
            <section className="cus-dishmain-text-section-loading"></section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cus-dish-main">
      <div className="cus-dish-main-child">
        <div className="cus-dish-area">
          <div
            className='image-baclground'
            style={{ display: imgBackground }}
            onClick={() => {
              setActiveImage((prev) => prev == "" ? "active-image" : "");
              setImgBackground((prev) => prev == "none" ? "" : "none");
            }}
          ></div>
          <img
            src={data?.image[0] || "/food.png"}
            alt="Dish"
            className={`cus-dishMain-food-img ${activeImage}`}
            onClick={() => {
              setActiveImage((prev) => prev == "" ? "active-image" : "");
              setImgBackground((prev) => prev == "none" ? "" : "none");
            }}
          />

          <section className="cus-dishmain-text-section">
            <h1>{data?.dishName || "Unavailable"}</h1>
            <p style={{ color: data?.veg ? "green" : "red" }}>
              {data?.veg ? "Veg" : "Non-Veg"} <b>{data?.category}</b>
            </p>
            <p >Price: {data?.fullPlate && data?.halfPlate ? `₹${data?.fullPlate}.00/₹${data?.halfPlate}.00` : `₹${data?.fullPlate}.00`}</p>

            <p style={{ display: data?.description?.length > 0 ? "" : "none" }}>{data?.description}</p>
          </section>
        </div>
      </div>
      <br />
      <h1 style={{ textAlign: "center", fontSize: "18px" }}>Check other {data?.category}</h1>
      {
        groupedMenuData && Object.keys(groupedMenuData).map((categoryName, index) => (
          <span
            onClick={() => {
              setTimeout(() => {
                window.location.reload();
              }, 120);
            }}
            style={{ display: categorydisplay }}
          >
            <MenuCategory
              key={index}
              title={categoryName} // Pass the category name
              items={groupedMenuData[categoryName]} // Pass items in this category
              navigate={navigate}
              nameOfRestaurant={nameOfRestaurant}
              idOfRestaurant={idOfRestaurant}
            />
          </span>

        ))
      }
      <br />
      <div className='cus-menu-span-container' style={{ display: categoryLoading }} >
        <div className='cus-menu-span-container-child'>
          {Array(8).fill().map((_, index) => (
            <div key={index} className='menu-item-area-animated add-animation'>
              <img src="/food.png" alt="" />
              <span></span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          label={"Back To Menu"}
          styles={{ width: "90%", padding: "20px 0", fontSize: "18px", maxWidth: "800px" }}
          onClick={() => navigate(`/customer/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu`)} />
      </div>
      <br />
      <br />
      <Footer RestaurantData={RestaurantData}
        onClick={() => {
          navigate(`/customer/restaurant/${nameOfRestaurant}/${idOfRestaurant}/menu`)
        }}
      />
    </main>
  );
};

export default CustomerDish;
