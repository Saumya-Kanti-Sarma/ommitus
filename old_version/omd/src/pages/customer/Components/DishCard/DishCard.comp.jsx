import React from 'react';
import './DishCard.comp.css';

const DishCard = ({ name, isVeg, description, quantity, price, imgSrc }) => {
  // Function to truncate the description to 70 words
  const truncateDescription = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="dish-card">
      <div className="dish-img">
        <img src={imgSrc || 'placeholder-image-url'} alt="Dish" />
      </div>
      <div className="dish-details">
        <div className="dish-name">
          <h3>{name}</h3>
          <span className={`dish-tag ${isVeg ? 'veg' : 'non-veg'}`}>
            {isVeg ? 'veg' : 'non-veg'}
          </span>
        </div>
        <p className="dish-description">
          {truncateDescription(description, 10)}
        </p>
        <div className="dish-meta">
          <span>{quantity}</span>
        </div>
        <p className="dish-price">₹{price}</p>
      </div>
    </div>
  );
};

export default DishCard;
