import React from 'react';
import textKeys from './text';

function NavBar({ currentStep, cartCount, onCartClick, onExitClick, onStepClick, translatedTexts }) {
  // Steps: 1 = drinks, 2 = customization, 3 = toppings, 4 = cart
  const steps = [
    { id: 1, label: translatedTexts.drinks || 'Drinks', active: currentStep === 1 },
    { id: 2, label: translatedTexts.customize || 'Customize', active: currentStep === 2 },
    { id: 3, label: translatedTexts.toppings || 'Toppings', active: currentStep === 3 },
    { id: 4, label: translatedTexts.cart || 'Cart', active: currentStep === 4 }
  ];

  return (
    <nav className="customer-navbar">
      <div className="navbar-steps">
        {steps.map(step => (
          <button
            key={step.id}
            className={`navbar-step ${step.active ? 'active' : ''}`}
            onClick={() => onStepClick(step.id)}
            type="button"
          >
            <span className="step-label">{step.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <button
          className="navbar-cart-btn"
          onClick={onCartClick}
          title="View Cart"
        >
          {translatedTexts.cart || 'Cart'} ({cartCount})
        </button>
        <button
          className="navbar-exit-btn"
          onClick={onExitClick}
          title="Exit"
        >
          {translatedTexts.exit || 'Exit'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
