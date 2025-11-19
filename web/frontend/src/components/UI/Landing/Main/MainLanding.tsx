"use client";
import Link from "next/link";
import GetStartedBtn from "../GetstartedBtn/GetStarted.component";
import "./MainLanding.css";

const MainLanding = () => {
  return (
    <>
      <div className=" flex justify-center items-center w-full  h-[calc(100vh-70px)] landing01">

        <div className="  w-full max-w-7xl h-[calc(100vh-70px)] flex flex-col justify-center items-center gap-0 ">
          <div className="dotted-div flex-col">
            <img src="/logo/ommitus-logo.svg" alt="ommitus-logo" className="w-[200px] max-md:w-[150px] max-sm:w-[100px]" />
            <h1 className="text-8xl font-black max-md:text-6xl max-sm:text-4xl">OMMITUS</h1>
          </div>
          <div className="dotted-div">
            <h1 className="text-4xl font-bold w-fit text-center max-md:text-2xl max-sm:text-xl">
              We provide{" "}
              <span className="font-black digital-smart">
                Digitally Smart Menu
              </span>{" "}
              for your restaurant
            </h1>
          </div>
          <p className="text-2xl max-w-4xl text-center max-md:text-m max-sm:text-[14px] max-sm:max-w-[380px]"> Let the experience thrive with our digital menu that can be shared on google reviews, social medias, posters, banners anywhere any place...</p>
          <div className="flex flex-col sm:flex-row items-center justify-center  mt-6  w-full max-w-3xl max-md:justify-center max-md:gap-5">
            <GetStartedBtn fontSize="30px" borderRadius="10px" width="300px" />
          </div>
        </div>

      </div>
      <div className="flex justify-center items-center h-[calc(100vh-70px)] w-full landing01 hideScrollbar">

        <div className=" shadow-2xl rounded-3xl p-10 w-full flex flex-col items-center text-center gap-8 backdrop-blur-sm">

          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Try Our Demo Menu
          </h1>

          <p className="text-lg text-white">
            Scan the QR code below and explore the experience instantly.
          </p>

          <div className="p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
            <img
              src="/demo-menu.png"
              alt="demo menu qr"
              className="object-contain"
            />
          </div>

          <Link
            href={""}
            target="blank"
            className="text-lg font-semibold text-blue-700 hover:text-blue-900 underline decoration-2 underline-offset-4 transition-all"
          >
            Or click here to open the demo
          </Link>

        </div>

      </div>


    </>
  )
}

export default MainLanding
