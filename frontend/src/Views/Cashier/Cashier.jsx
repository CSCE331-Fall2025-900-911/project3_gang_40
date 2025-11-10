import { useEffect, useState } from 'react'
import './Cashier.css'
import Returns from './Returns';

function Cashier({ onBack }) {
  const [currentView, setCurrentView] = useState('cashier')
  // create empty list for drinks and toppings
  const [drinks, setDrinks] = useState([])
  const [toppings, setToppings] = useState([])
  const [cart, setCart] = useState([])
  const [selectedDrink, setSelectedDrink] = useState(null);
  // set default drink modification values
  const [modifications, setModifications] = useState({
    size_id: 2, sweetness: 'Normal (100%)', ice: 'Regular', topping: null, quantity: '1'
  });
  const [sizes, setSizes] = useState([]);
  // checks if adding a new drink or editing one
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  // employee switcher
  const [employees, setEmployees] = useState([])
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  // payment option selector
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // for switching views 
  const handleReturnClick = () => setCurrentView('returns');
  const handleBack = () => setCurrentView('cashier');

  // populate drinks from database
  useEffect(() => {
    fetch('http://localhost:5001/api/drinks')
      .then(res => res.json())
      .then(data => setDrinks(data))
      .catch(err => console.error('Error fetching drinks:', err))
  }, []);

   // populate toppings from database
  useEffect(() => {
    fetch('http://localhost:5001/api/toppings')
      .then(res => res.json())
      .then(data => setToppings(data))
      .catch(err => console.error('Error fetching toppings:', err))
  }, []);

  // gets drink sizes from database
  useEffect(() => {
    fetch('http://localhost:5001/api/drinks/sizes')
      .then(res => res.json())
      .then(data => setSizes(data))
      .catch(err => console.error('Error fetching sizes:', err));
  }, []);

  // fetch employees when opening employee modal
  const openEmployeeModal = () => {
    setShowEmployeeModal(true) 
    if (employees.length === 0) {
      fetch('http://localhost:5001/api/employees/cashiers')
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.error('Error fetching employees:', err))
    }
  }

  // close employee modal
  const closeEmployeeModal = () => setShowEmployeeModal(false)

  // select employee from modal
  const handleEmployeeSelect = (employee) => {
    setCurrentEmployee(employee)
    closeEmployeeModal()
  }

  // keeps employee signed in with page refresh
  useEffect(() => {
    const saved = localStorage.getItem('currentEmployee')
    if (saved) setCurrentEmployee(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (currentEmployee) {
      localStorage.setItem('currentEmployee', JSON.stringify(currentEmployee))
    }
  }, [currentEmployee])

  // open modal for drink customization
  const openModal = (drink, existingDrink = null, index = null) => {
    if (toppings.length === 0) {
      console.warn('Toppings not loaded yet');
      return;
    }
    const noTopping = toppings.find(t => t.topping_name === 'No Toppings') || null;

    // edits drink in cart
    if (existingDrink) {
      setSelectedDrink(drink)
      setModifications(existingDrink.modifications)
      setIsEditing(true)
      setEditingIndex(index)
    } 
    // adds a new drink to cart
    else {
      setSelectedDrink(drink)
      setModifications({size_id: 2, sweetness: 'Normal (100%)', ice: 'Regular', topping: noTopping, quantity: 1});
      setIsEditing(false)
      setEditingIndex(null)
    }
  };

  // close modal
  const closeModal = () => setSelectedDrink(null);

  // saves edits to cart
  const saveEdits = () => {
    setCart(prev => {
      const updated = [...prev];
      updated[editingIndex] = {
        ...updated[editingIndex], modifications: modifications
      };
      return updated;
    });
    closeModal();
  }

  // adds drink to cart
  const addToCart = () => {
    if (!selectedDrink) return;
    setCart(prev => [
      ...prev,
      { drink: selectedDrink, modifications, quantity: modifications.quantity }
    ]);
    closeModal();
  }

  // removes one drink at a time
  const removeFromCart = (index) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];

      if (item.modifications.quantity > 1) {
        newCart[index] = {
          ...item, modifications: {...item.modifications, quantity: item.modifications.quantity - 1}
        };
      } else {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  // adds another drink to cart
  const addAnotherDrink = (index) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];

      newCart[index] = {
        ...item, modifications: {...item.modifications, quantity: item.modifications.quantity + 1}
      };
      return newCart
    });
  }

  // clears entire cart
  const clearCart = () => setCart([])

  // sumits order to database
  const submitOrder = async (paymentMethod = null, isVoid = false) => {
    if (!currentEmployee) {
      alert('Employee not selected');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      // get values needed for inserting into databse
      const response = await fetch('http://localhost:5001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          employee_id: currentEmployee.employee_id,
          customer_id: Math.floor(Math.random() * 200) + 1,
          payment_method: isVoid ? 'Null' : paymentMethod,
          sale_type: isVoid ? 'Void' : 'Sale',
          tax: 1.0825
        })
      });

      // show alert in window that purchase went through or failed
      const data = await response.json();
      if (response.ok) {
        alert(
          isVoid ? `Void purchase recorded. Sales ID: ${data.salesId}`
          : `Order submitted successfully. Sales ID: ${data.salesId}`
        );
        clearCart();
        setShowPaymentModal(false);
      } else {
        alert(`Failed to submit order: ${data.message}`);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Error submitting order');
    }
  };

    // Calculate total
  const totalPrice = cart.reduce((sum, item) => {
    const base = Number(item.drink.base_price);
    const toppingPrice = Number(item.modifications.topping?.extra_cost || 0);
    const sizeExtra = Number(sizes.find(s => s.size_id === item.modifications.size_id)?.extra_cost || 0);
    const quantity = Number(item.modifications.quantity);
    return sum + (base + toppingPrice + sizeExtra) * quantity;
  }, 0);

  return (
    <>
    {currentView === 'cashier' && (
      <div className='cashier-container'>

        {/* nav bar on far left */}
        <nav className='sidebar'>
          {/* top half of nav bar */}
          <div>
            <h2>Menu</h2>
            <ul>
              <li><button onClick={onBack}>Exit</button></li>
              <li><button onClick={openEmployeeModal}>Change Employee</button></li>
              <li><button onClick={handleReturnClick}>Returns</button></li>
              {/* to add more nav spots later */}
            </ul>
          </div>
          
          {/* bottom half of nav bar */}
          {/* shows current employee */}
          {currentEmployee ? (
            <div>
              Signed in as: <br />
              <strong>{currentEmployee.first_name} {currentEmployee.last_name}</strong>
              <br />({currentEmployee.role})
            </div>
          ) : (
            <div>No employee signed in</div>
          )}
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

          <div className='cart-items-wrapper'>
            {cart.length === 0 ? (
              <p>No Drinks Yet</p>
            ) : (
              <ul className='cart-list'>
                {/* shows item details */}
                {cart.map((item, idx) => {
                  const size = sizes.find(s => s.size_id === item.modifications.size_id) || { size_name: 'Unknown', extra_cost: 0 };
                  const itemPrice = (Number(item.drink.base_price) + Number(item.modifications.topping?.extra_cost || 0) + Number(size.extra_cost)) * Number(item.modifications.quantity);
                  const sizeName = size.size_name;

                  return (
                    <li key={idx}>
                      <span className="cart-item-info">
                        <strong className="cart-item-name">{item.modifications.quantity} x {item.drink.drink_name}</strong>
                        <br />
                        <span className="cart-item-details">
                          ({sizeName}, {item.modifications.sweetness}, {item.modifications.ice}
                          {item.modifications.topping ? ` + ${item.modifications.topping.topping_name}` : ''})
                        </span>
                        <br />
                        <span className="cart-item-price">${itemPrice.toFixed(2)}</span>
                      </span>
                      <div className="cart-item-buttons">
                        <button className='remove-btn' onClick={() => removeFromCart(idx)}>-</button>
                        <button className='add-btn' onClick={() => addAnotherDrink(idx)}>+</button>
                        <button className='edit-btn' onClick={() => openModal(item.drink, item, idx)}>Edit</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* totals at bottom of cart */}
          <div className='cart-totals'>
            <h3>Subtotal: ${totalPrice.toFixed(2)}</h3>
            <h3>Tax: ${(totalPrice * 0.0825).toFixed(2)}</h3>
            <h3>Total: ${(totalPrice * 1.0825).toFixed(2)}</h3>
            <div className='cart-controls'>
              <button className='clear-btn' onClick={clearCart}>Clear Cart</button>
              <button className='submit-btn' onClick={() => setShowPaymentModal(true)}>Submit Order</button>
            </div>
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
                  value={modifications.size_id}
                  onChange={e => setModifications(prev => ({ ...prev, size_id: parseInt(e.target.value) }))}
                >
                  {sizes.map(s => (
                    <option key={s.size_id} value={s.size_id}>
                      {s.size_name}
                    </option>
                  ))}
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
                {isEditing ? (
                  <button onClick={saveEdits}>Save Changes</button>
                ) : (
                  <button onClick={addToCart}>Add to Cart</button>
                )}
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>

          </div>
        )} 

        {/* employee switcher modal */}
        {showEmployeeModal && (
          <div className='modal-backdrop' onClick={closeEmployeeModal}>
            <div className='modal-employees' onClick={e => e.stopPropagation()}>
              <h3>Select Employee</h3>
              {employees.length > 0 ? (
                <ul style={{listStyleType: 'none', padding: 0, margin: 0 }}>
                  {employees.map(employee => (
                    <li key={employee.employee_id} style={{ marginBottom: '8px' }}>
                      <button
                        onClick={() => handleEmployeeSelect(employee)}
                        style={{width: '80%', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                          {employee.first_name} {employee.last_name} - {employee.role}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading employees...</p>
              )}
              <button onClick={closeEmployeeModal} style = {{width: '100px', height: '30px', cursor: 'pointer', marginTop: '30px'}}>Cancel</button>
            </div>
          </div>
        )}

        {showPaymentModal && (
          <div className='modal-backdrop' onClick={() => setShowPaymentModal(false)}>
            <div className='modal-payment' onClick={e => e.stopPropagation()}>
              <h3>Select Payment Method</h3>
              <div className='payment-options'>
                <button className='payment-btn' onClick={() => {
                    submitOrder('Cash');
                  }}  
                >
                  Cash
                </button>
                <button className='payment-btn' onClick={() => {
                    submitOrder('Card');
                  }}
                >
                  Card
                </button>
              </div>
              <button className='payment-cancel-btn' onClick={() => {
                  submitOrder(null, true);
                }}
              >
                Void
              </button>
            </div>
          </div>
        )}


      </div>
    )}

    {currentView === 'returns' && (
      <Returns onBack={handleBack} />
    )}
    </>
  )
}

export default Cashier
