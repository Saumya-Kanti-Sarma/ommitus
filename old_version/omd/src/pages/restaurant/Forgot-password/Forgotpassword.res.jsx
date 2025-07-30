import React from 'react'
import RegisterComponent from '../../../components/register/Register.comp'
import BtnComponent from '../../../components/Btns/Btn.comp'
import { Link } from 'react-router-dom'

const Forgotpassword = () => {
  return (
    <>
      <head>
        <title>
          Ommitus | Reset Password
        </title>
      </head>
      <main className='main-registration-area'>

        <section className='reg-form-parent' style={{ maxWidth: '900px' }}>
          <h1>Reset Password</h1>
          <br />
          <RegisterComponent
            displayOwnerName={"none"}
            parentWidth={"65%"}
            parentHeight={"40vh"}
            btnTxt={"Sign-In"}
            url={"/restaurant/forgot-password"}
            PasswordTxt={"Enter New Password: "}
          />
          <p className='already-have-account'>Login back? <Link to={"/restaurant/login-account"}>Click Here</Link> </p>
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

export default Forgotpassword
