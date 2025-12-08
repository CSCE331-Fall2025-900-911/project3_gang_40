import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import textKeys from './components/text';

function ToppingSelection({ drink, modifications, setModifications, onAddToCart, onBack, cart, onCartClick, currentStep, onStepClick, translatedTexts, largeMode }) {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/toppings')
      .then(res => res.json())
      .then(data => {
        setToppings(data);
        // Set default topping to "No Toppings"
        const noToppingOption = data.find(t => t.topping_name === 'No Toppings');
        if (noToppingOption && !modifications.topping) {
          setModifications(prev => ({ ...prev, topping: noToppingOption }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching toppings:', err);
        setError('Failed to load toppings');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="topping-page">
        <div className="loading-toppings">
          <p>Loading Toppings...</p>
        </div>       
      </div>;
  }

  if (error) {
    return <div className="topping-container"><p>{error}</p></div>;
  }

  // Toggle topping selected
  const toggleTopping = (topping) => {
    let newSelected = modifications.selected_toppings ? [...modifications.selected_toppings] : [];
    const index = newSelected.findIndex(t => t.topping_id === topping.topping_id);
    if (index > -1) {
      // Remove topping
      newSelected.splice(index, 1);
    } else {
      // Add topping
      newSelected.push(topping);
    }
    // If no toppings selected, add No Toppings by default
    if (newSelected.length === 0) {
      const noToppingOption = toppings.find(t => t.topping_name === 'No Toppings');
      if (noToppingOption) newSelected = [noToppingOption];
    } else {
      // Remove "No Toppings" if any other topping is selected
      newSelected = newSelected.filter(t => t.topping_name !== 'No Toppings');
    }
    setModifications(prev => ({ ...prev, selected_toppings: newSelected }));
  };

  // Calculate total price including all selected toppings
  const calculateTotal = () => {
    let total = Number(drink.base_price) * modifications.quantity;
    if (modifications.selected_toppings) {
      total += modifications.selected_toppings.reduce((sum, t) => sum + Number(t.extra_cost || 0), 0) * modifications.quantity;
    }
    return total.toFixed(2);
  };

  return (
    <div className={`topping-page ${largeMode ? 'topping-page--large' : ''}`}>
      <div className={`topping-container ${largeMode ? 'topping-container--large' : ''}`}>
        <div className="topping-header">
          <h2>{translatedTexts?.selectTopping || textKeys.selectTopping}</h2>
          <p>{drink.drink_name}</p>
          <p className="topping-summary">
            {translatedTexts?.sweetness || textKeys.sweetness}: {modifications.sweetness} |
            {translatedTexts?.ice || textKeys.ice}: {modifications.ice} |
            {translatedTexts?.quantity || textKeys.quantity}: {modifications.quantity}
          </p>
        </div>

        <div className="toppings-list">
          {toppings.map(topping => (
            <label key={topping.topping_id} className="topping-option">
              <input
                type="checkbox"
                value={topping.topping_id}
                checked={modifications.selected_toppings?.some(t => t.topping_id === topping.topping_id) || false}
                onChange={() => toggleTopping(topping)}
              />
              <span className="topping-name">{topping.topping_name}</span>
              <span className="topping-price">+${Number(topping.extra_cost).toFixed(2)}</span>
            </label>
          ))}
        </div>

        <div className="topping-summary-footer">
          <p> {translatedTexts?.total || textKeys.total}: ${calculateTotal()}</p>
        </div>

        <div className="topping-actions">
          <button className="back-btn" onClick={onBack}> {translatedTexts?.back || textKeys.back}</button>
          <button className="add-to-cart-btn" onClick={onAddToCart}>  {translatedTexts?.addToCart || textKeys.addToCart}</button>
        </div>
      </div>

      <NavBar
        currentStep={3}
        cartCount={cart.length}
        onCartClick={onCartClick}
        onExitClick={onBack}
        onStepClick={onStepClick}
        translatedTexts={translatedTexts}
        largeMode={largeMode}
      />
    </div>
  );
}

export default ToppingSelection;
