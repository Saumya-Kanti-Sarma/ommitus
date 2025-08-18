"use client";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

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

  // environment variables
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleSwitchMode = () => setIsLogin((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const restaurantName = (form.elements.namedItem("restaurantName") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_");
    const ownerName = (form.elements.namedItem("ownerName") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_");
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value.trim().replace(/\s+/g, "_");


    const loading = toast.loading(isLogin ? "Login account..." : "Creating account...");
    try {
      if (isLogin) {
        // LOGIN
        if (!restaurantName || !password) {

          toast.error("Restaurant name and password required.");
          return;
        }

        const { data } = await axios.post(
          `${API_URL}/api/restaurant/login`,
          { restaurantName, password },
          { headers: { "Content-Type": "application/json", "xkc": API_KEY! } }
        );
        console.log(data);

        Cookies.set("token", data.data.token, { expires: 7 });
        Cookies.set("restaurantId", data.data._id);


        toast.success("Login successful!");
        router.push(`/restaurant/${data.data._id}`);

      } else {
        // SIGNUP
        if (!restaurantName || !ownerName || !email || !password) {
          toast.error("Please fill all required fields.");
          return;
        }

        const { data } = await axios.post(
          `${API_URL}/api/restaurant/create-account`,
          { restaurantName, ownerName, email, password },
          { headers: { "Content-Type": "application/json", "xkc": API_KEY! } }
        );

        console.log(data);

        Cookies.set("token", data.data.token, { expires: 7 });
        Cookies.set("restaurantId", data.data._id);

        toast.success("Account created successfully!");
        router.push(`/restaurant/${data.data._id}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong. Try again later.");
    } finally {
      toast.dismiss(loading)
    }
  };


  // function that handles auto foucs of input fileds 
  const handleKeyDown = (
    nextRef: React.RefObject<HTMLInputElement | HTMLButtonElement | null>,
    prevRef: React.RefObject<HTMLInputElement | HTMLButtonElement | null>,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // console.log(event.key);

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
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">
              Name of restaurant
            </label>
            <input
              type="text"
              name="restaurantName"
              placeholder="Enter the name of your restaurant"
              className="w-full border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              ref={resRef}
              onKeyDown={(e) => handleKeyDown(ownerNameRef, actionBtndRef, e)}
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
                ref={ownerNameRef}
                placeholder="Enter the name of restaurant owner"
                className="w-full border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                onKeyDown={(e) => handleKeyDown(emailRef, resRef, e)}
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
                  ref={emailRef}
                  placeholder="Enter the email id"
                  className="flex-1 border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                  onKeyDown={(e) => handleKeyDown(passwordRef, ownerNameRef, e)}
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
                ref={passwordRef}
                placeholder="•••••"
                className="flex-1 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                onKeyDown={(e) => handleKeyDown(actionBtndRef, emailRef, e)}
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
