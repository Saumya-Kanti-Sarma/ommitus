import React, { useEffect, useState } from "react";
import { storage } from "../../utils/Firebase.js";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import "./ImgGrid.comp.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ImgGridComponent = ({ heading, limit, props }) => {
  const [enlargedIndex, setEnlargedIndex] = useState(null);
  const [displayBtn, setDisplayBtn] = useState("flex");
  const [deleteBtnDisplay, setDeleteBtnDisplay] = useState("none");
  const [imgList, setImgList] = useState([]); // Fetch from MongoDB
  const [uploadImg, setUploadImg] = useState(null);

  const { idOfRestaurant } = useParams();

  const handleEnlargeImg = (index) => {
    setEnlargedIndex((prevIndex) => (prevIndex === index ? null : index));
    setDeleteBtnDisplay((prev) => (prev === "none" ? "" : "none"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const id = toast.loading(`Uploading ${props}`)
      const storageRef = ref(storage, `${props}/${file.name}${Date.now()}`); // Define the storage path
      uploadBytes(storageRef, file)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then(async (url) => {
          setUploadImg(url);

          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/get-info/${idOfRestaurant}`);
          const currentArray = response.data.restaurantDetails[props] || [];
          const updatedArray = [...currentArray, url];

          const data = {
            [props]: updatedArray,
          };

          await axios.put(`${import.meta.env.VITE_BACKEND_URL}/restaurant/update/${idOfRestaurant}`, data);

          toast.dismiss(id);
          toast.success("Image uploaded successfully!");
          setImgList(updatedArray); // Update the state with the new array
        })
        .catch((error) => {
          toast.error("Failed to upload image.");
          console.error("Error uploading image:", error);
          toast.dismiss(id);
        });
    }
  };

  const handleDeleteImage = async () => {
    if (enlargedIndex === null || enlargedIndex >= imgList.length) {
      toast.error("No image selected for deletion.");
      return;
    }

    try {
      // Get the URL of the image to delete based on the enlarged index
      const urlToDelete = imgList[enlargedIndex];

      // Delete the image from Firebase Storage
      const imageRef = ref(storage, urlToDelete);
      await deleteObject(imageRef);

      // Remove the image from the array in the backend
      const updatedArray = imgList.filter((_, index) => index !== enlargedIndex);

      // Update the backend with the new array
      const data = {
        [props]: updatedArray,
      };

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/restaurant/update/${idOfRestaurant}`, data);

      // Update the local state and reset the enlarged index
      setImgList(updatedArray);
      setEnlargedIndex(null);
      setDeleteBtnDisplay("none")

      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image.");
      console.error("Error deleting image:", error);
    }
  };


  useEffect(() => {
    async function fetchImages() {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/get-info/${idOfRestaurant}`);
      const images = response.data.restaurantDetails[props];
      setImgList(images);

      if (images && limit === images.length) {
        setDisplayBtn("none");
      } else {
        setDisplayBtn("flex");
      }
    }
    fetchImages();
  }, [idOfRestaurant, props, limit]);

  return (
    <div className="img-div-comp">
      <p className="img-div-comp-heading">{heading || "-| HEADING |-"}</p>
      <div className="upload-area" style={{ display: displayBtn }}>
        <p className="upload-txt">Add {heading}</p>
        <input type="file" accept="image/*" onChange={handleImageChange} className="upload-btn" />
      </div>

      <section className="img-div-imgArea">
        {imgList && imgList.length > 0 ? (
          imgList.map((item, index) => (
            <div key={index} className="img-wrapper">
              <img
                src={item}
                alt={`Grid Image ${index}`}
                className={`imgs-of-imgGrid ${enlargedIndex === index ? "enlarge-img" : ""}`}
                onClick={() => handleEnlargeImg(index)}
              />

            </div>

          ))
        ) : (
          <section className="img-div-imgArea">
            {[...Array(4)].map((_, index) => (
              <div className="imgs-of-imgGrid placeholder" key={index}></div>
            ))}
          </section>
        )}
      </section>
      <button
        className="delete-image"
        style={{ display: deleteBtnDisplay }}
        onClick={handleDeleteImage}
      > Delete
      </button>
    </div>
  );
};

export default ImgGridComponent;
