"use client";
import { useState } from "react";
import Cookies from "js-cookie"; // Install: npm install js-cookie
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const router = useRouter();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleSwitchMode = () => setIsLogin((prev) => !prev);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const restaurantName = (form.elements.namedItem("restaurantName") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_")
    const ownerName = (form.elements.namedItem("ownerName") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_");
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_");
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_");

    // Validation
    if (!restaurantName || (!isLogin && (!ownerName || !email)) || !password) {
      alert("Please fill all required fields.");
      return;
    }

    // Save data as cookies (you can encrypt if needed)
    Cookies.set("restaurantName", restaurantName);
    if (!isLogin) {
      Cookies.set("ownerName", ownerName);
      Cookies.set("email", email);
    }
    Cookies.set("password", password);

    // Redirect
    router.push("/auth/otp");
  };

  return (
    <main className="flex h-[100dvh] w-[100vw] max-2xl:flex-col">
      {/* Left Aside */}
      <aside className="flex-1 bg-[var(--blue)] text-white flex flex-col justify-center items-center p-12 space-y-4 max-md:hidden">
        <img
          src="/logo/ommitus-main-menu.svg"
          alt="logo.svg"
          className=" w-[50%] max-w-[200px] "
        />
        <h1 className="text-9xl font-extrabold tracking-wider text-[var(--white)]">
          OMMITUS
        </h1>
        <div className="flex flex-col">
          <h3 className="text-4xl font-semibold m-0">
            WELCOME TO <b>OMMITUS MANAGEMENT</b>
          </h3>
          <p className="text-4xl italic m-0">
            The best RMS provider in India...
          </p>
        </div>
      </aside>

      {/* Right Form Section */}
      <div className=" w-full flex-1 flex flex-col justify-center items-center px-2 py-12 max-2xl:flex-5 max-2xl:justify-start max-2xl:py-0">
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
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">
              Name of restaurant
            </label>
            <input
              type="text"
              name="restaurantName"
              placeholder="Enter the name of your restaurant"
              className="w-full border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            />
          </div>

          {/* Owner Name */}
          {!isLogin && (
            <div>
              <label className="block mb-2 font-semibold text-[var(--white)]">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                placeholder="Enter the name of restaurant owner"
                className="w-full border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
            </div>
          )}

          {/* Email */}
          {!isLogin && (
            <div>
              <label className="block mb-2 font-semibold text-[var(--white)]">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter the email id"
                  className="flex-1 border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">
              Password
            </label>
            <div className="flex items-center border border-[var(--gray)] rounded-md bg-white">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="•••••"
                className="flex-1 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
              <button
                type="button"
                className="p-2 cursor-pointer"
                onClick={handleTogglePassword}
              >
                <img
                  src={
                    showPassword
                      ? "/icons/eye.svg"
                      : "/icons/close-eye.svg"
                  }
                  alt="password-icon"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          <br />
          <button type="submit" className="bg-white w-full p-3 rounded-md">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-1">
          {isLogin
            ? "Don't have an account?"
            : "Already have Account?"}{" "}
          <button
            className="text-[var(--red)]"
            onClick={handleSwitchMode}
          >
            {isLogin ? "Click here to Register" : "Click here to Login"}
          </button>
        </p>

        <button className="w-[96%] max-w-[1000px] p-4 rounded-2xl bg-[var(--blue)] text-white mt-10 text-2xl font-medium">
          Watch a tutorial
        </button>
      </div>
    </main>
  );
}
