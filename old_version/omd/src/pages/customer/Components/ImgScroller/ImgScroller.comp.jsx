import React, { useState, useRef } from 'react';
import './ImgScroller.comp.css';

const ImgScroller = ({ RestaurantData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const handleSwipe = () => {
    const touchStart = touchStartRef.current;
    const touchEnd = touchEndRef.current;

    if (touchStart !== null && touchEnd !== null) {
      if (touchStart - touchEnd > 50) {
        setActiveIndex((prev) => (prev + 1) % RestaurantData.coverPics.length);
      }
      if (touchEnd - touchStart > 50) {
        setActiveIndex((prev) => (prev - 1 + RestaurantData.coverPics.length) % RestaurantData.coverPics.length);
      }
    }
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  return (
    <div
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-slides"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {RestaurantData && RestaurantData.coverPics.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img src={slide} />
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {RestaurantData && RestaurantData.coverPics.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImgScroller;
