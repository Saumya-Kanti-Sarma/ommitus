import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import "./ProfileCard.comp.css";
import BtnComponent from '../Btns/Btn.comp.jsx';
import axios from "axios";
import toast from "react-hot-toast";

const ProfileCardComponent = ({ img, name, description }) => {
  const { idOfRestaurant } = useParams();
  const [displayPopup, setDisplayPopup] = useState("none")
  // References
  const restaurantRef = useRef(null);
  const ownerRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const aboutRef = useRef(null);
  const categoryRef = useRef(null);

  const [data, setData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    about: "",
    categories: [""]
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    // Split the input value into an array based on the comma separator
    const categoriesArray = value.split(',').map((category) => category.trim());
    setData({ ...data, categories: categoriesArray });
    console.log(categoriesArray);
  };

  const handleKeyDown = (e, ref) => {
    if (e.key === "Enter" && ref.current) {
      ref.current.focus();
    }
  };

  const handleSubmit = async () => {
    // console.log(data);
    const id = toast.loading("saving changes...")
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/restaurant/update/${idOfRestaurant}`,
        data
      );
      toast.dismiss(id);
      toast.success("Data updated successfully!");
      setDisplayPopup("none");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.dismiss(id);
      toast.error("Data update un-successfull!");
      console.error("Error updating data:", error);
    }
  };


  const handleClosePopup = () => {
    displayPopup == "none" ? setDisplayPopup("") : setDisplayPopup("none");
  }
  const handleCloseOnly = () => setDisplayPopup("none");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/get-info/${idOfRestaurant}`);
        setData((prevData) => ({
          ...prevData,
          ...response.data.restaurantDetails,
        }));
        //console.log("proffile data", data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [idOfRestaurant]);

  return (
    <>
      <section id='profile-card'>
        <img src={img || "/profile.jpg"} id="profle-card-img" />
        <aside id='profile-card-aside'>
          <span id='profile-name'>
            <h2>{data.restaurantName || "Name of restaurant"}</h2>
            <BtnComponent
              text={"EDIT"}
              onclick={handleClosePopup}
              padding={"5px 15px"}
              borderRadius={"2px"}
            />
          </span>
          <p id='profile-description'>
            <span>ABOUT</span> <br />
            {data.about || "add about your restaurant..."}
          </p>
        </aside>
      </section>
      <div className='popup' onClick={handleCloseOnly} style={{ display: displayPopup }}>
        <section className='popup-child' onClick={(e) => { e.stopPropagation() }}>
          <span>
            <p>Restaurant Name:</p>
            <input
              className="input-popup-child"
              name='restaurantName'
              value={data.restaurantName}
              onChange={handleChange}
              placeholder='Enter restaurant name here'
              onKeyDown={(e) => handleKeyDown(e, ownerRef)}
              autoFocus
              type='text'
              ref={restaurantRef}
            />
          </span>
          <span>
            <p>Owner Name:</p>
            <input
              className="input-popup-child"
              name='ownerName'
              value={data.ownerName}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
              ref={ownerRef}
              placeholder='Enter owner name'
              type='text'
            />
          </span>
          <span>
            <p>Phone Number:</p>
            <input
              className="input-popup-child"
              name='phoneNumber'
              value={data.phoneNumber}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, aboutRef)}
              ref={phoneNumberRef}
              type='text'
              placeholder='Enter phone number'
            />
          </span>
          <span>
            <p>Email:</p>
            <input
              disabled
              className="input-popup-child"
              name='email'
              value={data.email}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, aboutRef)}
              placeholder='Enter Email'
              type='email'
              ref={emailRef}
            />
          </span>
          <span>
            <p>About:</p>
            <textarea
              name='about'
              value={data.about}
              onChange={handleChange}
              placeholder='About'
              ref={aboutRef}
              onKeyDown={(e) => handleKeyDown(e, categoryRef)}
              className='input-popup-child paragraph-input-popup'
            />
          </span>
          <span>
            <p>Category:</p>
            <textarea
              name='categories'
              value={data.categories}
              onChange={handleCategoryChange}
              placeholder='categories'
              ref={categoryRef}
              onKeyDown={(e) => handleKeyDown(e, restaurantRef)}
              className='input-popup-child paragraph-input-popup'
            />
          </span>
          <BtnComponent
            text={"Submit"}
            width={"50%"}
            fontSize={"20px"}
            onclick={handleSubmit}
          />
        </section>
      </div>
    </>
  );
};

export default ProfileCardComponent;
