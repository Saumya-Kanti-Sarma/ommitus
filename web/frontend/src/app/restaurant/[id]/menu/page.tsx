"use client";
{/* 
  file path    : web/frontend/src/app/restaurant/[id]/menu/page.tsx 
  Note         : this file has logic showing all dishes in the menu of specific restaurant. It get's restaurantId from cookie. APIs called : http://localhost:3000/all?available=<available>&category=<category>&page=1&limit=25 
  route        : /restaurant/:id/menu 
*/ }

{/* 
  This is the dish object
    "createdAt":1756094176985, 
    "_id":"68abde7971398e37877b195f", 
    "dishName":"Aloo Frankie", 
    "category":"rolls", 
    "veg":true, 
    "fullPlate":100, 
    "halfPlate":null, 
    "available":true, 
    "image":["https://azjgnoxfyygbnquzecyw.supabase.co/storage/v1/object/public/ommitus/menu/Aloo%20Frankie.webp"] 
*/ }
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { all } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

interface Dish {
  createdAt: number;
  _id: string;
  dishName: string;
  category: string;
  veg: boolean;
  fullPlate: number | null;
  halfPlate: number | null;
  available: boolean;
  image: string[];
}

// API keys
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Page = () => {
  const [allDish, setAllDish] = useState<Dish[]>([]); // this will store arrays of Dish object;
  const [categories, setCategories] = useState<string[]>(["All"]); // this will store all categories of restaurant
  const [activeBtnClass, setActiveBtnClass] = useState(0); // this will toggle the styles for active category btn

  const [visibleDropdown, setVisibleDropdown] = useState(false); // this will toggle the visibility of category menu (which is only visible for max-lg screens. When true ? 0% left : -100% left)
  const handleVisibleDropdown = () => setVisibleDropdown(prev => !prev);

  // Cookies
  const restaurantId = Cookies.get("restaurantId");

  const fetchAllDish = async (page = "1", limit = "10") => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/menu/all?&page=${page}&limit=${limit}`,
        {
          headers: {
            xkc: API_KEY!,
            xrid: restaurantId!,
          },
        }
      );

      console.log(data);
      setAllDish(data.data);
    } catch (error) {
      toast.error("Failed to fetch dishes");
      console.error("Menu Fetch error:", error);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchAllDish();
      async function fetchCategories() {
        try {
          const res = await axios.get(
            `${API_URL}/api/restaurant/get-all-categories/${restaurantId}`,
            {
              headers: {
                "Content-Type": "application/json",
                xkc: API_KEY!,
              },
            }
          );
          const data = res.data;
          console.log(data.categories);
          setCategories(prev => [...prev, ...data.categories]);
        } catch (error) {
          toast.error("Failed to load categories");
          console.error("Category Fetch error:", error);
        }
      };
      fetchCategories();
    }
  }, [restaurantId]);

  useEffect(() => {
    console.log(visibleDropdown);
  }, [visibleDropdown])

  return (
    <>
      <main className={`flex w-full h-[calc(100vh-70px)] overflow-hidden items-start relative max-lg:h-[calc(100vh-60px)]`}>

        <aside
          className={`
    w-[300px] min-h-screen bg-[var(--dark-blue)] text-white p-5 shadow-md transition-all duration-300 ease-in-out z-50
    max-lg:absolute max-lg:top-0
    ${visibleDropdown ? "max-lg:left-0" : "max-lg:-left-full"}
  `}
        >
          <h1 className="text-xl font-bold mb-6 border-b border-white/30 pb-2">
            All Categories
          </h1>
          <ul className="space-y-3">
            {categories.map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${index === activeBtnClass
                    ? "bg-[var(--green)] text-white shadow-md"
                    : "hover:bg-[var(--blue)] hover:text-white"
                    }`}
                  onClick={() => setActiveBtnClass(index)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={`h-full  w-full overflow-y-auto scrollbar ${visibleDropdown ? "blur-xs" : "blur-none"}`} onClick={() => setVisibleDropdown(prev => prev == true ? false : false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="sticky top-0 z-50 bg-white/10 backdrop-blur-xs flex items-center w-[97%] max-w-[1200px] mx-auto my-0 overflow-hidden">
            <button
              onClick={handleVisibleDropdown}
              className="hidden max-lg:block bg-[var(--dark-blue)] font-black text-white p-3 rounded-[8px]  cursor-pointer transition duration-180 opacity-90 hover:scale-110 hover:opacity-100 hover:rounded-xl text-nowrap">
              {"<<"}
            </button>
            <div
              className="flex  gap-5 p-4 w-full mx-auto my-0 overflow-hidden overflow-x-auto hideScrollbar">

              {categories.length > 1 ? (
                ["All Dishes", "Available Dishes", "Un-available Dishes"].map((item, index) => (
                  <button
                    className={`px-4 py-2 rounded-xl ${index === activeBtnClass
                      ? "bg-[var(--green)] scale-108 shadow-md opacity-100"
                      : "bg-[var(--blue)]"
                      } text-[var(--white)] font-medium shadow-sm transition duration-200 ease-in-out hover:opacity-100 hover:scale-105 opacity-75 text-nowrap`}
                    onClick={() => {
                      setActiveBtnClass(index);
                    }}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex justify-center w-[97%] max-w-[1200px] mx-[auto] my-0">
            <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full">
              {allDish.length <= 0
                ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[var(--white)] rounded-xl shadow-md overflow-hidden max-w-[320px] w-full animate-pulse max-md:mx-auto max-md:my-0"
                  >
                    {/* Image skeleton */}
                    <div className="w-full h-40 bg-[var(--light-gray)]" />

                    {/* Info skeleton */}
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-[var(--light-gray)] rounded" />
                        <div className="w-3 h-3 bg-[var(--light-gray)] rounded-full" />
                      </div>
                      <div className="h-3 w-20 bg-[var(--light-gray)] rounded" />
                      <div className="flex gap-4">
                        <div className="h-3 w-16 bg-[var(--light-gray)] rounded" />
                        <div className="h-3 w-16 bg-[var(--light-gray)] rounded" />
                      </div>
                    </div>
                  </div>
                ))
                : allDish.map((dish) => (
                  <Link
                    key={dish._id}
                    href={"#"}
                    className="bg-[var(--white)] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-200 max-w-[320px] max-md:w-[300px] max-md:mx-auto max-md:my-0 hover:scale-101"
                  >
                    {/* Image */}
                    <img
                      src={dish.image[0]}
                      alt={dish.dishName}
                      className="w-full h-40 object-cover"
                    />

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-[var(--black)]">
                          {dish.dishName}
                        </p>
                        <span
                          className={`w-3 h-3 rounded-full ${dish.veg ? "bg-[var(--green)]" : "bg-[var(--red)]"
                            }`}
                        />
                      </div>

                      {/* Availability */}
                      <p
                        className={`text-sm font-medium ${dish.available ? "text-[var(--green)]" : "text-[var(--red)]"
                          }`}
                      >
                        {dish.available ? "Available" : "Unavailable"}
                      </p>

                      {/* Prices */}
                      <div className="flex gap-4 text-sm text-[var(--dark-blue)]">
                        {dish.fullPlate && (
                          <p className="font-medium">Full: ₹{dish.fullPlate}</p>
                        )}
                        {dish.halfPlate && (
                          <p className="font-medium">Half: ₹{dish.halfPlate}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>


    </>
  );
};

export default Page;
