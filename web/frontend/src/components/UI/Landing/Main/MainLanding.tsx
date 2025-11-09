"use client";
import "./MainLanding.css";

const MainLanding = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-7xl h-[calc(100vh-70px)] flex flex-col justify-center items-center gap-0 ">
        <div className="dotted-div">
          <h1 className="text-4xl font-bold w-fit">
            We provide{" "}
            <h1 className="font-black digital-smart">
              Digitally Smart Menu
            </h1>{" "}
            for your restaurant
          </h1>
        </div>
        {/* <p> Let the experience thrive with our digital menu that can be shared on google reviews, social medias, posters, banners anywhere any place...</p> */}
      </div>
    </div>
  )
}

export default MainLanding
