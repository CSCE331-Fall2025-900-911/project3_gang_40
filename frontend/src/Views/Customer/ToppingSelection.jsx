import { useState, useEffect } from "react";
import NavBar from "./NavBar";

function ToppingSelection({ drink, modifications, setModifications, onAddToCart, onBack, cart, onCartClick, currentStep, onStepClick }) {
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
    return <div className="topping-container"><p>Loading toppings...</p></div>;
  }

  if (error) {
    return <div className="topping-container"><p>{error}</p></div>;
  }

  const calculateTotal = () => {
    let total = Number(drink.base_price) * modifications.quantity;
    if (modifications.topping && modifications.topping.extra_cost) {
      total += Number(modifications.topping.extra_cost) * modifications.quantity;
    }
    return total.toFixed(2);
  };

  return (
    <div className="topping-page">
      <div className="topping-container">
        <div className="topping-header">
          <h2>Select a Topping</h2>
          <p>{drink.drink_name}</p>
          <p className="topping-summary">
            Sweetness: {modifications.sweetness} | Ice: {modifications.ice} | Qty: {modifications.quantity}
          </p>
        </div>

        <div className="toppings-list">
          {toppings.map(topping => (
            <label key={topping.topping_id} className="topping-option">
              <input
                type="radio"
                name="topping"
                value={topping.topping_id}
                checked={
                  modifications.topping
                    ? modifications.topping.topping_id === topping.topping_id
                    : topping.topping_name === 'No Toppings'
                }
                onChange={() => setModifications(prev => ({ ...prev, topping }))}
              />
              <span className="topping-name">{topping.topping_name}</span>
              <span className="topping-price">+${Number(topping.extra_cost).toFixed(2)}</span>
            </label>
          ))}
        </div>

        <div className="topping-summary-footer">
          <p>Total: ${calculateTotal()}</p>
        </div>

        <div className="topping-actions">
          <button className="back-btn" onClick={onBack}>Back</button>
          <button className="add-to-cart-btn" onClick={onAddToCart}>Add to Cart</button>
        </div>
      </div>

      <NavBar 
        currentStep={3}
        cartCount={cart.length}
        onCartClick={onCartClick}
        onExitClick={onBack}
        onStepClick={onStepClick}
      />
    </div>
  );
}

export default ToppingSelection;
