import { useState, useEffect } from 'react';
import DrinksCustomization from './DrinksCustomization';
import ToppingSelection from './ToppingSelection';
import NavBar from "./components/NavBar";
import '../Customer/css/Customer.css'
import Cart from './Cart';
//import translations from './components/translations';
import cartFeedback from "./assets/cart_feedback.png"
import berryLychee from "/assets/images/berry_lychee.png"
import classicPearl from "/assets/images/classic_pearl_milk_tea.png"
import classicTea from "/assets/images/classic_tea-removebg-preview.png"
import coconutPearlMilkTea from "/assets/images/coconut_pearl_milk_tea-removebg-preview.png"
import coffeeCreama from "/assets/images/coffee_creama-removebg-preview.png"
import coffeeMilkTeaWCoffeeJelly from "/assets/images/coffee_milk_tea_w_coffee_jelly-removebg-preview.png"
import goldenRetriever from "/assets/images/golden_retriever-removebg-preview.png"
import HokkaidoPearlMilkTea from "/assets/images/hokkaido_pearl_milk_tea-removebg-preview.png"
import honeyLemonade from "/assets/images/honey_lemonade-removebg-preview.png"
import honeyPearlMilkTea from "/assets/images/honey_pearl_milk_tea-removebg-preview.png"
import honeyTea from "/assets/images/honey_tea-removebg-preview.png"
import mangoPassionFruitTea from "/assets/images/mango_&_passion_fruit_tea-removebg-preview.png"
import mangoGreenMilkTea from "/assets/images/mango_green_milk_tea-removebg-preview.png"
import mangoGreenTea from "/assets/images/mango_green_tea-removebg-preview.png"
import passionChess from "/assets/images/passion_chess-removebg-preview.png"
import peachTeaWHoneyJelly from "/assets/images/peach_tea_w_honey_jelly-removebg-preview.png"
import taroPearlMilkTea from "/assets/images/taro_pearl_milk_tea-removebg-preview.png"
import thaiPearlMilkTea from "/assets/images/thai_pearl_milk_tea-removebg-preview.png"
import tigerBoba from "/assets/images/tiger_boba-removebg-preview.png"
import defaultDrink from "/assets/images/bubble-tea-clipart.png"

function Customer({ onBack, email, language = 'en' }) {
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
  const [showFeedback, setShowFeedback] = useState(false);
  const DRINK_IMAGE_MAP = {
    // Classic Drinks
    11: classicTea,
    12: honeyTea,

    // Milky Drinks
    1: classicPearl,
    2: honeyPearlMilkTea,
    3: coffeeCreama,
    4: coffeeMilkTeaWCoffeeJelly,
    5: HokkaidoPearlMilkTea,
    6: thaiPearlMilkTea,
    7: taroPearlMilkTea,
    8: mangoGreenMilkTea,
    9: goldenRetriever,
    10: coconutPearlMilkTea,
    19: tigerBoba,

    // Fruity Drinks
    13: mangoGreenTea,
    18: honeyLemonade,
    46: passionChess,
    47: berryLychee,
    48: peachTeaWHoneyJelly,
    49: mangoPassionFruitTea,

    // Note: If a drink_id is missing, the fallback logic will ensure it still displays the defaultDrink image.
  };

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

  useEffect(() => {
    if (window.google && window.google.translate) {
      const interval = setInterval(() => {
        const frame = document.querySelector('iframe.goog-te-menu-frame');
        if (frame) {
          frame.contentWindow.document.querySelectorAll('.goog-te-menu2-item span.text').forEach(span => {
            if (span.innerText === language) span.click();
          });
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [language]);



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
    switch (step) {
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
      <div id="google_translate_element"></div>

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
              size_name: selectedSize ? selectedSize.size_name : 'Unknown',
              size_extra_cost: selectedSize ? Number(selectedSize.extra_cost) : 0
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

            //VISUAL FEEDBACK FOR ADDING TO CART
            setShowFeedback(true);
            setTimeout(() => {
              setShowFeedback(false);
            }, 10000); //


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
                  filteredDrinks.map(drink => {
                    // Determine the image URL using drink_id lookup
                    const imageUrl = DRINK_IMAGE_MAP[drink.drink_id] || defaultDrink;

                    return (
                      <button
                        key={drink.drink_id}
                        className='drink-item-btn'
                        onClick={() => {
                          setSelectedDrink(drink);
                          setCurrentView('customization');
                        }}
                      >
                        {/* Display Image */}
                        <div className='drink-image-wrapper'>
                          <img 
                            src={imageUrl} 
                            alt={drink.drink_name} 
                            className="drink-btn-image" 
                          />
                        </div>
                        {/* Display Name and Price */}
                        <div className='drink-info-container'>
                          <div className='drink-name'>{drink.drink_name}</div>
                          <div className='drink-price'>${Number(drink.base_price).toFixed(2)}</div>
                        </div>
                      </button>
                    )
                  })
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

      {/* visual feedback */}
      {showFeedback && (
        <div className="cart-feedback-animation">
          <img src={cartFeedback} alt="Added to cart" className="cart-feedback-image" />
          <div className="feedback-message">Added to Cart!</div>
        </div>
      )}
    </>
  );
}

export default Customer;
