import { useState, useEffect } from 'react';
import './Customer.css'
import Cart from './Cart';
import DrinksCustomization from './DrinksCustomization';
import ToppingSelection from './ToppingSelection';
import NavBar from './NavBar';

function Customer({ onBack }) {
  const [currentView, setCurrentView] = useState('customer');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [cart, setCart] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modifications, setModifications] = useState({
    size_id: 2,
    sweetness: 'Normal (100%)',
    ice: 'Regular',
    topping: null,
    quantity: 1
  });
  

  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/drinks')
      .then(res => res.json())
      .then(data => setDrinks(data))
      .catch(err => console.error('Error fetching drinks:', err));
  }, []);

  // gets drink sizes from database
  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/drinks/sizes')
      .then(res => res.json())
      .then(data => setSizes(data))
      .catch(err => console.error('Error fetching sizes:', err));
  }, []);

  const filteredDrinks = selectedCategory
    ? drinks.filter(d => d.drink_type === selectedCategory)
    : drinks;

  // Handle editing cart item
  const handleEditItem = (index) => {
    const itemToEdit = cart[index];
    setSelectedDrink(itemToEdit.drink);
    setModifications(itemToEdit.modifications);
    setIsEditing(true);
    setEditingIndex(index);
    setCurrentView('customization');
  };

  // Handle navbar step clicks for navigation
  const handleStepClick = (step) => {
    switch(step) {
      case 1:
        setCurrentView('customer');
        break;
      case 2:
        if (selectedDrink) setCurrentView('customization');
        break;
      case 3:
        if (selectedDrink) setCurrentView('toppingSelection');
        break;
      case 4:
        setCurrentView('cart');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* cart view */}
      {currentView === 'cart' && (
        <Cart 
          cart={cart}
          setCart={setCart}
          onBack={() => setCurrentView('customer')}
          currentStep={4}
          onStepClick={handleStepClick}
          onEditItem={handleEditItem}
        />
      )}

      {/* toppings selection view */}
      {currentView === 'toppingSelection' && (
        <ToppingSelection
          drink={selectedDrink}
          modifications={modifications}
          setModifications={setModifications}
          onAddToCart={() => {
            // Find the size name for the selected size_id
            const selectedSize = sizes.find(s => s.size_id === modifications.size_id);
            const modificationWithSize = {
              ...modifications,
              size_name: selectedSize ? selectedSize.size_name : 'Unknown'
            };

            if (isEditing) {
              // Update existing item
              const updatedCart = [...cart];
              updatedCart[editingIndex] = { drink: selectedDrink, modifications: modificationWithSize, quantity: modifications.quantity };
              setCart(updatedCart);
              setIsEditing(false);
              setEditingIndex(null);
            } else {
              // Add new item
              setCart([...cart, { drink: selectedDrink, modifications: modificationWithSize, quantity: modifications.quantity }]);
            }
            setModifications({
              size_id: 2,
              sweetness: 'Normal (100%)',
              ice: 'Regular',
              topping: null,
              quantity: 1
            });
            setCurrentView('cart');
          }}
          onBack={() => setCurrentView('customization')}
          cart={cart}
          onCartClick={() => setCurrentView('cart')}
          currentStep={3}
          onStepClick={handleStepClick}
        />
      )}

      {/* customization view (sweetness/ice sliders) */}
      {currentView === 'customization' && (
        <DrinksCustomization 
          drink={selectedDrink}
          modifications={modifications}
          setModifications={setModifications}
          onNext={() => setCurrentView('toppingSelection')}
          onBack={() => setCurrentView('customer')}
          cart={cart}
          onCartClick={() => setCurrentView('cart')}
          currentStep={2}
          onStepClick={handleStepClick}
          sizes={sizes}
        />
      )}

      {/* kiosk view */}
      {currentView === 'customer' && (
        <div className='customer-page'>
          <div className='customer-container'>
            <div className='drinks-header'>
              <h1>Fresh Brew</h1>
              <p>Select Your Favorite Drink</p>
            </div>

            <div className='drinks-bar'>
              <button onClick={() => setSelectedCategory('Milky')}
                className={selectedCategory === 'Milky' ? 'active-drink-btn' : ''}>Milky</button>
              <button onClick={() => setSelectedCategory('Fruity')}
                className={selectedCategory === 'Fruity' ? 'active-drink-btn' : ''}>Fruity</button>
              <button onClick={() => setSelectedCategory('Classic')} 
                className={selectedCategory === 'Classic' ? 'active-drink-btn' : ''}>Classic</button>
              <button onClick={() => setSelectedCategory('Special')}
                className={selectedCategory === 'Special' ? 'active-drink-btn' : ''}>Special</button>
              <button onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'active-drink-btn' : ''}>Show All</button>
            </div>

            <div className='drink-container'>
              <h2>{selectedCategory ? `${selectedCategory} Drinks` : 'All Drinks'}</h2>

              <div className='drink-group-customer'>
                {filteredDrinks.length > 0 ? (
                  filteredDrinks.map(drink => (
                    <button
                      key={drink.drink_id}
                      className='drink-item-btn'
                      onClick={() => {
                        setSelectedDrink(drink);
                        setCurrentView('customization');
                      }}
                    >
                      <div className='drink-name'>{drink.drink_name}</div>
                      <div className='drink-price'>${Number(drink.base_price).toFixed(2)}</div>
                    </button>
                  ))
                ) : (
                  <p>No drinks found</p>
                )}
              </div>
            </div>
          </div>

          <NavBar 
            currentStep={1}
            cartCount={cart.length}
            onCartClick={() => setCurrentView('cart')}
            onExitClick={onBack}
            onStepClick={handleStepClick}
          />
        </div>
      )}
    </>
  );
}

export default Customer;
