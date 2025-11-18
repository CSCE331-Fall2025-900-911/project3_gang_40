import { useState, useEffect } from 'react';
import './Customer.css'
import Cart from './Cart';

function Customer({ onBack }) {
  const [currentView, setCurrentView] = useState('customer');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/drinks')
      .then(res => res.json())
      .then(data => setDrinks(data))
      .catch(err => console.error('Error fetching drinks:', err));
  }, []);

  const filteredDrinks = selectedCategory
    ? drinks.filter(d => d.drink_type === selectedCategory)
    : drinks;

  return (
    <>
      {/* cart view */}
      {currentView === 'cart' && (
        <Cart onBack={() => setCurrentView('customer')} />
      )}

      {/* kiosk view */}
      {currentView === 'customer' && (
        <div className='customer-container'>
          <div className='drinks-bar '>

            <button onClick={() => setSelectedCategory('Milky')}>Milky</button>
            <button onClick={() => setSelectedCategory('Fruity')}>Fruity</button>
            <button onClick={() => setSelectedCategory('Classic')}>Classic</button>
            <button onClick={() => setSelectedCategory('Special')}>Special</button>
            <button onClick={() => setSelectedCategory(null)}>Show All</button>

          </div>

          <div className='drink-container'>
            <h2>{selectedCategory ? `${selectedCategory} Drinks` : 'All Drinks'}</h2>

            <div className='drink-group'>
              {filteredDrinks.length > 0 ? (
                filteredDrinks.map(drink => (
                  <button
                    key={drink.drink_id}
                    className="drink-button"
                    onClick={() => console.log("Selected drink:", drink)}
                  >
                    <strong>{drink.drink_name}</strong>
                    <br />
                    ${Number(drink.base_price).toFixed(2)}
                  </button>
                ))
              ) : (
                <p>No drinks found</p>
              )}
            </div>
            

            <button onClick={onBack}>Exit</button>
          </div>

          <div className='cart-container'>
            <button onClick={() => setCurrentView('cart')}>Cart</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Customer;
