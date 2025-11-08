import { useState } from 'react'
import './Cashier.css'

function Cashier({ onBack }) {
  const drinks = ['Classic Pearl Milk Tea', 'Honey Pearl Milk Tea', 'Coffee Creama', 'Coffee Milk Tea w/ Coffee Jelly']
  const [cart, setCart] = useState([])

  // adds drink to cart
  const addToCart = (drink) => {
    setCart((prevCart) => ({
      ...prevCart,
      [drink]: (prevCart[drink] || 0) + 1,
    }))
  }

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
                onClick={() => addToCart(drink)}
              >
                {drink}
              </button>
            ))}
          </div>
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
