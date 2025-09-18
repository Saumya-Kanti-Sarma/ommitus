"use client";
{/*
  file path:  web/frontend/src/app/restaurant/[id]/menu/[menuID]/create/page.tsx
  route    :  `/restaurant/:id/menu/:menuID`
 */}

import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export default function DishDetails() {
  const { menuID } = useParams();

  const [image, setImage] = useState<File | null>(null); // this will store the image File during reuploading
  const [preview, setPreview] = useState<string>(""); // this will store the url of image 
  const [categories, setCategories] = useState<string[]>([]);// this will store the list of all categories fetched from server

  interface formDataTypes {
    dishName: string,
    image: string,
    category: string,
    veg: boolean,
    description: string,
    fullPlate: string,
    halfPlate: string | null,
    available: boolean,
    restaurantId: string,
  }
  const [formData, setFromData] = useState<formDataTypes>({
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

  // load dish
  useEffect(() => {
    const fetchDishInfo = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/menu/${menuID}`,
          {
            headers: {
              "Content-Type": "application/json",
              xkc: API_KEY!,
              xrid: restaurantId!,
            },
          }
        );
        const data = res.data.data;
        const tempCategory = data.category;
        const dishInfo = {
          available: data.available,
          category: (tempCategory.charAt(0).toUpperCase() + tempCategory.slice(1)),
          createdAt: data.createdAt,
          description: data.description,
          dishName: data.dishName,
          fullPlate: data.fullPlate,
          halfPlate: data.halfPlate,
          image: data.image[0],
          restaurantId: data.restaurantId,
          veg: data.veg,
          _id: data._id,
        }
        console.log(dishInfo);

        setPreview(data.image[0]);
        setFromData(dishInfo);
      }
      catch (err) {
        toast.error("Unable to load categories");
        //console.error("Error fetching restaurant info:", err);
      }
    };
    fetchDishInfo();
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
      setFromData(prev => ({ ...prev, available: availablevalue }))
      return;
    };

    setFromData(prev => ({
      ...prev,
      [name]: value
    }));
    // console.log(formData);

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loading = toast.loading("Updating menu...");
    //console.log("Submitted");

    try {
      let uploadedImageUrl = preview;
      // console.log(uploadedImageUrl);

      // 1. Upload image to Supabase
      if (image) {
        const formData = new FormData(); // creating fromData class becasue backend accepts FormData
        formData.append("file", image);

        const uploadRes = await axios.post("/api/upload-img", formData);
        uploadedImageUrl = uploadRes.data.url;

        setFromData((prev) => ({ ...prev, image: uploadedImageUrl }));
      }

      // 2. Post formData to your API
      const res = await axios.put(
        `${API_URL}/api/menu/${menuID}`,
        { ...formData, image: uploadedImageUrl }, // send JSON
        {
          headers: {
            "Content-Type": "application/json",
            xkc: API_KEY,
            xrid: restaurantId,
          },
        }
      );

      toast.success(res.data.message || "Menu Updated successfully");
      console.log(res.data);

    } catch (err) {
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

  const handleDelete = async () => {
    const loading = toast.loading("Deleting dish...")
    try {
      const res = await axios.delete(
        `${API_URL}/api/menu/${menuID}`,
        {
          headers: {
            "Content-Type": "application/json",
            xkc: API_KEY,
            xrid: restaurantId,
          },
        }
      );

      toast.success(res.data.message || "Menu Deleted successfully");
      console.log(res.data);

    } catch (err) {
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
  }

  return (
    <div className="min-h-[calc(100vh-70px)] w-full  flex items-center justify-center bg-[var(--white)] max-md:min-h-[calc(100vh-60px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--white)]  rounded-2xl shadow-2xl w-[98%] max-w-[1080px] p-10"
      >
        <h1 className="text-2xl font-bold text-[var(--blue)] mb-4 max-md:text-[16px]">Add Dish To Menu</h1>

        {/* Dish Name */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold max-md:text-[12px] max-md:mb-1">
          Dish Name
        </label>
        <input
          type="text"
          name="dishName"
          placeholder="Enter dish name"
          onChange={handleOnChange}
          value={formData?.dishName}
          className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] max-md:text-[10px]"
          required
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
                defaultChecked={cat == formData?.category}

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
            <input type="radio" name="veg" value="Yes" onChange={handleOnChange} className="max-md:text-[10px]" checked={formData.veg} />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="veg" value="No" onChange={handleOnChange} className="max-md:text-[10px]" checked={!formData.veg} />
            No
          </label>
        </div>

        {/* Description */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold  max-md:text-[12px] max-md:mb-1">
          Description
        </label>
        <input
          name="description"
          placeholder="Enter description"
          onChange={handleOnChange}
          value={formData?.description}
          className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] max-md:text-[10px]"
        />

        {/* Prices */}
        <div className="flex gap-4">
          <div className="flex-1  max-md:text-[12px] max-md:mb-1">
            <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
              Full Plate Price
            </label>
            <input
              type="number"
              name="fullPlate"
              placeholder="₹ Full price"
              value={formData?.fullPlate}
              onChange={handleOnChange}
              className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] max-md:text-[10px]"
              required
            />
          </div>
          <div className="flex-1  max-md:text-[12px] max-md:mb-1">
            <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
              Half Plate Price
            </label>
            <input
              type="number"
              name="halfPlate"
              value={formData?.halfPlate ? formData.halfPlate : NaN}
              onChange={handleOnChange}
              placeholder="₹ Half price"
              className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] max-md:text-[10px]"
            />
          </div>
        </div>
        {/* Available? */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold  max-md:text-[12px] max-md:mb-1">
          Available
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 max-md:text-[10px]">
            <input type="radio" name="available" value="Available" onChange={handleOnChange} checked={formData?.available} />
            Available
          </label>
          <label className="flex items-center gap-2 max-md:text-[10px]">
            <input type="radio" name="available" value="Un-available" onChange={handleOnChange} checked={formData.available ? false : true} />
            Un-available
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center gap-5">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-[var(--red)] text-[var(--white)] py-2 rounded-md font-semibold opacity-70 hover:opacity-100 transition"
          >
            Delete Dish
          </button>
          <button
            type="submit"
            className="w-full bg-[var(--blue)] text-[var(--white)] py-2 rounded-md font-semibold hover:bg-[var(--dark-blue)] transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
