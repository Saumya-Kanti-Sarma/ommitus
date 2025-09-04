"use client";
{/* 
  file path    : web/frontend/src/app/restaurant/[id]/menu/page.tsx 
  Note         : this file has logic showing all dishes in the menu of specific restaurant. It get's restaurantId from cookie. APIs called : http://localhost:3000/all?available=<available>&category=<category>&page=1&limit=25 
  route        : /restaurant/:id/menu 
*/ }

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Dish from "@/components/UI/DishCart/DishCart.component";
import DishCartSkeleton from "@/components/UI/DishCart/DishCartSkeleton.component";
import CategorySidebar from "@/components/UI/CategorySidebar/CategorySidebar.component";
import { useParams } from "next/navigation";
import { useDropdown } from "@/store/Store";
import { DropdownStateTypes } from "@/types/Store.types";

interface Dish {
  createdAt: number; // Date.now()
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
  const { restaurantId } = useParams();
  const isDropdownVisible = useDropdown((state: DropdownStateTypes) => state.dropdown);
  const hideDropdown = useDropdown((state: DropdownStateTypes) => state.hideDropdown);

  const [initalLoad, setInitialLoad] = useState(false); // this stores the initaal loading state, when menu and category is loaded it becomes false; (5th useEffect)

  const [allDish, setAllDish] = useState<Dish[]>([]); // this will store arrays of Dish object;
  const [filterDishes, setFilterDishes] = useState<Dish[]>([]); // this will store arrays of Dish object from allDish list with filter property;
  const [categories, setCategories] = useState<string[]>(["All"]); // this will store all categories of restaurant
  const [activeBtnClass, setActiveBtnClass] = useState(0); // this will toggle the styles for active category btn

  const [visibleDropdown, setVisibleDropdown] = useState(false); // this will toggle the visibility of category menu (which is only visible for max-lg screens. When true ? 0% left : -100% left)

  const [page, setPage] = useState(1); // track current page
  const [loading, setLoading] = useState(false); // skeleton trigger
  const [hasMore, setHasMore] = useState(true); // stop when no more dishes

  // All Functions
  // 1.function to fetch all dishes from server
  const fetchAllDish = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/api/menu/all?page=${page}&limit=${limit}`,
        {
          headers: {
            xkc: API_KEY!,
            xrid: restaurantId!,
          },
        }
      );
      const newDishes: Dish[] = data.data;

      if (newDishes.length === 0) {
        setHasMore(false);
        return "end of dishes";

      } else {
        setAllDish(prev => [...prev, ...newDishes]);
        //console.log(newDishes);

      }
    } catch (error) {
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
            "Content-Type": "application/json",
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

  // 3. function to handle input change value (as the user starts typing, dish automatically starts to appear)
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();

    if (value === "") {
      // Reset to show everything again
      setFilterDishes(allDish);
      return;
    }

    setLoading(true);
    let combinedResults: Dish[] = [];
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

        const newDishes: Dish[] = data.data;
        if (newDishes.length === 0) {
          keepFetching = false; // no more dishes
          break;
        }

        combinedResults = [...combinedResults, ...newDishes];

        const filtered = combinedResults.filter(dish =>
          dish.dishName.toLowerCase().includes(value)
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

  // 5. function to filter dishes according to category
  const handleCategoryFilter = (category: string) => {
    setLoading(true);

    if (category === "All") {
      setFilterDishes(allDish); // show everything
    } else {
      const filtered = allDish.filter(dish => dish.category.toLowerCase() === category.toLowerCase().trim());
      setFilterDishes(filtered);
    }

    setTimeout(() => {
      setLoading(false);
    }, 400);
  };


  // renders
  // 1. fetch initial dishes and all categories
  useEffect(() => {
    if (!restaurantId) return;
    setPage(1);
    setHasMore(true);
    fetchAllDish();
    fetchCategories();
  }, [restaurantId]);

  // 2. infinite scroll observer
  useEffect(() => {
    //console.log("scrolling...");
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const lastDish = document.querySelector("#last-dish");
    if (lastDish) observer.observe(lastDish);

    return () => {
      if (lastDish) observer.unobserve(lastDish);
    };
  }, [filterDishes, loading, hasMore]);

  // 3. Fetch when page increments
  useEffect(() => {
    if (!restaurantId) return;
    if (page > 1) fetchAllDish(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);


  //5. setInital loading false when menu and categories are loaded
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
                      idx={idx}
                      allDishes={filterDishes}
                      restaurantId={`${restaurantId}`}
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
