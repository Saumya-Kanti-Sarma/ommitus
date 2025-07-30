const MenuCategory = ({ items, navigate, nameOfRestaurant, idOfRestaurant }) => {
  if (!items?.length) return null;

  return (
    <>
      {items.map((menuItem, index) => (
        <span key={index} className='menu-span-container'>
          <div
            className='menu-item-area'
            onClick={() => navigate(`/customer/restaurant/${nameOfRestaurant}/${idOfRestaurant}/${menuItem._id}`)}
          >
            <img
              src={menuItem.image && menuItem.image[0].length > 1 ? menuItem.image : "/hot-food.jpg"}
              className="menu-item-image"
            />
            <span>
              <div className="cus-dish-name">
                <h4>{menuItem.dishName || "Dish Name"}</h4>
                <p style={{ color: menuItem.veg ? "green" : "black" }}>
                  {menuItem.veg ? "Veg" : "Non-Veg"}
                </p>
              </div>
              <p className='cus-dish-descp'>
                {menuItem.description
                  ? menuItem.description.split(' ').length > 10
                    ? menuItem.description.split(' ').slice(0, 10).join(' ') + '...'
                    : menuItem.description
                  : ""}
              </p>
              <p className='cus-dish-price'>
                Price: ₹{menuItem.fullPlate && menuItem.halfPlate
                  ? `${menuItem.fullPlate}/${menuItem.halfPlate}`
                  : `${menuItem.fullPlate || "N/A"}`}
              </p>
            </span>
          </div>
        </span>
      ))}
    </>
  );
};
export default MenuCategory