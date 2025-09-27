"use client";
{/* 
  file path    : web/frontend/src/app/restaurant/[id]/menu/page.tsx 
  Note         : this file has logic showing all dishes in the menu of specific restaurant. It get's restaurantId from cookie. APIs called : http://localhost:3000/all?available=true&category=<category>
  route        : /restaurant/:id/menu 
*/ }

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Dish from "@/components/UI/DishCart/DishCart.component";
import DishCartSkeleton from "@/components/UI/DishCart/DishCartSkeleton.component";
import CategorySidebar from "@/components/UI/CategorySidebar/CategorySidebar.component";
import { useParams } from "next/navigation";
import { useDropdown } from "@/store/Store";
import { DropdownStateTypes } from "@/types/Store.types";
import DishTypes from "@/types/Dish.types";

// API keys
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Page = () => {
  const { restaurantName, restaurantId } = useParams();
  const isDropdownVisible = useDropdown((state: DropdownStateTypes) => state.dropdown);
  const hideDropdown = useDropdown((state: DropdownStateTypes) => state.hideDropdown);

  const [initalLoad, setInitialLoad] = useState(false); // this stores the initaal loading state, when menu and category is loaded it becomes false; (5th useEffect)

  const [allDish, setAllDish] = useState<DishTypes[]>([]); // this will store arrays of Dish object;
  const [filterDishes, setFilterDishes] = useState<DishTypes[]>([]); // this will store arrays of Dish object from allDish list with filter property;
  const [categories, setCategories] = useState<string[]>(["All"]); // this will store all categories of restaurant

  const [loading, setLoading] = useState(false); // skeleton trigger

  // All Functions
  // 1.function to fetch all dishes from server
  const fetchAllDish = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/api/menu/all?available=true`,
        {
          headers: {
            xkc: API_KEY!,
            xrid: restaurantId!,
          },
        }
      );
      const newDishes = data.data;
      console.log(newDishes);

      setAllDish(prev => [...prev, ...newDishes]);

    } catch {
      toast.error("Failed to fetch dishes");
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
            xkc: API_KEY!,
          },
        }
      );
      const data = res.data;
      //console.log(data.categories);
      setCategories(prev => [...prev, ...data.categories]);
    } catch (error) {
      toast.error("Failed to load categories");
      console.error("Category Fetch error:", error);
    }
  };

  // 5. function to filter dishes according to category
  const handleCategoryFilter = (category: string) => {
    setLoading(true);
    setFilterDishes([]);
    setTimeout(() => {
      if (category === "All") {
        setFilterDishes(allDish); // show everything
      } else {
        const filtered = allDish.filter(dish => dish.category?.toLowerCase() === category.toLowerCase().trim());
        setFilterDishes(filtered);
      };
      setLoading(false);
      hideDropdown();
    }, 1200);
  };


  // renders
  // 1. fetch initial dishes and all categories
  useEffect(() => {
    if (!restaurantId) return;
    fetchAllDish();
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
          showFilterCategories={false}
          visibleDropdown={isDropdownVisible}
          restaurantId={`${restaurantId}`}
          OnClickCategoryBtn={handleCategoryFilter}
          onClickFilterBtn={() => { }}
        />

        {/* Main section */}
        <section className={`h-full  w-full overflow-y-auto scrollbar ${isDropdownVisible ? "blur-xs" : "blur-none"}`} onClick={() => hideDropdown()}>
          {initalLoad ?
            <>
              {/*  Menu section*/}
              <div className="flex justify-center w-[97%] max-w-[1200px] mx-[auto] my-0">
                <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full pt-2">
                  {/* Menu */}
                  {filterDishes.map((dish, idx) => (
                    <Dish
                      key={idx}
                      idx={idx}
                      allDishes={filterDishes}
                      redirectUrl={`customer/${restaurantName}/${restaurantId}/menu`}
                      dish={dish}
                    />
                  ))}

                  {/* Skeletons while loading */}
                  {loading && <DishCartSkeleton length={7} />}
                </div>
              </div>
            </> :
            <>
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
