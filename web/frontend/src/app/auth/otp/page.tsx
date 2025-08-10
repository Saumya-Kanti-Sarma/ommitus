"use client";
import { useState } from "react";
import OTPInput from "react-otp-input";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Page = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  interface cookietypes {
    restaurantName: string,
    ownerName: string,
    email: string,
    password: string,
  }
  const cookieData: Partial<cookietypes> = {
    restaurantName: Cookies.get("restaurantName")?.replace(/__#\$%__/g, " "),
    ownerName: Cookies.get("ownerName")?.replace(/__#\$%__/g, " "),
    email: Cookies.get("email")?.replace(/__#\$%__/g, " "),
    password: Cookies.get("password")?.replace(/__#\$%__/g, " "),
  };


  const handleVerify = () => {
    if (otp === "2025") {
      console.log(cookieData);
      Cookies.remove("restaurantName");
      Cookies.remove("ownerName");
      Cookies.remove("email");
      Cookies.remove("password");
      router.push("/restaurant");

    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-[100dvh] text-[var(--white)] px-4">
      <h1 className="text-2xl font-bold text-[var(--blue)] mb-1">
        We have sent a 4-digit OTP to
      </h1>
      <div className="bg-[var(--blue)] text-[var(--black)] shadow-lg rounded-xl p-8 w-full max-w-md text-center space-y-6">
        <p className="text-lg font-medium text-[var(--white)]">{cookieData.email}</p>

        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span className="mx-2">{" "}</span>}
          renderInput={(props) => (
            <input
              {...props}
              className="min-w-15 h-15 text-center text-xl font-bold border-2 border-[var(--white)] text-white rounded-lg focus:outline-[var(--green)] focus:ring-2"
            />
          )}
          containerStyle="flex justify-center gap-3"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-[var(--white)] text-[var(--blue)] py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all cursor-pointer"
        >
          Verify OTP
        </button>
      </div>
    </main>
  );
};

export default Page;
