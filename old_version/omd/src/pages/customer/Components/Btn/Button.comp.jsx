import React from 'react';
import './Button.comp.css';

const Button = ({ label, onClick, styles }) => {
  return (
    <button className="custom-button" onClick={onClick} style={styles}>
      {label}
    </button>
  );
};

export default Button;
