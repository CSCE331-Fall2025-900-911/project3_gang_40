import React from 'react';
import './MenuItem.css';

// MenuItem Component
// This component renders a single menu item card with its image, name, price, and optional toppings.
const MenuItem = ({ image, name, price }) => {
  return (
    <div className="menu-item">
      <img 
        src={image} 
        alt={name} 
        className="menu-item-image"
      />
      <h3 className="menu-item-name">{name}</h3>
      <p className="menu-item-price">${price}</p>
    </div>
  );
};

export default MenuItem;
