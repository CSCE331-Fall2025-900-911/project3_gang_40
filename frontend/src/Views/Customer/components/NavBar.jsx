import React from 'react';
import textKeys from './text';
import Weather from './Weather'

function NavBar({ currentStep, cartCount, onCartClick, onExitClick, onStepClick, translatedTexts, largeMode }) {
  const steps = [
    { id: 1, label: translatedTexts.drinks || 'Drinks', active: currentStep === 1 },
    { id: 2, label: translatedTexts.customize || 'Customize', active: currentStep === 2 },
    { id: 3, label: translatedTexts.toppings || 'Toppings', active: currentStep === 3 },
    { id: 4, label: translatedTexts.cart || 'Cart', active: currentStep === 4 }
  ];

  return (
    <nav className={`customer-navbar ${largeMode ? 'customer-navbar--large' : ''}`}>

      <Weather largeMode={largeMode} /> 
      
      <div className={`navbar-steps ${largeMode ? 'navbar-steps--large' : ''}`}>
        {steps.map(step => (
          <button
            key={step.id}
            className={`navbar-step ${step.active ? 'active' : ''} ${largeMode ? 'navbar-step--large' : ''}`}
            onClick={() => onStepClick(step.id)}
            type="button"
          >
            <span className="step-label">{step.label}</span>
          </button>
        ))}
      </div>

      <div className={`navbar-actions ${largeMode ? 'navbar-actions--large' : ''}`}>
        <button
          className={`navbar-cart-btn ${largeMode ? 'navbar-cart-btn--large' : ''}`}
          onClick={onCartClick}
          title="View Cart"
        >
          {translatedTexts.cart || 'Cart'} ({cartCount})
        </button>
        <button
          className={`navbar-exit-btn ${largeMode ? 'navbar-exit-btn--large' : ''}`}
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
