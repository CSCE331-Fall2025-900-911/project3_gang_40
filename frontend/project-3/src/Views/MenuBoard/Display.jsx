import React from "react";
import './Display.css'
import MenuItem from "./MenuItem";

import berryLychee from "/assets/images/berry_lychee.png"
import classicPearl from "/assets/images/classic_pearl_milk_tea.png"
import classicTea from "/assets/images/classic_tea-removebg-preview.png"
import coconutPearlMilkTea from "/assets/images/coconut_pearl_milk_tea-removebg-preview.png"
import coffeeCreama from "/assets/images/coffee_creama-removebg-preview.png"
import coffeeMilkTeaWCoffeeJelly from "/assets/images/coffee_milk_tea_w_coffee_jelly-removebg-preview.png"
import goldenRetriever from "/assets/images/golden_retriever-removebg-preview.png"
import HokkaidoPearlMilkTea from "/assets/images/hokkaido_pearl_milk_tea-removebg-preview.png"
import honeyLemonade from "/assets/images/honey_lemonade-removebg-preview.png"
import honeyPearlMilkTea from "/assets/images/honey_pearl_milk_tea-removebg-preview.png"
import honeyTea from "/assets/images/honey_tea-removebg-preview.png"
import mangoPassionFruitTea from "/assets/images/mango_&_passion_fruit_tea-removebg-preview.png"
import mangoGreenMilkTea from "/assets/images/mango_green_milk_tea-removebg-preview.png"
import mangoGreenTea from "/assets/images/mango_green_tea-removebg-preview.png"
import passionChess from "/assets/images/passion_chess-removebg-preview.png"
import peachTeaWHoneyJelly from "/assets/images/peach_tea_w_honey_jelly-removebg-preview.png"
import taroPearlMilkTea from "/assets/images/taro_pearl_milk_tea-removebg-preview.png"
import thaiPearlMilkTea from "/assets/images/thai_pearl_milk_tea-removebg-preview.png"
import tigerBoba from "/assets/images/tiger_boba-removebg-preview.png"

function Display({ onBack }) {
  // Sizes from database
  const sizes = [
    { id: 1, name: 'Small', price: 0.00 },
    { id: 2, name: 'Medium', price: 0.50 },
    { id: 3, name: 'Large', price: 1.00 }
  ];

  // Ice levels from database
  const iceLevels = [
    'No Ice',
    'Less',
    'Regular'
  ];

  // Sweetness levels from database
  const sweetnessLevels = [
    'No Sugar (0%)',
    'Light (30%)',
    'Half (50%)',
    'Less (80%)',
    'Normal (100%)'
  ];

  // Toppings from database
  const toppings = [
    { id: 1, name: 'Pearls (Boba)', price: 0.75 },
    { id: 2, name: 'Lychee Jelly', price: 0.75 },
    { id: 3, name: 'Coffee Jelly', price: 0.75 },
    { id: 4, name: 'Honey Jelly', price: 0.75 },
    { id: 5, name: 'Pudding', price: 0.75 },
    { id: 6, name: 'Crystal Boba', price: 1.00 },
    { id: 7, name: 'Mango Popping Boba', price: 1.00 },
    { id: 8, name: 'Strawberry Popping Boba', price: 1.00 },
    { id: 9, name: 'Ice Cream', price: 1.00 },
    { id: 10, name: 'Creama', price: 1.00 }
  ];

  return (
    <div className="menu-board">
      {/* Exit button moved to top left */}
      <div className="nav-buttons-left">
        <button className="nav-button" onClick={onBack}>Exit</button>
      </div>

      <h1 className="menu-title">Main Menu Bobas</h1>

      <h2 className="menu-title">Classic Teas</h2>
      <div className="menu-items">
        <MenuItem 
          image={classicTea}
          name="Classic Tea"
          price="4.65"
          toppings="toppings"
        />
        <MenuItem 
          image={honeyTea}
          name="Honey Tea"
          price="4.85"
          toppings="toppings"
        />
      </div>

      <h2 className="menu-title">Milky Teas</h2>
      <div className="menu-items">
        <MenuItem 
          image={classicPearl}
          name="Classic Pearl Milk Tea"
          price="6.50"
          toppings="toppings"
        />
        <MenuItem 
          image={coconutPearlMilkTea}
          name="Coconut Pearl Milk Tea"
          price="6.75"
          toppings="toppings"
        />
        <MenuItem 
          image={coffeeCreama}
          name="Coffee Crema"
          price="6.50"
          toppings="toppings"
        />
        <MenuItem 
          image={coffeeMilkTeaWCoffeeJelly}
          name="Coffee Milk Tea w/ Coffee Jelly"
          price="6.25"
          toppings="toppings"
        />
        <MenuItem 
          image={goldenRetriever}
          name="Golden Retriever"
          price="6.75"
          toppings="toppings"
        />
        <MenuItem 
          image={HokkaidoPearlMilkTea}
          name="Hokkaido Pearl Milk Tea"
          price="6.25"
          toppings="toppings"
        />
        <MenuItem 
          image={honeyPearlMilkTea}
          name="Honey Pearl Milk Tea"
          price="6.00"
          toppings="toppings"
        />
        <MenuItem 
          image={mangoGreenMilkTea}
          name="Mango Green Milk Tea"
          price="6.50"
          toppings="toppings"
        />
        <MenuItem 
          image={taroPearlMilkTea}
          name="Taro Pearl Milk Tea"
          price="6.25"
          toppings="toppings"
        />
        <MenuItem 
          image={thaiPearlMilkTea}
          name="Thai Pearl Milk Tea"
          price="6.25"
          toppings="toppings"
        />
        <MenuItem 
          image={tigerBoba}
          name="Tiger Boba"
          price="6.50"
          toppings="toppings"
        />
      </div>

      <h2 className="menu-title">Fruit Teas</h2>
      <div className="menu-items">
        <MenuItem 
          image={berryLychee}
          name="Berry Lychee"
          price="6.50"
          toppings="toppings"
        />
        <MenuItem 
          image={honeyLemonade}
          name="Honey Lemonade"
          price="5.20"
          toppings="toppings"
        />
        <MenuItem 
          image={mangoPassionFruitTea}
          name="Mango & Passion Fruit Tea"
          price="6.50"
          toppings="toppings"
        />
        <MenuItem 
          image={mangoGreenTea}
          name="Mango Green Tea"
          price="5.80"
          toppings="toppings"
        />
        <MenuItem 
          image={passionChess}
          name="Passion Chess"
          price="6.50"
          toppings="toppings"
        />
        <MenuItem 
          image={peachTeaWHoneyJelly}
          name="Peach Tea w/ Honey Jelly"
          price="6.50"
          toppings="toppings"
        />
      </div>

      {/* Customization Options Section */}
      <h2 className="menu-title">Drink Customization</h2>
      
      {/* Sizes Section */}
      <h3 className="subsection-title">Sizes</h3>
      <div className="options-grid">
        {sizes.map(size => (
          <div key={size.id} className="option-item">
            <h4 className="option-name">{size.name}</h4>
            <p className="option-price">
              {size.price === 0 ? 'Base Price' : `+$${size.price.toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>

      {/* Ice Level Section */}
      <h3 className="subsection-title">Ice Level</h3>
      <div className="options-grid">
        {iceLevels.map((level, index) => (
          <div key={index} className="option-item">
            <h4 className="option-name">{level}</h4>
            <p className="option-price">No Extra Charge</p>
          </div>
        ))}
      </div>

      {/* Sweetness Section */}
      <h3 className="subsection-title">Sweetness</h3>
      <div className="options-grid">
        {sweetnessLevels.map((level, index) => (
          <div key={index} className="option-item">
            <h4 className="option-name">{level}</h4>
            <p className="option-price">No Extra Charge</p>
          </div>
        ))}
      </div>

      {/* Toppings Section */}
      <h2 className="menu-title">Toppings</h2>
      <div className="toppings-grid">
        {toppings.map(topping => (
          <div key={topping.id} className="topping-item">
            <h3 className="topping-name">{topping.name}</h3>
            <p className="topping-price">
              {topping.price === 0 ? 'Free' : `+$${topping.price.toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;
