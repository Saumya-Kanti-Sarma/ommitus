"use client";
import { useState } from "react";

export default function DishForm() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted");
  };

  return (
    <div className="min-h-[calc(100vh-70px)] w-full  flex items-center justify-center bg-[var(--light-gray)] max-md:min-h-[calc(100vh-60px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--white)]  rounded-2xl shadow-lg w-[98%] max-w-[1080px] p-10"
      >
        <h1 className="text-2xl font-bold text-[var(--blue)] mb-4">Add Dish</h1>

        {/* Dish Name */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
          Dish Name
        </label>
        <input
          type="text"
          name="dishName"
          placeholder="Enter dish name"
          className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
          required
        />

        {/* Image Upload */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
          Dish Image
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-[var(--blue)] rounded-lg p-4 text-center mb-4 cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            Drag & Drop or Click to Upload
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 max-h-40 mx-auto rounded-md"
            />
          )}
        </div>

        {/* Category */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
          Category
        </label>
        <div className="flex gap-4 mb-4">
          {["Starter", "Main Course", "Beverage"].map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={cat}
                defaultChecked={cat === "Starter"}
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Veg/Non-Veg */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
          Is Veg?
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="isVeg" value="Yes" defaultChecked />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="isVeg" value="No" />
            No
          </label>
        </div>

        {/* Description */}
        <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Enter description"
          className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
          rows={4}
        />

        {/* Prices */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
              Full Plate Price
            </label>
            <input
              type="number"
              name="fullPrice"
              placeholder="₹ Full price"
              className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-[var(--dark-blue)] font-semibold">
              Half Plate Price
            </label>
            <input
              type="number"
              name="halfPrice"
              placeholder="₹ Half price"
              className="w-full border border-[var(--gray)] p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              required
            />
          </div>
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
