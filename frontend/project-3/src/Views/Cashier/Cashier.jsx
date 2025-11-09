import { useEffect, useState } from 'react'
import './Cashier.css'

function Cashier({ onBack }) {
  // create empty list for drinks and toppings
  const [drinks, setDrinks] = useState([])
  const [toppings, setToppings] = useState([])
  const [cart, setCart] = useState([])
  const [selectedDrink, setSelectedDrink] = useState(null);
  // set default drink modification values
  const [modifications, setModifications] = useState({
    size: 'Medium', sweetness: 'Normal (100%)', ice: 'Regular', topping: null, quantity: '1'
  });

  // populate drinks from database
  useEffect(() => {
    fetch('http://localhost:5000/api/drinks')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched drinks:', data);
        setDrinks(data);
      })
      .catch(err => console.error('Error fetching drinks:', err))
  }, []);

   // populate toppings from database
  useEffect(() => {
    fetch('http://localhost:5000/api/toppings')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched toppings:', data);
        setToppings(data);
      })
      .catch(err => console.error('Error fetching toppings:', err))
  }, []);

  // open modal for drink customization
  const openModal = (drink) => {
    if (toppings.length === 0) {
      console.warn('Toppings not loaded yet');
      return;
    }
    const noTopping = toppings.find(t => t.topping_name === 'No Toppings') || null;
    setSelectedDrink(drink);
    setModifications({size: 'Medium', sweetness: 'Normal (100%)', ice: 'Regular', topping: noTopping, quantity: 1});
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

  // removes drink from cart
  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // clears entire cart
  const clearCart = () => setCart([])

    // Calculate total
  const totalPrice = cart.reduce((sum, item) => {
    const base = Number(item.drink.base_price);
    const toppingPrice = Number(item.modifications.topping?.extra_cost || 0);
    const quantity = Number(item.modifications.quantity);
    return sum + (base + toppingPrice) * quantity;
  }, 0);

  return (
      <div className='cashier-container'>

        {/* nav bar on far left */}
        <nav className='sidebar'>
          <h2>Menu</h2>
          <ul>
            <li><button onClick={onBack}>Exit</button></li>
            {/* to add more nav spots later */}
          </ul>
        </nav>

        {/* drink menu */}
        <div className='drink-section'>
          <h2>Choose a Drink</h2>
          <div className='drink-group'>
            {drinks.length > 0 ? (
              drinks.map((drink) => (
                <button
                  key = {drink.drink_id}
                  className='drink-btn'
                  onClick={() => openModal(drink)}
                >
                  {drink.drink_name}
                  <br />
                  ${Number(drink.base_price).toFixed(2)}
                </button>
              ))
            ) : (
              <p>Loading drinks...</p>
            )}
          </div>    
        </div>

        
        {/* cart */}
        <div className='cart-section'>
          <h2>Cart</h2>
          {cart.length === 0 ? <p>No Drinks Yet</p> : (
            <ul>
              {cart.map((item, idx) => (
              <li key={idx}>
                <span>
                  {item.modifications.quantity} x {item.drink.drink_name} (
                  {item.modifications.size}, {item.modifications.sweetness}, {item.modifications.ice}
                  {item.modifications.topping ? ` + ${item.modifications.topping.topping_name}` : ''})&nbsp;
                  ${( (Number(item.drink.base_price) + Number(item.modifications.topping?.extra_cost || 0)) * item.modifications.quantity).toFixed(2)}
                  &nbsp;&nbsp;
                </span>
                <button className='remove-btn' onClick={() => removeFromCart(idx)}>
                  X
                </button>
              </li>
              ))}
            </ul>
          )}

          <div>
            <h2>
              {/* shows total amount owed */}
              Subtotal: ${totalPrice.toFixed(2)} <br></br>
              Tax: ${(totalPrice * 0.0825).toFixed(2)} <br></br>
              Order Total: ${(totalPrice * 1.0825).toFixed(2)}
            </h2>
          </div>

          <div className='cart-controls'>
              <button className='clear-btn' onClick={clearCart}>
                Clear Cart
              </button>
            </div>  
        </div>

        {/* modifications pop up */}
        {selectedDrink && (
          <div className='modal-backdrop' onClick={closeModal}>
            <div className='modal' onClick={e => e.stopPropagation()}>
              <h3>{selectedDrink.drink_name} Modifications</h3>

              {/* size */}
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

              {/* sweetness */}
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

              {/* ice */}
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
              
              {/* toppings */}
              <div className="modal-section">
                <label>Toppings:</label>
                <div className="toppings-options">
                  {toppings.map(topping => (
                    <label key={topping.topping_id}>
                      <input
                        type="radio"
                        name="topping"
                        value={topping.topping_name}
                        checked={modifications.topping?.topping_id === topping.topping_id} 
                        onChange={() => setModifications(prev => ({
                          ...prev,
                          topping: topping
                        }))}
                      /> 
                      {topping.topping_name} (+${Number(topping.extra_cost).toFixed(2)})
                    </label>
                  ))}
                </div>
              </div>

              {/* quantity */}
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
