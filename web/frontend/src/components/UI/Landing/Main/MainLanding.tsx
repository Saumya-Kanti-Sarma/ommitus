"use client";
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
    </>
  )
}

export default MainLanding
