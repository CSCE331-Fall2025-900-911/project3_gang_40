import { useState } from 'react'
import './Cashier.css'

function Cashier({ onBack }) {
  const drinks = ['Classic Pearl Milk Tea', 'Honey Pearl Milk Tea', 'Coffee Creama', 'Coffee Milk Tea w/ Coffee Jelly', 
    'Hokkaido Pearl Milk Tea', 'Thai Pearl Milk Tea', 'Taro Pearl Milk Tea', 'Mango Green Milk Tea', 'Golden Retriver',
    'Coconut Pearl Milk Tea', 'Classic Tea', 'Honey Tea', 'Mango Green Tea', 'Passion Chess', 'Berry Lychee Burst',
    'Peach Tea w/ Honey Jelly', 'Mango & Passion Fruit Tea', 'Honey Lemonade', 'Tiger Boba', 'Stawberry Coconut'
  ]
  const [cart, setCart] = useState([])
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [modifications, setModifications] = useState({
    size: 'Medium', sweetness: 'Normal (100%)', ice: 'Regular', toppings: [], quantity: '1'
  });

  const toppingsOptions = ['Pearls (Boba)', 'Lychee Jelly', 'Cofee Jelly', 'Honey Jelly', 'Pudding', 
    'Crystal Boba', 'Mango Popping Boba', 'Strawberry Popping Boba', 'Ice Cream', 'Creama']

  // open modal for drink customization
  const openModal = (drink) => {
    setSelectedDrink(drink);
    setModifications({size: 'Medium', sweetness: 'Normal (100%)', ice: 'Regular', toppings: [], quantity: 1});
  };

  // close modal
  const closeModal = () => setSelectedDrink(null);

  // adds drink to cart
  const addToCart = () => {
    if (!selectedDrink) return;
    setCart(prev => [
      ...prev,
      { drink: selectedDrink, modifications, quantity: modifications.quantity }
    ]);
    closeModal();
  }

  // toggle toppings
  const toggleTopping = (topping) => {
    setModifications(prev => {
      const newToppings = prev.toppings.includes(topping)
        ? prev.toppings.filter(t => t !== topping)
        : [...prev.toppings, topping];
      return { ...prev, toppings: newToppings };
    });
  };


  // removes drink from cart
  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // clears entire cart
  const clearCart = () => setCart([])

  return (
      <div className='cashier-container'>

        <nav className='sidebar'>
          <h2>Menu</h2>
          <ul>
            <li><button onClick={onBack}>Exit</button></li>
          </ul>
        </nav>

        {/* left side of screen */}
        <div className='drink-section'>
          <h2>Choose a Drink</h2>
          <div className='drink-group'>
            {drinks.map((drink) => (
              <button
                key = {drink}
                className='drink-btn'
                onClick={() => openModal(drink)}
              >
                {drink}
              </button>
            ))}
          </div>
        </div>

        {/* right side of screen */}
        <div className='cart-section'>
          <h2>Cart</h2>
          {cart.length === 0 ? <p>No Drinks Yet</p> : (
            <ul>
              {cart.map((item, idx) => (
              <li key={idx}>
                <span>
                  {item.modifications.quantity} x {item.drink} (
                  {item.modifications.size}, {item.modifications.sweetness}, {item.modifications.ice}
                  {item.modifications.toppings.length ? ` + ${item.modifications.toppings.join(', ')}` : ''})&nbsp;
                </span>
                <button className='remove-btn' onClick={() => removeFromCart(idx)}>
                  X
                </button>
              </li>
              ))}
            </ul>
          )}

          <div className='cart-controls'>
              <button className='clear-btn' onClick={clearCart}>
                Clear Cart
              </button>
            </div>  
        </div>

        {selectedDrink && (
          <div className='modal-backdrop' onClick={closeModal}>
            <div className='modal' onClick={e => e.stopPropagation()}>
              <h3>{selectedDrink} Modifications</h3>

              <div className="modal-section">
                <label>Size:</label>
                <select
                  value={modifications.size}
                  onChange={e => setModifications(prev => ({ ...prev, size: e.target.value }))}
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>

              <div className="modal-section">
                <label>Sweetness:</label>
                <select
                  value={modifications.sweetness}
                  onChange={e => setModifications(prev => ({ ...prev, sweetness: e.target.value }))}
                >
                  <option>No Sugar (0%)</option>
                  <option>Light (30%)</option>
                  <option>Half (50%)</option>
                  <option>Less (80%)</option>
                  <option>Normal (100%)</option>
                </select>
              </div>

              <div className="modal-section">
                <label>Ice:</label>
                <select
                  value={modifications.ice}
                  onChange={e => setModifications(prev => ({ ...prev, ice: e.target.value }))}
                >
                  <option>No Ice</option>
                  <option>Less</option>
                  <option>Regular</option>
                </select>
              </div>

              <div className="modal-section">
                <label>Toppings:</label>
                <div className="toppings-options">
                  {toppingsOptions.map(topping => (
                    <label key={topping}>
                      <input
                        type="checkbox"
                        checked={modifications.toppings.includes(topping)}
                        onChange={() => toggleTopping(topping)}
                      />
                      {topping}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={modifications.quantity}
                  onChange={e =>
                    setModifications(prev => ({
                      ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1)
                    }))
                  }
                  style={{
                    width: "60px",
                    padding: "5px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    textAlign: "center"
                  }}
                />
              </div>

              <div className="modal-actions">
                <button onClick={addToCart}>Add to Cart</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>

          </div>
        )}              
        </div>
  )
}

export default Cashier
