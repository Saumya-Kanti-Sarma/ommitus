import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Menu.comp.css";

const MenuComponent = ({ mainUrl, onclickURL }) => {
  const [newMenuData, setNewMenuData] = useState([]);
  const [filteredMenuData, setFilteredMenuData] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [menuGetDetails, setMenuGetDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all-items");
  const navigate = useNavigate();
  const { idOfRestaurant } = useParams();
  const [categories, setCategories] = useState(["all-items"]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}${mainUrl}`
        );

        if (response.status >= 200 && response.status < 300) {
          setNewMenuData(response.data.data);
          setFilteredMenuData(response.data.data); // Initially show all items
        }
      } catch (error) {
        console.error(`${import.meta.env.VITE_BACKEND_URL}${mainUrl}`);
        console.error("Error fetching menu data:", error);
        toast.error("Failed to load menu data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/restaurant/${idOfRestaurant}/get-all-categories`
        );
        const fetchedCategories = response.data.categories || [];
        setCategories((prev) => Array.from(new Set(["all-items", ...prev, ...fetchedCategories])));
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategory();
  }, [idOfRestaurant]);
  // Toggle dish availability status
  const handleToggleAvailability = async (item) => {
    const toastID = toast.loading("Saving changes...");
    setTimeout(async () => {
      try {
        const updateData = { available: !item.available }; // Toggle availability
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/restaurant/menu/edit-menu/${item._id}`, updateData);
        toast.dismiss(toastID);
        toast.success(response.data.message);
        setTimeout(() => window.location.reload(), 400);
      } catch (error) {
        toast.dismiss(toastID);
        toast.error("Failed to update availability.");
      }
    }, 1000);
  };

  // Handle filter button click
  const handleFilterClick = (category) => {
    setActiveFilter(category);

    if (category === "all-items") {
      setFilteredMenuData(newMenuData); // Show all items
    } else {
      const filteredData = newMenuData.filter((item) => item.category === category);
      setFilteredMenuData(filteredData);
    }
  };

  return (
    <>
      {loading ? (
        <div className="menu-loader-parent">
          <div className="def-loader menu-loades-main"></div>
        </div>
      ) : (
        <>
          <div className="filter-dish-section" style={{ height: "50px" }}>
            <h3>Filter:</h3>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`filter-dish-section-btns ${activeFilter === category ? "active-filter" : ""}`}
                onClick={() => handleFilterClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div>
            {filteredMenuData && filteredMenuData.length > 0 ? (
              <div className="parent-menu-container">
                <div className="menu-container">
                  {filteredMenuData.map((item) => (
                    <div
                      key={item._id}
                      className="menu-item"
                      onMouseLeave={() => {
                        setHoveredItem(null);
                        setMenuGetDetails(null);
                      }}
                    >
                      <span className="menu-image-span">
                        <img
                          src={item.image[0].length < 0 ? "/hot-food.jpg" : item.image[0]}
                          onMouseEnter={() => setMenuGetDetails(item._id)}
                        />
                      </span>
                      <p
                        className="menu-get-details"
                        style={{
                          display: menuGetDetails === item._id ? "" : "none",
                        }}
                        onClick={() => navigate(`${onclickURL}/${item._id}`)}
                      >
                        Get Details
                      </p>
                      <div className="menu-item-content">
                        <div className="menu-item-header">
                          <span
                            onClick={() => navigate(`${onclickURL}/${item._id}`)}
                          >
                            {item.dishName}
                          </span>
                        </div>
                        <p
                          className="menu-item-availability"
                          style={{ color: item.available ? "#4CAF50" : "red" }}
                          onMouseEnter={() => setHoveredItem(item._id)} // Show button when hovering over availability
                        >
                          {item.available ? "Available" : "Un-available"}
                        </p>
                        <button
                          className="menu-edit-availability"
                          style={{
                            backgroundColor: item.available
                              ? "red"
                              : "#4CAF50",
                            display:
                              hoveredItem === item._id ? "block" : "none", // Show button only for hovered item
                          }}
                          onMouseEnter={() => setHoveredItem(item._id)} // Keep button visible when hovering over it
                          onMouseLeave={() => setHoveredItem(null)} // Hide button when leaving it
                          onClick={() => handleToggleAvailability(item)}
                        >
                          make {item.available ? "un-available" : "available"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}>
                <p style={{ fontSize: "22px" }}>No menu items available.</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MenuComponent;
