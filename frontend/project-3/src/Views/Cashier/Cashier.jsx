import { useState } from 'react'
import './Cashier.css'

function Cashier({ onBack }) {
  const drinks = ['Classic Pearl Milk Tea', 'Honey Pearl Milk Tea', 'Coffee Creama', 'Coffee Milk Tea w/ Coffee Jelly']
  const [cart, setCart] = useState([])
  const [tempDrink, setTempDrink] = useState('');
  const [tempQty, setTempQty] = useState(1);

  // removes drink from cart
  const removeFromCart = (drink) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart }
      if (updatedCart[drink] > 1) {
        updatedCart[drink] -= 1
      } else {
        delete updatedCart[drink]
      }
      return updatedCart
    })
  }

  // clears entire cart
  const clearCart = () => setCart({})

  return (
      <div className='cashier-container'>
        {/* left side of screen */}
        <div className='drink-section'>
          <h2>Choose a Drink</h2>
          <div className='drink-group'>
            {drinks.map((drink) => (
              <button
                key = {drink}
                className='drink-btn'
                onClick={() => setTempDrink(drink)}
              >
                {drink}
              </button>
            ))}
          </div>
          <h2>Choose Quantity</h2>
          <select
            value={tempQty}
            onChange={(e) => setTempQty(Number(e.target.value))}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <br />
          <p>Selected: {tempDrink} (Qty: {tempQty})</p>
          <button
            onClick={() => {
              if (!tempDrink) return;
              setCart((prevCart) => ({
                ...prevCart,
                [tempDrink]: (prevCart[tempDrink] || 0) + tempQty,
              }));
              setTempDrink('');
              setTempQty(1);
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* right side of screen */}
        <div className='cart-section'>
          <h2>Cart</h2>
          {Object.keys(cart).length === 0 ? (
            <p>No Drinks Yet</p>
          ) : (
            <ul className='cart-list'>
              {Object.entries(cart).map(([drink, quantity]) => (
                <li key={drink}>
                  <span>
                    {drink} x {quantity}
                  </span>
                  <button
                    className='remove-btn'
                    onClick={() => removeFromCart(drink)}  
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className='cart-controls'>
            <button className='clear-btn' onClick={clearCart}>
              Clear Cart
            </button>
            <button className='back-btn' onClick={onBack}>
              Go Back
            </button>
          </div>        
        </div>
      </div>

  )
}

export default Cashier
