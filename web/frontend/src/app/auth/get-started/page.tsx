"use client";
{/*
  file path:  web/frontend/src/app/auth/get-started/page.tsx
  Note     :  this file has authentation logic for restaurant sign-up and login
  route    :  `/auth/get-started/`
 */}

import { useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { Input } from "@/components/UI/Restaurant/Input/Input";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false); // to toggle visibility of password
  const [isLogin, setIsLogin] = useState(false); // setting state to toggle login and sign-up function (when login is true, ownername and email is invisible )

  // referances for auto focus on pressing Enter, ArrowUp and ArrowDown
  const resRef = useRef<HTMLInputElement>(null);
  const ownerNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const actionBtndRef = useRef<HTMLButtonElement>(null); // create acount / login btn

  // input datas: this will store the values of input fields by handleOnChange function
  const [inputData, setInputData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    password: ""
  })

  // environment variables
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleSwitchMode = () => setIsLogin((prev) => !prev); // toggles sign-up and login

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loading = toast.loading(isLogin ? "Login account..." : "Creating account...");
    try {
      // LOGIN
      if (isLogin) {
        if (inputData.restaurantName.length <= 0 || inputData.password.length <= 0) {
          toast.error("Restaurant name and password required.");
          return;
        }

        const { data } = await axios.post(
          `${API_URL}/api/restaurant/login`,
          inputData,
          { headers: { "Content-Type": "application/json", "xkc": API_KEY! } } // xkc is the Backend API key (check .example.env)
        );
        //console.log(data);

        Cookies.set("token", data.data.token, { expires: 7 });
        Cookies.set("restaurantName", inputData.restaurantName, { expires: 7 });
        Cookies.set("restaurantId", data.data._id);

        toast.success("Login successful!");
        router.push(`/restaurant/${data.data._id}`);

      } else {
        // SIGNUP
        if (inputData.restaurantName.length <= 0 || inputData.email.length <= 0 || inputData.ownerName.length <= 0 || inputData.password.length <= 0) {
          toast.error("Please fill all required fields.");
          return;
        }

        const { data } = await axios.post(
          `${API_URL}/api/restaurant/create-account`,
          inputData,
          { headers: { "Content-Type": "application/json", "xkc": API_KEY! } }
        );
        //console.log(data);

        Cookies.set("token", data.data.token, { expires: 7 });
        Cookies.set("restaurantId", data.data._id, { expires: 7 });
        Cookies.set("restaurantName", inputData.restaurantName, { expires: 7 });

        toast.success("Account created successfully!");
        router.push(`/restaurant/${data.data._id}`);
      }
    } catch (err) {
      //console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Something went wrong.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      toast.dismiss(loading);
    }
  };


  // function that handles auto foucs of input fileds 
  const handleKeyDown = (
    nextRef: React.RefObject<HTMLInputElement | HTMLButtonElement | null>,
    prevRef: React.RefObject<HTMLInputElement | HTMLButtonElement | null>,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //console.log(event.key);

    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault()
      nextRef.current?.focus()
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      prevRef.current?.focus();
    };
  }

  return (
    <main className="flex h-[100dvh] w-[100vw] max-2xl:flex-col">
      {/* Left Aside */}
      <aside className="flex-1 bg-[var(--blue)] text-white flex flex-col justify-center items-center p-12 space-y-4 max-md:hidden">
        <img
          src="/logo/ommitus-main-menu.svg"
          alt="logo.svg"
          className=" w-[50%] max-w-[200px] max-lg:w-[120px]"
        />
        <h1 className="text-9xl font-extrabold tracking-wider text-[var(--white)] max-lg:text-6xl">
          OMMITUS
        </h1>
        <div className="flex flex-col">
          <p className="text-4xl italic m-0">
            The best RMS provider in India...
          </p>
        </div>
      </aside>

      {/* Right Form Section */}
      <div className=" w-full flex-2 flex flex-col justify-center items-center px-2 py-12 max-2xl:flex-5 max-2xl:justify-start max-2xl:py-0">
        <h1 className=" text-center text-4xl text-[var(--blue)] font-bold my-5 max-md:text-xl">
          {isLogin
            ? "Login Your Restaurant With "
            : "Register Your Restaurant With "}
          <b>Ommitus</b>
        </h1>

        <form
          className="bg-[var(--blue)] shadow-md rounded-xl p-10 space-y-6 w-[98%] max-w-[1000px] max-md:p-5 max-md:space-y-3"
          onSubmit={handleSubmit}
        >
          {/* Restaurant Name */}
          <Input
            type="text"
            label="Name of Restaurant"
            name="restaurantName"
            placeholder="Enter the name of your restaurant"
            ref={resRef}
            onKeyDown={(e) => handleKeyDown(ownerNameRef, actionBtndRef, e)}
            onChange={handleOnChange}
            inputValue={inputData.restaurantName}
          />
          {/* Owner Name */}
          {!isLogin && (
            <Input
              type="text"
              label="Owner Name"
              name="ownerName"
              ref={ownerNameRef}
              placeholder="Enter the name of restaurant owner"
              onKeyDown={(e) => handleKeyDown(emailRef, resRef, e)}
              onChange={handleOnChange}
              inputValue={inputData.ownerName}
            />
          )}

          {/* Email */}
          {!isLogin && (
            <Input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="Enter the email id"
              label="Email"
              onKeyDown={(e) => handleKeyDown(passwordRef, ownerNameRef, e)}
              onChange={handleOnChange}
              inputValue={inputData.email}
            />
          )}

          {/* Password */}
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            label="Password"
            ref={passwordRef}
            onChange={handleOnChange}
            onClick={handleTogglePassword}
            showPassword={showPassword}
            showForgotPasswordText={true}
            inputValue={inputData.password}
          />

          <br />

          {/* action button (Create account / login account) */}
          <button
            type="submit"
            className="bg-white w-full p-3 rounded-md opacity-70 hover:opacity-100  transition duration-300"
            ref={actionBtndRef}
            onKeyDown={(e) => {
              if (e.key == "ArrowUp") {
                e.preventDefault();
                passwordRef.current?.focus();
              };
              if (e.key == "ArrowDown") {
                e.preventDefault();
                resRef.current?.focus();
              }
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-1">
          {isLogin
            ? "Don't have an account?"
            : "Already have Account?"}{" "}
          <button
            className="text-[var(--red)] hover:underline opacity-70 hover:opacity-100 transition duration-300"
            onClick={handleSwitchMode}
          >
            {isLogin ? "Click here to Register" : "Click here to Login"}
          </button>
        </p>

        <button className="w-[96%] max-w-[1000px] p-4 rounded-2xl bg-[var(--blue)] text-white mt-10 text-2xl font-medium opacity-70 hover:opacity-100 transition duration-300">
          Watch a tutorial
        </button>
      </div>
    </main>
  );
}
