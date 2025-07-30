import React, { useRef, useState } from 'react';
import BtnComponent from "../Btns/Btn.comp.jsx";
import axios from "axios";
import "./Register.comp.css";
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const RegisterComponent = ({
  parentWidth,
  parentHeight,
  displayName,
  displayOwnerName,
  displayPassword,
  btnTxt,
  displayEmail,
  url,
  PasswordTxt
}) => {
  const restaurantref = useRef(null);
  const ownerref = useRef(null);
  const emailref = useRef(null);
  const passwordref = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    restaurantName: "",
    email: "",
    password: "",
    ownerName: "",
  })

  const [password, setPassword] = useState("password");// toggle between password and text
  const [image, setImage] = useState("/close-eye.svg");// toggle between password and text


  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
    //console.log(data);

  };
  const handleRef = (e, nextRef, prevRef) => {

    if (e.key === "Enter" || e.key === "ArrowDown") {
      nextRef?.current?.focus();
    } else if (e.key === "ArrowUp") {
      prevRef?.current?.focus();
    }
  };


  const HandleTogglePassword = () => {
    if (password == "password") {
      setPassword("text");
      setImage("/open-eye.svg");
    }
    else {
      setPassword("password");
      setImage("/close-eye.svg");
    }
  }

  const handleSubmit = async () => {
    // console.log(`${import.meta.env.VITE_BACKEND_URL}${url}`);

    if (url !== "/restaurant/forgot-password") {
      const toastID = toast.loading("creating your new account..")
      try {

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${url}`, data);
        //console.log(response.data.data.token);
        Cookies.set('restaurantCredentialToken', `${response.data.data.token}`, { expires: 7 });
        const cookie = Cookies.get("restaurantCredentialToken");

        if (cookie == undefined) {
          toast.error("cannot validate restaurant credentials, please contact us!")
        }
        else {
          setTimeout(() => {
            const restaurantName = response.data.data.restaurantName
            navigate(`/restaurant/${restaurantName.replace(/\s+/g, '-')}/${response.data.data._id}/profile`)
          }, 600);
        }
        setTimeout(() => {
          toast.dismiss(toastID);
          toast.success(response.data.message);

        }, 300);
      } catch (error) {
        toast.dismiss(toastID);
        console.log(error);
        toast.error(error.response.data.message)

      }
    }
    else {
      const toastID = toast.loading("Changing Password..");
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${url}`, data);
        setTimeout(() => {
          toast.dismiss(toastID);
          toast.success(response.data.message);

        }, 300);
      } catch (error) {
        toast.dismiss(toastID)
      }
    }

  };


  return (
    <>
      <div className='register-component-main'
        style={{
          width: parentWidth,
          height: parentHeight,
        }}
      >
        <section className='filed-area'
          style={{
            display: displayName
          }}
        >
          <p>NAME OF RESTAURANT:</p>
          <input
            autoFocus
            type="text"
            value={data.restaurantName}
            onChange={(e) => handleChange("restaurantName", e.target.value)}
            onKeyDown={(e) => handleRef(e, ownerref, null)}
            ref={restaurantref}
            placeholder='Enter the name of your restaurant'
          />
        </section>
        <section className='filed-area'
          style={{
            display: displayOwnerName
          }}
        >
          <p>OWNER NAME:</p>
          <input
            type="name"
            value={data.ownerName}
            onChange={(e) => handleChange("ownerName", e.target.value)}
            ref={ownerref}
            onKeyDown={(e) => handleRef(e, emailref, restaurantref)}
            placeholder='Enter the owner name'
          />
        </section>
        <section className='filed-area'
          style={{
            display: displayEmail
          }}
        >
          <p>Email:</p>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            ref={emailref}
            onKeyDown={(e) => handleRef(e, passwordref, ownerref)}
            placeholder='Enter your email ID'
          />
        </section>
        <section className='filed-area password-filed'
          style={{
            display: displayPassword
          }}
        >
          <p>{PasswordTxt || "PASSWORD:"}</p>
          <input
            type={password}
            value={data.password}
            onChange={(e) => handleChange("password", e.target.value)}
            ref={passwordref}
            onKeyDown={(e) => handleRef(e, restaurantref, ownerref)}
            placeholder='•••••••••'
          />
          <img src={image} onClick={HandleTogglePassword} />
        </section>


        <BtnComponent
          backgroundColor={"#fff"}
          color={"#000"}
          padding={"20px 60px"}
          borderRadius={"16px"}
          border={"none"}
          text={btnTxt || "Continue"}
          onclick={handleSubmit}
        />
      </div>
    </>
  )
}

export default RegisterComponent
