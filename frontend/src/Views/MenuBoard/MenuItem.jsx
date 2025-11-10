import React from 'react';
import './MenuItem.css';

const MenuItem = ({ image, name, price, toppings }) => {
  return (
    <div className="menu-item">
      <img 
        src={image} 
        alt={name} 
        className="menu-item-image"
      />
      <h3 className="menu-item-name">{name}</h3>
      <p className="menu-item-price">${price}</p>
      {toppings && (
        <span className="menu-item-toppings">w/ {toppings}</span>
      )}
    </div>
  );
};

export default MenuItem;
