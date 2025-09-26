"use client";
{/* 
  file path    : web/frontend/src/app/restaurant/[id]/menu/page.tsx 
  route        : /restaurant/:id/menu 
  Note         : This file has logic showing all dishes in the menu of specific restaurant.
                 It get's restaurantId from cookie.
                 APIs called : 
                    1. http://localhost:3000/all?available=<available>&category=<category>&page=1&limit=25 (fetching all dishes)
                    2. http://localhost:3000/api/restaurant/get-all-categories/${restaurantId} (fetching all categories)
                    3. 
*/ }

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Dish from "@/components/UI/DishCart/DishCart.component";
import DishCartSkeleton from "@/components/UI/DishCart/DishCartSkeleton.component";
import CategorySidebar from "@/components/UI/CategorySidebar/CategorySidebar.component";
import DishTypes from "@/types/Dish.types";


// API keys
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Page = () => {
  const restaurantId = Cookies.get("restaurantId");// Cookies
  const [initalLoad, setInitialLoad] = useState(false); // this stores the inital loading state, when menu and category is loaded it becomes false; (5th useEffect)
  const [allDish, setAllDish] = useState<DishTypes[]>([]); // this will store arrays of Dish object;
  const [filterDishes, setFilterDishes] = useState<DishTypes[]>([]); // this will store arrays of Dish object from allDish list with filter property;
  const [categories, setCategories] = useState<string[]>(["All"]); // this will store all categories of restaurant
  const [visibleDropdown, setVisibleDropdown] = useState(false); // this will toggle the visibility of category menu (which is only visible for max-lg screens. When true ? 0% left : -100% left)

  const [loading, setLoading] = useState(false); // skeleton trigger

  // All Functions
  // 1.function to fetch dishes from server at the limit of 12 dishes per fetch. 
  const fetchDishes = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      let apiURL: string = `${API_URL}/api/menu/all`;
      const { data } = await axios.get(
        apiURL,
        {
          headers: {
            xkc: API_KEY!,
            xrid: restaurantId!,
          },
        }
      );
      const newDishes: DishTypes[] = data.data;
      console.log(data.data);

      setAllDish(prev => [...prev, ...newDishes]);
    } catch (error) {
      toast.error("Failed to fetch dishes");
      if (process.env.NEXT_PUBLIC_SERVER_TYPE === "development") {
        console.log(error);
      };
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  // 2. function to fetch all Categories of the restaurant from server
  const fetchCategories = async () => {
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

      if (process.env.NEXT_PUBLIC_SERVER_TYPE === "development") {
        console.log(data.categories);
      };
      setCategories(prev => [...prev, ...data.categories]);
    } catch (error) {
      toast.error("Failed to load categories");
      if (process.env.NEXT_PUBLIC_SERVER_TYPE === "development") {
        console.error("Category Fetch error:", error);
      };
    }
  };

  // 3. function to toggle visibility of sidebar for max-lg
  const handleVisibleDropdown = () => setVisibleDropdown(prev => !prev);

  // 4. function to handle input change in the search bar (as the user starts typing, dish automatically starts to appear)
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();

    if (value === "") {
      // Reset to show everything again
      setFilterDishes(allDish);
      return;
    }

    setLoading(true);
    let combinedResults: DishTypes[] = [];
    let searchPage = 1;
    let found = false;
    let keepFetching = true;

    try {
      while (keepFetching) {
        const { data } = await axios.get(
          `${API_URL}/api/menu/all?page=${searchPage}&limit=12`,
          {
            headers: {
              xkc: API_KEY!,
              xrid: restaurantId!,
            },
          }
        );

        const newDishes: DishTypes[] = data.data;
        if (newDishes.length === 0) {
          keepFetching = false; // no more dishes
          break;
        }

        combinedResults = [...combinedResults, ...newDishes];

        const filtered = combinedResults.filter(dish =>
          dish?.dishName?.toLowerCase().includes(value)
        );

        if (filtered.length > 0) {
          setFilterDishes(filtered);
          found = true;
          keepFetching = false; // stop once we found matches
        } else {
          searchPage++;
        }
      }

      if (!found) {
        setFilterDishes([]); // nothing matched
        toast.error("No dishes found");
      }
    } catch (error) {
      toast.error("Failed while searching");
    } finally {
      setLoading(false);
    }
  };

  // 5. function to handle filteration of dishes according to category
  const handleCategoryChange = (category: string) => {
    setLoading(true);
    setFilterDishes([]);
    setTimeout(() => {
      setLoading(false);
      let arr: DishTypes[] = [];
      allDish.filter((item) => {
        if (item.category?.toLowerCase() === category.toLowerCase()) {
          arr.push(item);
          setFilterDishes(arr);
          console.log(arr);
        };
        if (category === "All") {
          setFilterDishes(allDish);
          console.log(allDish);
        };
      });

    }, 1200);
  }

  // 5. function to handle filteration of dishes according to category
  const handleAvailabilityChange = (available: boolean) => {
    setLoading(true);
    setFilterDishes([]);

    setTimeout(() => {
      setLoading(false);
      let arr: DishTypes[] = [];
      allDish.filter((item) => {
        if (item.available === available) {
          arr.push(item);
          setFilterDishes(arr);
          console.log(arr);
        };
      });

    }, 1200);
  }

  // renders
  // 1. fetch initial dishes and all categories
  useEffect(() => {
    if (!restaurantId) return;
    fetchDishes();
    fetchCategories();
  }, [restaurantId]);


  //2. setInital loading false when menu and categories are loaded
  useEffect(() => {
    if (allDish.length > 0 && categories.length > 0) {
      setFilterDishes(allDish);
      setInitialLoad(true);
    }
  }, [allDish]);

  return (
    <>
      <main className={`flex w-full h-[calc(100vh-70px)] overflow-hidden items-start relative max-md:h-[calc(100vh-60px)]`}>
        {/* All categories and filters side bar */}
        <CategorySidebar
          showFilterCategories={true}
          visibleDropdown={visibleDropdown}
          restaurantId={`${restaurantId}`}
          OnClickCategoryBtn={handleCategoryChange}
          onClickFilterBtn={handleAvailabilityChange}
        />

        {/* Main section */}
        <section className={`h-full  w-full overflow-y-auto scrollbar ${visibleDropdown ? "blur-xs" : "blur-none"}`} onClick={() => setVisibleDropdown(prev => prev == true ? false : false)}>
          {initalLoad ?
            <>
              {/* Search box */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="sticky top-0 z-50 bg-white/10 backdrop-blur-xs flex items-center w-[97%] max-w-[1200px] mx-auto my-0  overflow-hidden">
                <button
                  onClick={handleVisibleDropdown}
                  className="hidden max-lg:block bg-[var(--dark-blue)] font-black text-white p-3 rounded-[8px]  cursor-pointer transition duration-180 opacity-90 hover:scale-110 hover:opacity-100 hover:rounded-xl text-nowrap mr-2">
                  {"<<"}
                </button>
                <input
                  onChange={handleInputChange}
                  type="text" name="search-box" id="menu-search-box" placeholder="Search Dish name"
                  className="p-2 w-full m-4 mx-0 border-1 border-[var(--dark-blue)] border-solid rounded-2xl" />
              </div>

              {/*  Menu section*/}
              <div className="flex justify-center w-[97%] max-w-[1200px] mx-[auto] my-0">
                <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full">
                  {/* Menu */}
                  {filterDishes.map((dish, idx) => (
                    <Dish
                      key={idx}
                      idx={idx}
                      allDishes={filterDishes}
                      redirectUrl={decodeURIComponent(`restaurant/${restaurantId}/menu`)}
                      dish={dish}
                    />
                  ))}

                  {/* Skeletons while loading */}
                  {loading && <DishCartSkeleton length={7} />}
                </div>
              </div>
            </> :
            <>
              <div className="w-[97%] max-w-[1080px] h-15 mx-auto my-5 bg-[var(--light-gray)] rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-[97%] max-w-[1080px] mx-auto">
                <DishCartSkeleton length={14} />
              </div>

            </>
          }
        </section>
      </main>


    </>
  );
};

export default Page;

// 1. implement infinite scrolling for allDish.
{/*
  1. fetch 12 dishes initially and give an id named "last-dish" to the 12th dish
  2. when the last dish is visible on screen, then show skeletom loaders and fetch 12 more dishes untill anymore dish is available.
  3. How will you know that anymore dish is available or not?
     Well for that we'll provide a backend logic to that returns null of no more dishes are available.
     When we encounter null then we stop fetchiing any more items
  */}

// implement infinnite scrolling for different category
{/*
  Do the same as allDish
  */}