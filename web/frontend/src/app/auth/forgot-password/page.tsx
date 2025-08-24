"use client";
{/*
  file path:  web/frontend/src/app/auth/forgot-password/page.tsx
  Note     :  this file has authentation logic for changing password
  route    :  `/auth/forgot-password`
 */}

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  // toggling input type of password 
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  //API keys (check .example.env)
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  // input datas: this will store the values of input fields by handleOnChange function
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
    newPassword: "",
  })

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

    if (inputData.email.length <= 0 || inputData.password.length <= 0 || inputData.newPassword.length <= 0) {
      toast.error("All fields are required!");
      return;
    }

    const loading = toast.loading("Updating password...");
    try {
      const { data } = await axios.put(
        `${API_URL}/api/restaurant/forgot-password`,
        inputData,
        { headers: { "Content-Type": "application/json", "xkc": API_KEY! } }
      );

      //console.log(data);
      toast.success(data.message || "Password updated successfully!");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      toast.dismiss(loading);
    }
  };
  // stays false untill all fileds habe value >0
  const isDisabled = inputData.email.length <= 0 || inputData.password.length <= 0 || inputData.newPassword.length <= 0;

  return (
    <div className="flex flex-col h-screen w-full justify-center items-center bg-[var(--white)]">
      <h1 className="text-8xl font-bold text-[var(--blue)] mb-2 max-md:text-5xl">OMMITUS</h1>
      <h1 className="mb-4 text-xl font-semibold text-[var(--blue)]">
        Change password of your Restaurant
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--blue)] p-8 rounded-2xl shadow-lg w-[95%] max-w-[500px] flex flex-col gap-4 "
      >
        <h1 className="text-2xl font-bold text-[var(--white)] text-center">
          Forgot Password
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleOnChange}
          className="p-2 rounded-md border focus:outline-none text-white focus:ring-2 focus:ring-[var(--white)] focus:border-none bg-transparent"
        />

        {/* Current Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Current Password"
            name="password"
            onChange={handleOnChange}
            className="w-full p-2 rounded-md border focus:outline-none text-white focus:ring-2 focus:ring-[var(--white)] focus:border-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              src={showPassword ? "/icons/eye.svg" : "/icons/close-eye.svg"}
              alt="password-icon"
              className="w-5 h-5 invert"
            />
          </button>
        </div>

        {/* New Password with toggle */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            name="newPassword"
            onChange={handleOnChange}
            className="w-full p-2 rounded-md border focus:outline-none text-white focus:ring-2 focus:ring-[var(--white)] focus:border-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              src={showNewPassword ? "/icons/eye.svg" : "/icons/close-eye.svg"}
              alt="password-icon"
              className="w-5 h-5 invert"
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`bg-[var(--red)] text-[var(--white)] py-2 rounded-md font-semibold transition opacity-70 hover:opacity-100 ease-in-out duration-200 ${isDisabled ? 'opacity-70' : 'opacity-90'}`}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
