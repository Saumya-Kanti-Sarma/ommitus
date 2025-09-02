"use client";
{/*
  file path:  web/frontend/src/app/restaurant/[id]/create/page.tsx
  Note     :  this file has logic for creating / hossting dishes in menu. It uses 3 APIs 
              1. fetching all categories of the restaurant
              2. uploading dish detailes to server
              3. uplaoding dish image to supabase (native next API)
  route    :  `/restaurant/:id/create`
 */}

import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Input } from "@/components/UI/Restaurant/Input/Input";

export default function DishForm() {
  const [image, setImage] = useState<File | null>(null); // this will store the image File
  const [preview, setPreview] = useState<string | null>(null); // this will store the url of image  to preview it before uploading and to show on screen
  const [categories, setCategories] = useState<string[]>([]);// this will store the list of all categories fetched from server

  const [formData, setFromData] = useState({
    dishName: "",
    image: "",
    category: "",
    veg: false,
    description: "",
    fullPlate: "",
    halfPlate: "",
    available: true,
    restaurantId: "",
  })

  // API keys
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  //Cookies
  const restaurantId = Cookies.get("restaurantId");
  useEffect(() => {
    if (restaurantId) {
      setFromData((prev) => ({ ...prev, restaurantId }));
    }
  }, [restaurantId])

  // load categories
  useEffect(() => {
    const fetchRestaurantInfo = async () => {
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
        // console.log(data.categories);
        setCategories(data.categories);
      }
      catch (err) {
        toast.error("Unable to load categories");
        //console.error("Error fetching restaurant info:", err);
      }
    };
    fetchRestaurantInfo();
  }, [])

  // load the file and preview image befire uploading
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle form change
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name == "veg") {
      let VegValue;
      value == "Yes" ? VegValue = true : VegValue = false;
      setFromData(prev => ({ ...prev, veg: VegValue }))
      return;
    };
    if (name == "available") {
      let availablevalue;
      value == "Available" ? availablevalue = true : availablevalue = false;
      setFromData(prev => ({ ...prev, veg: availablevalue }))
      return;
    };
    setFromData(prev => ({
      ...prev,
      [name]: value
    }));
    // console.log(formData);

  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loading = toast.loading("Uploading menu...");
    //console.log("Submitted");

    try {
      let uploadedImageUrl = "";

      // 1. Upload image to Supabase
      if (image) {
        const formData = new FormData(); // creating fromData class becasue backend accepts FormData
        formData.append("file", image);

        const uploadRes = await axios.post("/api/upload-img", formData);
        uploadedImageUrl = uploadRes.data.url;

        setFromData((prev) => ({ ...prev, image: uploadedImageUrl }));
      }

      // 2. Post formData to your API
      const res = await axios.post(
        `${API_URL}/api/menu/add-menu`,
        { ...formData, image: uploadedImageUrl }, // send JSON
        {
          headers: {
            "Content-Type": "application/json",
            xkc: API_KEY,
            xrid: restaurantId,
          },
        }
      );

      toast.success(res.data.message || "Menu added successfully");
      //console.log(res.data);

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Request failed");
      } else {
        // Non-Axios error
        //console.error("Unexpected error:", err);
        toast.error("Something went wrong");
      }
    } finally {
      toast.dismiss(loading);
    }
  };


  return (
    <div className="min-h-[calc(100vh-70px)] w-full  flex items-center justify-center bg-[var(--white)] max-md:min-h-[calc(100vh-60px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--white)]  rounded-2xl shadow-2xl w-[98%] max-w-[1080px] p-10"
      >
        <h1 className="text-2xl font-bold text-[var(--blue)] mb-4 max-md:text-[16px]">Add Dish To Menu</h1>

        {/* Dish Name */}
        <Input
          type="text"
          name="dishName"
          placeholder="Enter dish name"
          onChange={handleOnChange}
          label="Dish Name"
          labelColor={true}
        />

        {/* Image Upload */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold  max-md:text-[12px] max-md:mb-1">
          Dish Image
        </label>
        <div className="border-2 border-dashed border-[var(--blue)] rounded-lg p-4 text-center mb-4 cursor-pointer relative w-full">
          <input
            type="file"
            accept="image/*"
            className="bg-orange-400 absolute w-[100%] left-0 top-0 h-full opacity-0"
            id="imageUpload"
            onChange={handleImageChange}
          />
          {!preview && (
            <>
              <label htmlFor="imageUpload" className="cursor-pointer max-md:text-[14px]">
                Drag & Drop or Click to Upload
              </label>
            </>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 max-h-40 mx-auto rounded-md"
            />
          )}
        </div>

        {/* Category */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold  max-md:text-[12px] max-md:mb-1">
          Category
        </label>
        <div className="flex gap-4 mb-4 flex-wrap">
          {categories && categories.length > 0 && categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2  max-md:text-[10px]">
              <input
                type="radio"
                name="category"
                onChange={handleOnChange}
                value={cat}
                defaultChecked={cat === "Starter"}

              />
              {cat}
            </label>
          ))}
        </div>

        {/* Veg/Non-Veg */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold  max-md:text-[12px] max-md:mb-1">
          Is Veg?
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="veg" value="Yes" onChange={handleOnChange} className="max-md:text-[10px]" />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="veg" value="No" onChange={handleOnChange} defaultChecked className="max-md:text-[10px]" />
            No
          </label>
        </div>

        {/* Description */}
        <Input
          name="description"
          placeholder="Enter description"
          onChange={handleOnChange}
          label="Description"
          labelColor={true}
        />

        {/* Prices */}
        <div className="flex gap-4 my-2.5">
          <Input
            type="number"
            name="fullPlate"
            placeholder="₹ Full price"
            onChange={handleOnChange}
            label="Price"
            labelColor={true}
          />
          <Input
            type="number"
            name="halfPlate"
            onChange={handleOnChange}
            placeholder="₹ Half price"
            label="Half plate price"
            labelColor={true}
          />
        </div>
        {/* Available? */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold  max-md:text-[12px] max-md:mb-1">
          Available
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 max-md:text-[10px]">
            <input type="radio" name="available" value="Available" onChange={handleOnChange} defaultChecked />
            Available
          </label>
          <label className="flex items-center gap-2 max-md:text-[10px]">
            <input type="radio" name="available" value="Un-available" onChange={handleOnChange} />
            Un-available
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[var(--blue)] text-[var(--white)] py-2 rounded-md font-semibold hover:bg-[var(--dark-blue)] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
