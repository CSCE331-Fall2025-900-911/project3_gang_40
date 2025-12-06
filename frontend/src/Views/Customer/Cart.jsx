import { useState } from "react";
import NavBar from "./components/NavBar";
import textKeys from './components/text';


function Cart({ cart, setCart, onBack, currentStep, onStepClick, onEditItem, translatedTexts, onOrderComplete  }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState(null);

  const calculateItemTotal = (item) => {
    let total = Number(item.drink.base_price);

    // Add size extra cost
    if (item.modifications.size_extra_cost) {
      total += Number(item.modifications.size_extra_cost);
    }

    // Add topping extra cost
    if (item.modifications.topping?.extra_cost) {
      total += Number(item.modifications.topping.extra_cost);
    }

    return (total * item.quantity).toFixed(2);
  };

  const calculateCartTotal = () => {
    return ((cart.reduce((sum, item) => sum + parseFloat(calculateItemTotal(item)), 0)) * 1.0825).toFixed(2);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handlePhoneNumber = (proceed) => {
    if (!proceed) {
      setPhoneNumber("");
    }

    if (pendingPaymentMethod) {
      handleCheckout(pendingPaymentMethod);
      setPendingPaymentMethod(null);
    }
  }

  const handleCheckout = async (paymentMethod) => {
    try {
      const orderData = {
        cart,
        employee_id: 1, // Customer kiosk uses default employee ID
        customer_id: Math.floor(Math.random() * 200) + 1,
        payment_method: paymentMethod,
        sale_type: 'Sale',
        tax: 1.0825,
        phoneNumber: phoneNumber || null
      };

      console.log('====== CUSTOMER CHECKOUT ======');
      console.log('Order Summary:');
      console.log('Payment Method:', paymentMethod);
      console.log('Cart Items:', cart.length);
      cart.forEach((item, idx) => {
        console.log(`  ${idx + 1}. ${item.drink.drink_name} x${item.quantity} - $${(Number(item.drink.base_price) * item.quantity).toFixed(2)}`);
        console.log(`     Sweetness: ${item.modifications.sweetness}, Ice: ${item.modifications.ice}, Topping: ${item.modifications.topping?.topping_name || 'None'}`);
      });
      console.log('Total: $' + calculateCartTotal());
      console.log('Sending to database...');
      console.log('Order Data:', orderData);

      const response = await fetch('https://project3-gang-40-sjzu.onrender.com/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Order submitted successfully. Sales ID:', data.salesId);
        alert(`Order submitted successfully. Sales ID: ${data.salesId}`);
        setShowPhoneNumberModal(false);
        if (onOrderComplete) onOrderComplete({ phoneNumber }); 
        return;
      } else {
        console.error('Failed to submit order:', data.message);
        alert(`Failed to submit order: ${data.message}`);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Error submitting order');
    }
  };

  return (
    <div className="cart-page">
      <NavBar
        currentStep={4}
        cartCount={cart.length}
        onCartClick={() => { }}
        onExitClick={onBack}
        onStepClick={onStepClick}
        translatedTexts={translatedTexts}
      />

      <div className="cart-view">
        <div className="cart-header">
          <button className="cart-back-btn" onClick={onBack}>← {translatedTexts.back || textKeys.back}</button>
          <h2>{translatedTexts.cartTitle || textKeys.cartTitle}</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>{translatedTexts.cartEmpty || textKeys.cartEmpty}</p>
            <p>{translatedTexts.cartEmptySubtext || textKeys.cartEmptySubtext}</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-header">
                    <h3>{item.drink.drink_name}</h3>
                    <span className="cart-item-quantity">Qty: {item.quantity}</span>
                  </div>

                  <div className="cart-item-customization">
                    <p><strong>{translatedTexts.size || textKeys.size}:</strong> {item.modifications.size_name || 'Unknown'}</p>
                    <p><strong>{translatedTexts.sweetness || textKeys.sweetness}:</strong> {item.modifications.sweetness}</p>
                    <p><strong>{translatedTexts.ice || textKeys.ice}:</strong> {item.modifications.ice}</p>
                    <p>
                      <p>
                        <strong>{translatedTexts.topping || textKeys.topping}:</strong> {item.modifications.topping ? item.modifications.topping.topping_name : 'None'}
                      </p>
                      {item.modifications.topping && item.modifications.topping.extra_cost > 0 &&
                        ` (+$${Number(item.modifications.topping.extra_cost).toFixed(2)})`
                      }
                    </p>
                  </div>

                  <div className="cart-item-footer">
                    <span className="cart-item-price">${calculateItemTotal(item)}</span>
                    <div className="cart-item-actions">
                      <button className="edit-btn" onClick={() => onEditItem(index)}>{translatedTexts.edit || textKeys.edit}</button>
                      <button className="delete-btn" onClick={() => removeFromCart(index)}>{translatedTexts.delete || textKeys.delete}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h3>{translatedTexts.total || textKeys.total}: ${calculateCartTotal()}</h3>
            </div>

            <div className="cart-actions">
              <button className="continue-shopping-btn" onClick={onBack}> {translatedTexts.continueShopping || textKeys.continueShopping}</button>
              <button className="checkout-btn" onClick={() => setShowPaymentModal(true)}>{translatedTexts.checkout || textKeys.checkout}</button>
            </div>
          </>
        )}

        {cart.length === 0 && (
          <button className="back-btn" onClick={onBack}>{translatedTexts.back || textKeys.back}</button>
        )}
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>{translatedTexts.choosePayment || textKeys.choosePayment}</h2>
            <p>{translatedTexts.total || textKeys.total}: ${calculateCartTotal()}</p>

            <div className="payment-options">
              <button
                className="payment-btn payment-cash"
                onClick={() => {
                  setPendingPaymentMethod('Cash');
                  setShowPaymentModal(false);
                  setShowPhoneNumberModal(true);
                 }}
              >
                {translatedTexts.cash || textKeys.cash}
              </button>
              <button
                className="payment-btn payment-card"
                onClick={() => {
                  setPendingPaymentMethod('Card');
                  setShowPaymentModal(false);
                  setShowPhoneNumberModal(true);
                 }}
              >
                {translatedTexts.card || textKeys.card}
              </button>
            </div>

            <button
              className="payment-cancel-btn"
              onClick={() => {setShowPaymentModal(false)}}
            >
              {translatedTexts.cancel || textKeys.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Modal for getting customers phone number */}
      {showPhoneNumberModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Enter Phone Number for Order Updates</h2>

            <input className="phone-number-input"
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="555-123-4567"
            />

            <div className="payment-options">
              <button className="payment-btn payment-card" 
                onClick={() => handlePhoneNumber(true)}>
                Submit
              </button>
              <button  className="payment-btn payment-card" 
                onClick={() => handlePhoneNumber(false)}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
      


    </div>
  );
}

export default Cart;