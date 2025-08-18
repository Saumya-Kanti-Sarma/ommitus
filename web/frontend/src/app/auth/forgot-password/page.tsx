"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !newPassword) {
      toast.error("All fields are required!");
      return;
    }

    const loading = toast.loading("Updating password...");
    try {
      const { data } = await axios.put(
        `${API_URL}/api/restaurant/forgot-password`,
        { email, password, newPassword },
        { headers: { "Content-Type": "application/json", "xkc": API_KEY! } }
      );
      console.log(data);

      toast.success(data.message || "Password updated successfully!");
      setEmail("");
      setPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      toast.dismiss(loading);
    }
  };
  const isDisabled = !email || !password || !newPassword;
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-md border focus:outline-none text-white focus:ring-2 focus:ring-[var(--white)] focus:border-none bg-transparent"
        />

        {/* Current Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
