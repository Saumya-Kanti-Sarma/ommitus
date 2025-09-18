"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DishTypes from "@/types/Dish.types";
import Dish from "@/components/UI/DishCart/DishCart.component";
import DishCartSkeleton from "@/components/UI/DishCart/DishCartSkeleton.component";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Page = () => {
  const { menuId, restaurantId, restaurantName } = useParams();
  const [dish, setDish] = useState<DishTypes | null>(null);
  const [realtedDishes, setRelatedDishes] = useState<DishTypes[] | null>(null);
  const [realtedDishesLoading, setRelatedDishesLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(false);

  // load dish
  useEffect(() => {

    const fetchDishInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/menu/${menuId}`, {
          headers: {
            "Content-Type": "application/json",
            xkc: API_KEY!,
            xrid: restaurantId!,
          },
        });
        const data = res.data.data;
        setDish(data);
      } catch (err) {
        toast.error("Unable to load dish");
        console.error("Error fetching dish info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDishInfo();
  }, [menuId, restaurantId]);

  //load related dishes
  useEffect(() => {
    if (!dish?.category) return;
    const fetchRelatedDishes = async () => {
      try {
        setRelatedDishesLoading(true);
        const { data } = await axios.get(
          `${API_URL}/api/menu/all?available=true&category=${dish.category}`,
          {
            headers: {
              xkc: API_KEY!,
              xrid: restaurantId!,
            },
          }
        );
        const newDishes: DishTypes[] = data.data;
        setRelatedDishes(newDishes);
      } catch (error) {
        toast.error("Failed to fetch related dish dishes");
      } finally {
        setTimeout(() => {
          setRelatedDishesLoading(false);
        }, 2000);
      }
    };
    fetchRelatedDishes();
  }, [dish]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-start bg-gray-50 mt-5">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <br />
        <div className="flex justify-center items-start bg-gray-50 mt-5">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

      </>
    );
  }

  if (!dish) {
    return (
      <div className="flex justify-center items-start min-h-screen bg-gray-50 mt-5">
        <p className="text-gray-500">No dish found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray-50 pt-5 relative">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        {/* Dish image */}
        <img
          src={dish.image && dish.image[0]}
          alt={dish.dishName}
          className="w-full h-48 object-cover rounded-xl mb-4 cursor-pointer"
          onClick={() => setImagePreview(!imagePreview)}
        />

        {/* Enlarged Preview */}
        {imagePreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setImagePreview(false)}
          >
            <img
              src={dish.image && dish.image[0]}
              alt="preview"
              className="max-w-[calc(100vw-20px)] max-h-[calc(100vh-20px)] rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Dish details */}
        <h1 className="text-2xl font-bold text-gray-800">{dish.dishName}</h1>
        <p className="text-sm text-gray-500 mb-2">{dish.category}</p>
        <p className="text-gray-700 mb-4">{dish.description}</p>
        <div className="flex justify-between items-center mb-4">
          {dish.fullPlate && dish.fullPlate > 0 && (
            <p className="text-lg font-semibold text-gray-800">
              Full: ₹{dish.fullPlate}
            </p>
          )}
          <p
            className={`text-lg font-semibold text-gray-800 ${dish.halfPlate && dish.halfPlate > 0 ? "" : "hidden"
              }`}
          >
            Half: ₹{dish.halfPlate}
          </p>
        </div>
        <span
          className={`inline-block px-3 py-1 text-sm rounded-full ${dish.veg
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {dish.veg ? "Veg" : "Non-Veg"}
        </span>
        {!dish.available && (
          <p className="text-red-600 mt-3 font-semibold">
            Currently Unavailable
          </p>
        )}
      </div>
      {/* Related Dishes Section */}
      <div className="w-full max-w-[1200px] mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Related Dishes
        </h2>
        <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {realtedDishes &&
            realtedDishes.map((dish, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Dish
                  idx={idx}
                  allDishes={realtedDishes}
                  redirectUrl={`customer/${restaurantName}/${restaurantId}/menu`}
                  dish={dish}
                />
              </div>
            ))}

          {realtedDishesLoading && (
            <div className="col-span-full">
              <DishCartSkeleton length={7} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Page;
