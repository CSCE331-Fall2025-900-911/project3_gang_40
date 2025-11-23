import { useState } from "react";
import NavBar from "./NavBar";

function DrinksCustomization({ drink, modifications, setModifications, onNext, onBack, cart, onCartClick, currentStep, onStepClick }) {
  return (
    <div className="customization-page">
      <div className="customization-container">
        <div className="customization-header">
          <h2>Customize {drink.drink_name}</h2>
          <p>Base Price: ${Number(drink.base_price).toFixed(2)}</p>
        </div>

        <div className="customization-content">
          {/* Sweetness Level Selection */}
          <div className="customization-section">
            <label htmlFor="sweetness">Sweetness Level:</label>
            <div className="sweetness-options">
              {[
                'No Sugar (0%)',
                'Light (30%)',
                'Half (50%)',
                'Less (80%)',
                'Normal (100%)'
              ].map(level => (
                <button
                  key={level}
                  className={`sweetness-btn ${modifications.sweetness === level ? 'active' : ''}`}
                  onClick={() => setModifications(prev => ({ ...prev, sweetness: level }))}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level Selection */}
          <div className="customization-section">
            <label htmlFor="ice">Ice Level:</label>
            <div className="ice-options">
              {['No Ice', 'Less', 'Regular'].map(level => (
                <button
                  key={level}
                  className={`ice-btn ${modifications.ice === level ? 'active' : ''}`}
                  onClick={() => setModifications(prev => ({ ...prev, ice: level }))}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="customization-section">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-input">
              <button onClick={() => setModifications(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</button>
              <input
                type="number"
                min="1"
                value={modifications.quantity}
                onChange={e => setModifications(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
              />
              <button onClick={() => setModifications(prev => ({ ...prev, quantity: prev.quantity + 1 }))}>+</button>
            </div>
          </div>
        </div>

        <div className="customization-actions">
          <button className="back-btn" onClick={onBack}>Back</button>
          <button className="next-btn" onClick={onNext}>Next: Select Toppings</button>
        </div>
      </div>

      <NavBar 
        currentStep={2}
        cartCount={cart.length}
        onCartClick={onCartClick}
        onExitClick={onBack}
        onStepClick={onStepClick}
      />
    </div>
  );
}

export default DrinksCustomization;
