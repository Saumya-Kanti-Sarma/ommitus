import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

import imageCompression from "browser-image-compression";
const RestaurantDishDetail = () => {
  const { idOfRestaurant, dishId } = useParams(); // saves the id from params 
  const [dish, setDish] = useState({}); // saves the dish
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(""); // error state
  const [newDescription, setNewDescription] = useState(""); // for description changes
  const [newHalfPlatePrice, setNewHalfPlatePrice] = useState(""); // for half plate price changes
  const [newFullPlatePrice, setNewFullPlatePrice] = useState(""); // for full plate price changes
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  // Fetch dish details
  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/get-one/${idOfRestaurant}/${dishId}`
        );
        setDish(response.data.data);
        setNewDescription(response.data.data.description); // Pre-fill description
        setNewHalfPlatePrice(response.data.data.halfPlate || ""); // Pre-fill half-plate price
        setNewFullPlatePrice(response.data.data.fullPlate || ""); // Pre-fill full-plate price
      } catch (error) {
        setError("Failed to load dish data");
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [idOfRestaurant, dishId]);

  // Handle image edit
  const handleEditImage = async (event) => {
    const id = toast.loading("Changing image...");
    const file = event.target.files[0];

    if (file) {
      try {
        // Compression options
        const options = {
          maxSizeMB: 0.2, // Maximum file size in MB
          maxWidthOrHeight: 720, // Keep dimensions reasonable
          useWebWorker: true, // Use web worker for faster compression
        };

        // Compress the image
        const compressedFile = await imageCompression(file, options);

        // Initialize Firebase Storage
        const storage = getStorage();

        // Delete the old image if it exists
        if (dish.image) {
          const oldImgRef = ref(storage, dish.image);
          await deleteObject(oldImgRef);
        }

        // Create a unique file name for the new image
        const uniqueFileName = `${dish.dishName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;

        // Upload the new image
        const storageRef = ref(storage, `images/${uniqueFileName}`);
        const snapshot = await uploadBytes(storageRef, compressedFile);

        // Get the download URL of the uploaded image
        const url = await getDownloadURL(snapshot.ref);

        // Update the dish image in state
        setDish((prevData) => ({ ...prevData, image: url }));

        // Optionally, save the updated image URL to your backend
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/edit-menu/${dishId}`, {
          image: url,
        });

        toast.success("Image updated successfully!");
      } catch (error) {
        toast.error("Failed to update image.");
        console.error("Error updating image:", error);
      } finally {
        toast.dismiss(id);
      }
    } else {
      toast.dismiss(id);
      toast.error("No file selected.");
    }
  };


  // Save the changes that occurred
  const handleSaveChanges = async () => {
    const id = toast.loading("Saving dish...")
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/edit-menu/${dishId}`, {
        dishName: dish.dishName,
        category: dish.category,
        veg: dish.veg,
        description: newDescription,
        halfPlate: newHalfPlatePrice,
        fullPlate: newFullPlatePrice,
      });
      toast.dismiss(id);
      toast.success("Changes saved successfully!");
      setTimeout(() => {
        window.location.reload()
      }, 300);
    } catch (error) {
      toast.dismiss(id);
      toast.error("Failed to save changes.");
      console.error(error);
    }
  };

  // Handle dish deletion
  const handleDeleteDish = async () => {
    const id = toast.loading("Deleting dish...")
    const storage = getStorage();
    try {
      // Delete image from Firebase
      const oldImgRef = ref(storage, dish.image);
      await deleteObject(oldImgRef);

      // Delete dish from database
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/delete-menu/${dishId}`);
      toast.dismiss(id);
      toast.success("Dish deleted successfully!");
      setTimeout(() => {
        window.location.reload();
        navigate(-1);
      }, 300);
    } catch (error) {
      toast.dismiss(id);
      toast.error("Failed to delete dish.");
      console.error(error);
    }
  };

  // Handle dish availability toggle
  const handleDraft = async () => {
    const id = toast.loading("saving as draft...")
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/edit-menu/${dishId}`, {
        available: !dish.available,
      });
      toast.dismiss(id);
      toast.success(dish.available ? "Dish marked as unavailable!" : "Dish marked as available!");
      setDish({ ...dish, available: !dish.available }); // Update local state
      setTimeout(() => {
        window.location.reload()
      }, 300);
    } catch (error) {
      toast.dismiss(id);
      toast.error("Failed to update dish availability.");
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchCategory = async () => {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/${idOfRestaurant}/get-all-categories`)
        .then((response) => setCategories(response.data.categories))
        .catch((err) => console.log(err.message))
    }
    fetchCategory();
  }, [idOfRestaurant]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <head>
        <title>Dish Detail</title>
      </head>
      <div className="container">
        <div className="form">
          {/* IMAGE */}
          <div className="image-upload">
            <label htmlFor="imageInput">
              <img src={dish.image} alt={dish.dishName} className="dish-image" />
              <div className="placeholder">Edit</div>
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleEditImage}
              style={{ opacity: '0', position: "absolute", height: "100%", width: "100%", cursor: "pointer" }}
            />
          </div>

          {/* DISH NAME */}
          <input
            type="text"
            placeholder="Name of dish"
            className='upload-img-input'
            value={dish.dishName}
            onChange={(e) => setDish({ ...dish, dishName: e.target.value })}
          />

          {/* CATEGORY */}
          <section className='check-area'>
            <div className="checkbox-group">
              <label>Category:</label>
              {categories && categories.length > 0 ? categories.map((option) => (
                <>
                  <div key={option} style={{ marginRight: "8px", display: "inline-block" }}>
                    <input
                      type="radio"
                      name="category"
                      value={option}
                      checked={dish.category === option}
                      onChange={() => setDish({ ...dish, category: option })}
                    />
                    {option}
                  </div>
                </>
              )) : ""}
            </div>
          </section>

          {/* VEG */}
          <div className="checkbox-group">
            <label style={{ marginRight: "8px" }}>
              <input
                type="checkbox"
                checked={dish.veg}
                onChange={() => setDish({ ...dish, veg: dish.veg })}
              />
              Veg
            </label>
            <label>
              <input
                type="checkbox"
                checked={!dish.veg}
                onChange={() => setDish({ ...dish, veg: !dish.veg })}
              />
              non-veg
            </label>
          </div>

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description of dish"
            className='upload-img-input upload-description'
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          {/* DISH PRICING */}
          <section className='dish-pricing-area'>
            <input
              type="number"
              placeholder="Full plate price in INR"
              className='upload-img-input'
              value={newFullPlatePrice}
              onChange={(e) => setNewFullPlatePrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Half plate price in INR"
              className='upload-img-input'
              value={newHalfPlatePrice}
              onChange={(e) => setNewHalfPlatePrice(e.target.value)}
            />
          </section>

          <div className="buttons">
            <button className="save-button createMenu-btns" onClick={handleSaveChanges}>Save</button>
            <button className="draft-button createMenu-btns" onClick={handleDraft}>{dish.available ? "Mark as Unavailable" : "Mark as Available"}</button>
            <button className="draft-button createMenu-btns" onClick={handleDeleteDish}>Delete Item</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantDishDetail;
