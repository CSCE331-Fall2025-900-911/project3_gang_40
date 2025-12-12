import React, { useEffect, useState } from "react";
import "./Display.css";
import MenuItem from "./MenuItem";

// Import images (same mapping as in Customer.jsx)
import berryLychee from "/assets/images/berry_lychee.png";
import classicPearl from "/assets/images/classic_pearl_milk_tea.png";
import classicTea from "/assets/images/classic_tea-removebg-preview.png";
import coconutPearlMilkTea from "/assets/images/coconut_pearl_milk_tea-removebg-preview.png";
import coffeeCreama from "/assets/images/coffee_creama-removebg-preview.png";
import coffeeMilkTeaWCoffeeJelly from "/assets/images/coffee_milk_tea_w_coffee_jelly-removebg-preview.png";
import goldenRetriever from "/assets/images/golden_retriever-removebg-preview.png";
import HokkaidoPearlMilkTea from "/assets/images/hokkaido_pearl_milk_tea-removebg-preview.png";
import honeyLemonade from "/assets/images/honey_lemonade-removebg-preview.png";
import honeyPearlMilkTea from "/assets/images/honey_pearl_milk_tea-removebg-preview.png";
import honeyTea from "/assets/images/honey_tea-removebg-preview.png";
import mangoPassionFruitTea from "/assets/images/mango_&_passion_fruit_tea-removebg-preview.png";
import mangoGreenMilkTea from "/assets/images/mango_green_milk_tea-removebg-preview.png";
import mangoGreenTea from "/assets/images/mango_green_tea-removebg-preview.png";
import passionChess from "/assets/images/passion_chess-removebg-preview.png";
import peachTeaWHoneyJelly from "/assets/images/peach_tea_w_honey_jelly-removebg-preview.png";
import taroPearlMilkTea from "/assets/images/taro_pearl_milk_tea-removebg-preview.png";
import thaiPearlMilkTea from "/assets/images/thai_pearl_milk_tea-removebg-preview.png";
import tigerBoba from "/assets/images/tiger_boba-removebg-preview.png";
import oreoIceBlended from "/assets/images/oreo_ice_blended.png";
import taroIceBlended from "/assets/images/taro_ice_blended.png";
import coffeeIceBlended from "/assets/images/coffee_ice_blended.png";
import matchaPearlMilkTea from "/assets/images/matcha_pearl_milk_tea.png";
import strawberryMatchaFreshMilk from "/assets/images/strawberry_matcha_fresh_milk.png";
import defaultDrink from "/assets/images/bubble-tea-clipart.png";

function Display({ onBack }) {
  const [drinks, setDrinks] = useState([]);

  // Image mapping
  const DRINK_IMAGE_MAP = {
    // Classic
    11: classicTea,
    12: honeyTea,
    // Milky
    1: classicPearl,
    2: honeyPearlMilkTea,
    3: coffeeCreama,
    4: coffeeMilkTeaWCoffeeJelly,
    5: HokkaidoPearlMilkTea,
    6: thaiPearlMilkTea,
    7: taroPearlMilkTea,
    8: mangoGreenMilkTea,
    9: goldenRetriever,
    10: coconutPearlMilkTea,
    19: tigerBoba,
    // Fruity
    13: mangoGreenTea,
    18: honeyLemonade,
    46: passionChess,
    47: berryLychee,
    48: peachTeaWHoneyJelly,
    49: mangoPassionFruitTea,
    // Blended
    58: oreoIceBlended,
    59: coffeeIceBlended,
    60: taroIceBlended,
    // Special
    61: strawberryMatchaFreshMilk,
    62: matchaPearlMilkTea,
  };

  // Load drinks from the database
  useEffect(() => {
    fetch("https://project3-gang-40-sjzu.onrender.com/api/drinks")
      .then((res) => res.json())
      .then((data) => setDrinks(data))
      .catch((err) => console.error("Error fetching drinks:", err));
  }, []);

  // Group drinks by category (drink_type field)
  const categories = ["Classic", "Milky", "Fruity", "Blended", "Special"];
  const groupedDrinks = categories.reduce((acc, type) => {
    acc[type] = drinks.filter((d) => d.drink_type === type);
    return acc;
  }, {});

  // Customization sections stay hardcoded for now
  const sizes = [
    { id: 1, name: "Small", price: 0.0 },
    { id: 2, name: "Medium", price: 0.5 },
    { id: 3, name: "Large", price: 1.0 },
  ];

  const iceLevels = ["No Ice", "Less", "Regular", "Hot"];

  const sweetnessLevels = [
    "No Sugar (0%)",
    "Light (30%)",
    "Half (50%)",
    "Less (80%)",
    "Normal (100%)",
    "Extra (150%)",
  ];

  const toppings = [
    { id: 1, name: "Pearls (Boba)", price: 0.75 },
    { id: 2, name: "Lychee Jelly", price: 0.75 },
    { id: 3, name: "Coffee Jelly", price: 0.75 },
    { id: 4, name: "Honey Jelly", price: 0.75 },
    { id: 5, name: "Pudding", price: 0.75 },
    { id: 6, name: "Crystal Boba", price: 1.0 },
    { id: 7, name: "Mango Popping Boba", price: 1.0 },
    { id: 8, name: "Strawberry Popping Boba", price: 1.0 },
    { id: 9, name: "Ice Cream", price: 1.0 },
    { id: 10, name: "Creama", price: 1.0 },
  ];

  return (
    <div className="menu-board">
      <div className="nav-buttons-left">
        <button className="nav-button" onClick={onBack}>
          Exit
        </button>
      </div>

      <h1 className="menu-title">Main Menu Bobas</h1>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="menu-title">{category} Drinks</h2>
          <div className="menu-items">
            {groupedDrinks[category] && groupedDrinks[category].length > 0 ? (
              groupedDrinks[category].map((drink) => {
                const image = DRINK_IMAGE_MAP[drink.drink_id] || defaultDrink;
                return (
                  <MenuItem
                    key={drink.drink_id}
                    image={image}
                    name={drink.drink_name}
                    price={Number(drink.base_price).toFixed(2)}
                  />
                );
              })
            ) : (
              <p>No {category.toLowerCase()} drinks found</p>
            )}
          </div>
        </div>
      ))}

      <h2 className="menu-title">Drink Customization</h2>

      <h3 className="subsection-title">Sizes</h3>
      <div className="options-grid">
        {sizes.map((size) => (
          <div key={size.id} className="option-item">
            <h4 className="option-name">{size.name}</h4>
            <p className="option-price">
              {size.price === 0 ? "Base Price" : `+$${size.price.toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">Ice Level</h3>
      <div className="options-grid">
        {iceLevels.map((level, i) => (
          <div key={i} className="option-item">
            <h4 className="option-name">{level}</h4>
            <p className="option-price">No Extra Charge</p>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">Sweetness</h3>
      <div className="options-grid">
        {sweetnessLevels.map((level, i) => (
          <div key={i} className="option-item">
            <h4 className="option-name">{level}</h4>
            <p className="option-price">No Extra Charge</p>
          </div>
        ))}
      </div>

      <h2 className="menu-title">Toppings</h2>
      <div className="toppings-grid">
        {toppings.map((topping) => (
          <div key={topping.id} className="topping-item">
            <h3 className="topping-name">{topping.name}</h3>
            <p className="topping-price">
              {topping.price === 0 ? "Free" : `+$${topping.price.toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;
