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
import Link from "next/link";

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
  const [allDish, setAllDish] = useState<Dish[]>([]); // this will store arrays of Dish object;
  const [categories, setCategories] = useState<string[]>(["All"]); // this will store all categories of restaurant
  const [activeBtnClass, setActiveBtnClass] = useState(0); // this will toggle the styles for active category btn

  const [visibleDropdown, setVisibleDropdown] = useState(false); // this will toggle the visibility of category menu (which is only visible for max-lg screens. When true ? 0% left : -100% left)

  const [page, setPage] = useState(1); // track current page
  const [loading, setLoading] = useState(false); // skeleton trigger
  const [hasMore, setHasMore] = useState(true); // stop when no more dishes

  // Cookies
  const restaurantId = Cookies.get("restaurantId");

  // functions
  // 1.
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
      } else {
        setAllDish(prev => [...prev, ...newDishes]);
      }
    } catch (error) {
      toast.error("Failed to fetch dishes");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  // 2. 
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

  // 3. 
  const handleVisibleDropdown = () => setVisibleDropdown(prev => !prev);

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
    console.log("scrolling...");

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
  }, [allDish, loading, hasMore]);

  // 3. Fetch when page increments
  useEffect(() => {
    if (!restaurantId) return;
    if (page > 1) fetchAllDish(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <main className={`flex w-full h-[calc(100vh-70px)] overflow-hidden items-start relative max-md:h-[calc(100vh-60px)]`}>

        <aside
          className={`w-[300px] h-[calc(100dvh-70px)] overflow-y-auto bg-[var(--dark-blue)] text-white p-5 shadow-md transition-all duration-300 ease-in-out z-50 max-lg:absolute max-lg:top-0 
          ${visibleDropdown ? "max-lg:left-0" : "max-lg:-left-full"} max-md:h-[calc(100dvh-60px)]`}>
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
          <br />
          <h1 className="text-xl font-bold mb-6 border-b border-white/30 pb-2">
            Filters
          </h1>
          <ul className="space-y-3">
            {["Available Dishes", "Unavailable Dishes"].map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${categories.length + 1 + index === activeBtnClass
                    ? "bg-[var(--green)] text-white shadow-md"
                    : "hover:bg-[var(--blue)] hover:text-white"
                    }`}
                  onClick={() => setActiveBtnClass(categories.length + 1 + index)}
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
            className="sticky top-0 z-50 bg-white/10 backdrop-blur-xs flex items-center w-[97%] max-w-[1200px] mx-auto my-0  overflow-hidden">
            <button
              onClick={handleVisibleDropdown}
              className="hidden max-lg:block bg-[var(--dark-blue)] font-black text-white p-3 rounded-[8px]  cursor-pointer transition duration-180 opacity-90 hover:scale-110 hover:opacity-100 hover:rounded-xl text-nowrap mr-2">
              {"<<"}
            </button>
            <input type="text" name="search-box" id="menu-search-box" placeholder="Search Dish name" className="p-2 w-full m-4 mx-0 border-1 border-[var(--dark-blue)] border-solid rounded-2xl" />
          </div>

          <div className="flex justify-center w-[97%] max-w-[1200px] mx-[auto] my-0">
            <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full">
              {allDish.map((dish, idx) => (
                <Link
                  key={dish._id}
                  id={idx === allDish.length - 1 ? "last-dish" : undefined} // attach observer to last dish
                  href="#"
                  className="bg-[var(--white)] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-200 max-w-[320px] max-md:w-[300px] max-md:mx-auto max-md:my-0 hover:scale-101"
                >
                  <img src={dish.image[0]} alt={dish.dishName} className="w-full h-40 object-cover" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-[var(--black)]">{dish.dishName}</p>
                      <span
                        className={`w-3 h-3 rounded-full ${dish.veg ? "bg-[var(--green)]" : "bg-[var(--red)]"}`}
                      />
                    </div>
                    <p
                      className={`text-sm font-medium ${dish.available ? "text-[var(--green)]" : "text-[var(--red)]"}`}
                    >
                      {dish.available ? "Available" : "Unavailable"}
                    </p>
                    <div className="flex gap-4 text-sm text-[var(--dark-blue)]">
                      {dish.fullPlate && <p className="font-medium">Full: ₹{dish.fullPlate}</p>}
                      {dish.halfPlate && <p className="font-medium">Half: ₹{dish.halfPlate}</p>}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Skeletons while loading */}
              {loading &&
                Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[var(--white)] rounded-xl shadow-md overflow-hidden max-w-[320px] w-full animate-pulse max-md:mx-auto max-md:my-0"
                  >
                    <div className="w-full h-40 bg-[var(--light-gray)]" />
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
                ))}
            </div>
          </div>
        </section>
      </main>


    </>
  );
};

export default Page;
