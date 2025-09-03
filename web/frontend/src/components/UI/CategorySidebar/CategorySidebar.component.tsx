"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface CategorySidebarTypes {
  visibleDropdown: boolean;
  OnClickCategoryBtn: (item: string) => void;
  onClickFilterBtn: (filter: boolean) => void;
  restaurantId: string;
}
// API keys
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const CategorySidebar: React.FC<CategorySidebarTypes> = ({ visibleDropdown, restaurantId, OnClickCategoryBtn, onClickFilterBtn }) => {
  const [initalLoad, setInitialLoad] = useState(false); // this stores the initaal loading state, when menu and category is loaded it becomes false; (5th useEffect)

  const [categories, setCategories] = useState<string[]>(["All"]); // this will store all categories of restaurant
  const [activeBtnClass, setActiveBtnClass] = useState(0); // this will toggle the styles for active category btn


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
      console.error("Category Fetch error:", error);
    }
  };

  useEffect(() => {
    if (!restaurantId) return;
    fetchCategories();
  }, [restaurantId]);
  useEffect(() => {
    if (categories.length > 0) {
      setInitialLoad(true);
    }
  }, [categories]);

  return (
    <aside
      className={`hideScrollbar w-[300px] h-[calc(100dvh-70px)] overflow-y-auto bg-[var(--dark-blue)] text-white p-5 shadow-md transition-all duration-300 ease-in-out z-50 max-lg:absolute max-lg:top-0 
          ${visibleDropdown ? "max-lg:left-0" : "max-lg:-left-full"} max-md:h-[calc(100dvh-60px)]`}>

      {initalLoad ?
        <>
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
                  onClick={() => { setActiveBtnClass(index); OnClickCategoryBtn(item) }}
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
                  onClick={() => { setActiveBtnClass(categories.length + 1 + index); onClickFilterBtn(index == 0 ? true : false) }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </> :
        <>
          <div className=" h-full opacity-70 flex flex-col gap-3 animate-pulse">
            {/* Categories heading */}
            <div className="h-6 w-40 bg-[var(--light-gray)] rounded mb-6" />

            {/* Categories list */}
            <ul className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <div className="h-8 w-full bg-[var(--light-gray)] rounded-lg" />
                </li>
              ))}
            </ul>

            <br />
            <br />

            {/* Filters heading */}
            <div className="h-6 w-32 bg-[var(--light-gray)] rounded mb-3" />

            {/* Filters list */}
            <ul className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <li key={i}>
                  <div className="h-8 w-full bg-[var(--light-gray)] rounded-lg" />
                </li>
              ))}
            </ul>
          </div>
        </>
      }

    </aside>
  )
}

export default CategorySidebar
