import React from 'react';

function NavBar({ currentStep, cartCount, onCartClick, onExitClick, onStepClick }) {
  // Steps: 1 = drinks, 2 = customization, 3 = toppings, 4 = cart
  const steps = [
    { id: 1, label: 'Drinks', active: currentStep === 1 },
    { id: 2, label: 'Customize', active: currentStep === 2 },
    { id: 3, label: 'Toppings', active: currentStep === 3 },
    { id: 4, label: 'Cart', active: currentStep === 4 }
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
          🛒 Cart ({cartCount})
        </button>
        <button 
          className="navbar-exit-btn"
          onClick={onExitClick}
          title="Exit"
        >
          Exit
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
