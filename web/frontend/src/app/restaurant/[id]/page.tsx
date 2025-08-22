"use client";
{/*
  NOTES:
    1. restaurantName and email cannot be changed. this can only be changed in future versions when we accept premium plans

*/}

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface RestaurantInfo {
  email: string;
  ownerName: string;
  categories: string[];
  address?: string;
  since?: string;
  phoneNumber?: string;
  createdAt?: string
}

const Page = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null); //getting the restaurant ID from cookie (saved as restaurantId)
  const [restaurantName, setRestaurantName] = useState<string | null>(null);//getting the restaurant name from cookie (saved as restaurantName)
  const [displayAddCategories, setDisplayAddCategories] = useState(false);// when add more btn in category is clicked this is toggled to show input element.
  const [categories, SetCategories] = useState<string[]>([])
  const [info, setInfo] = useState<RestaurantInfo>({
    email: "",
    ownerName: "",
    categories: [],
    address: "",
    since: "",
    phoneNumber: "",
    createdAt: ""
  }); // information of restaurant fetched from server is stored here

  // gettinf id and restaurant name from cookie
  useEffect(() => {
    const id = Cookies.get("restaurantId");
    const name = Cookies.get("restaurantName");
    setRestaurantId(id || "");
    setRestaurantName(name || "");
  }, []);

  // fetching restaurant data from server
  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/restaurant/get-info/${restaurantId}`,
          {
            headers: {
              "Content-Type": "application/json",
              xkc: API_KEY!,
            },
          }
        );
        const data = res.data.restaurantDetails;
        console.log(data);

        if (data) {
          setInfo({
            email: data.email,
            ownerName: data.ownerName,
            categories: data.categories,
            address: data.address,
            since: data.since,
            phoneNumber: data.phoneNumber,
            createdAt: data.created,
          });
          SetCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching restaurant info:", err);
      }
    };

    if (restaurantId) {
      fetchRestaurantInfo();
    }
  }, [restaurantId]);

  // function to handle form change
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "categories") {
      const categoryList = value.split(",").map(cat => cat.trim());
      console.log(categoryList);

      setInfo(prev => ({
        ...prev,
        categories: categoryList
      }));

      console.log(info);
      return; // Prevents the next setInfo from running
    };
    setInfo(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(info);
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loading = toast.loading("Updating data...")
    try {
      const res = await axios.put(
        `${API_URL}/api/restaurant/update/${restaurantId}`,
        info,
        {
          headers: {
            "Content-Type": "application/json",
            xkc: API_KEY!,
          },
        },
      );
      const data = res.data;
      console.log(data);
      toast.success(data.message)

    } catch (err: any) {
      console.error("Error fetching restaurant info:", err);
      toast.error(err.response?.data?.message)
    } finally {
      toast.dismiss(loading)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-70px)] max-md:min-h-[calc(100dvh-60px)] flex items-center justify-center bg-[var(--light-gray)] p-6 ">
      <form className="w-full max-w-5xl bg-[var(--white)] rounded-2xl shadow-lg p-8 space-y-6" onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-bold text-center text-[var(--blue)] mb-4">
          {restaurantName} Details
        </h1>
        <p className="text-center opacity-50">Joined Ommitus at: {info.createdAt?.slice(0, 16)}</p>

        {/* Restaurant Name (readonly) */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-1">
            Restaurant Name
          </label>
          <input
            type="text"
            value={restaurantName || ""}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 focus:outline-none opacity-40"
            disabled
          />
        </div>

        {/* Email (readonly from API) */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-1">
            Email
          </label>
          <input
            type="email"
            value={info.email}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none opacity-40 bg-gray-100"
            disabled
          />
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-1">
            Owner Name
          </label>
          <input
            type="text"
            value={info.ownerName}
            onChange={handleFormChange}
            name="ownerName"
            placeholder="eg: Saumya Sarma"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
          />
        </div>

        {/* Since */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-1">
            Since
          </label>
          <input
            type="number"
            name="since"
            value={info.since}
            placeholder="eg: 1999"
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-1">
            Address
          </label>
          <input
            value={info.address}
            name="address"
            onChange={handleFormChange}
            placeholder="eg: Rajbari, Agartala 11332"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            onChange={handleFormChange}
            value={info.phoneNumber}
            placeholder="eg: +91 9876543210"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-[var(--black)] mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories && categories.length > 0 ? (
              categories.map((cat, idx) => (
                <span
                  key={idx}
                  className={`relative px-3 py-1 rounded-[5px] text-[#2c2c2c] text-sm  cursor-default font-medium shadow-md text-center items-center flex group ${idx % 2 === 0 ? "bg-[#d1d1d1]" : "bg-[#ececec]"} transition duration-100 ease-in-out opacity-80 hover:opacity-100 hover:scale-[1.05]`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}

                  <img
                    src="/icons/delete.svg"
                    alt="delete"
                    className="w-[20px] absolute left-1/2 -translate-x-1/2 bottom-[-30%] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-250 "
                  />
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No categories available</span>
            )}
            <button className="border-2 border-dotted rounded-full px-[10px] py-[10px] cursor-pointer hover:bg-[var(--blue)] hover:text-white hover:border-white transition duration-250 ease-in-out" onClick={(e) => { e.preventDefault(); setDisplayAddCategories((prev) => !prev) }}>+ Add more</button>
          </div>
          {/* Add to more categories */}
          {displayAddCategories ?
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                name="categories"
                onChange={handleFormChange}
                placeholder="Enter category"
                value={info.categories}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              />
              <button
                type="button"
                className="px-4 py-2 bg-[var(--blue)] text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Add
              </button>
            </div>
            : <div />}

        </div>


        {/* Submit */}
        <button type="submit" className="w-full bg-[var(--blue)] text-[var(--white)] font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300" > Save Details </button>
      </form>
    </div>);
};
export default Page;
