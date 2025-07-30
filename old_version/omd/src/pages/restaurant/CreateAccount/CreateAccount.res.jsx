//src/pages/restaurant/CreateAccount/CreateAccount.res.jsx
import React from 'react'
import { Link } from "react-router-dom"
import "./CreateAccount.res.css"
import RegisterComponent from '../../../components/register/Register.comp'
import BtnComponent from '../../../components/Btns/Btn.comp'
const RestaurantCreateAccount = () => {
  return (
    <>
      <head>
        <title>
          Create account with Ommitus
        </title>
      </head>
      <main className='main-registration-area'>
        <aside className='reg-text-parent'>
          <img src="/ommitus-logo.png" />
          <h1>
            WELCOME TO <b>OMMITUS MANAGEMENT</b> THE BEST RMS PROVIDER IN INDIA...
          </h1>
          <p>this could be the start of something new...</p>
          <button>ABOUT US</button>
        </aside>
        <section className='reg-form-parent'>
          <img src="/ommitus-logo.png" className='reg-form-parent-img' />
          <h1>Register Your Restaurant With Us...</h1>
          <br />
          <RegisterComponent
            parentWidth={"65%"}
            parentHeight={"40vh"}
            url={"/restaurant/create-account"}
          />
          <p className='already-have-account'>Already have an account? <Link to={"/restaurant/login-account"}>Login</Link> </p>
          <br />
          <h2>OR</h2>
          <br />
          <BtnComponent
            backgroundColor={"#fff"}
            color={"#000"}
            text={"Need Any Help"}
            width={"65%"}
            border={"1px solid black"}
            fontSize={"18px"}
            letterSpacing={"3px"}
            borderRadius={"8px"}
          />
        </section>
      </main>
    </>
  )
}

export default RestaurantCreateAccount
