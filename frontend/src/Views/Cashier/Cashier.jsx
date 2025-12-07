import { useEffect, useState } from 'react'
import './Cashier.css'
import Returns from './Returns';
import Sidebar from './Sidebar';
import DrinkSection from './DrinkSection';
import CartSection from './CartSection';
import DrinkModal from './Modals/DrinkModal';
import EmployeeModal from './Modals/EmployeeModal';
import PaymentModal from './Modals/PaymentModal';
import {
  openModalHelper,
  addToCartHelper,
  removeFromCartHelper,
  addAnotherDrinkHelper,
  saveEditsHelper,
  clearCartHelper,
  calculateTotalPrice
} from './helpers';

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
    fetch('https://project3-gang-40-sjzu.onrender.com/api/drinks')
      .then(res => res.json())
      .then(data => setDrinks(data))
      .catch(err => console.error('Error fetching drinks:', err))
  }, []);

  // populate toppings from database
  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/toppings')
      .then(res => res.json())
      .then(data => setToppings(data))
      .catch(err => console.error('Error fetching toppings:', err))
  }, []);

  // gets drink sizes from database
  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/drinks/sizes')
      .then(res => res.json())
      .then(data => setSizes(data))
      .catch(err => console.error('Error fetching sizes:', err));
  }, []);

  // gets cashiers from employees table in database
  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/employees/cashiers')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error fetching employees:', err))
  }, []);

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

  // adds drink to cart
  const addToCart = () => addToCartHelper(selectedDrink, modifications, setCart, () => setSelectedDrink(null));

  // removes one drink at a time
  const removeFromCart = (index) => removeFromCartHelper(index, setCart);

  // adds another drink to cart
  const addAnotherDrink = (index) => addAnotherDrinkHelper(index, setCart);

  // saves edits to cart
  const saveEdits = () => saveEditsHelper(editingIndex, modifications, setCart, () => setSelectedDrink(null));

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
      const response = await fetch('https://project3-gang-40-sjzu.onrender.com/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          employee_id: currentEmployee.employee_id,
          customer_id: Math.floor(Math.random() * 200) + 1,
          payment_method: isVoid ? 'Null' : paymentMethod,
          sale_type: isVoid ? 'Void' : 'Sale',
          tax: 1.0825,
          isCustomerOrder: false,
          customerEmail: null 
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

  // open modal for drink customization
  const openModal = (drink, cartItem = null, index = null) => openModalHelper(
    drink, cartItem, index, setSelectedDrink,
    setModifications, setIsEditing, setEditingIndex
  );

  // close modal
  const closeModal = () => setSelectedDrink(null);

  // Calculate total
  const totalPrice = calculateTotalPrice(cart, sizes);













  return (
    <>
      {currentView === 'cashier' && (
        <div className='cashier-container'>

          {/* nav bar on far left */}
          <Sidebar
            currentEmployee={currentEmployee}
            buttons={[
              { label: 'Exit', onClick: onBack },
              { label: 'Change Employee', onClick: () => setShowEmployeeModal(true) },
              { label: 'Returns', onClick: handleReturnClick },
            ]}
          />

          {/* drink menu */}
          <DrinkSection drinks={drinks} openModal={openModal} />

          {/* cart */}
          <CartSection
            cart={cart}
            sizes={sizes}
            removeFromCart={removeFromCart}
            addAnotherDrink={addAnotherDrink}
            openModal={openModal}
            totalPrice={totalPrice}
            clearCart={clearCart}
            setShowPaymentModal={setShowPaymentModal}
          />

          {/* drink modifications pop up */}
          {selectedDrink && (
            <DrinkModal
              drink={selectedDrink}
              modifications={modifications || {}}
              setModifications={setModifications}
              toppings={toppings}
              sizes={sizes}
              isEditing={isEditing}
              saveEdits={saveEdits}
              addToCart={addToCart}
              closeModal={() => setSelectedDrink(null)}
            />
          )}

          {/* employee switcher modal */}
          {showEmployeeModal && (
            <EmployeeModal
              employees={employees}
              selectEmployee={(emp) => { setCurrentEmployee(emp); setShowEmployeeModal(false); }}
              closeModal={() => setShowEmployeeModal(false)}
            />
          )}

          {/* paymendt method modal */}
          {showPaymentModal && (
            <PaymentModal
              submitOrder={submitOrder}
              closeModal={() => setShowPaymentModal(false)}
            />
          )}

        </div>
      )}

      {/* set to returns view */}
      {currentView === 'returns' && (
        <Returns onBack={handleBack} currentEmployee={currentEmployee} />
      )}
    </>
  )
}

export default Cashier
