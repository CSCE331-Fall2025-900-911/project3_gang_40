import { useState } from "react";
import NavBar from "./components/NavBar";
import textKeys from './components/text';



function Cart({ cart, setCart, onBack, currentStep, onStepClick, onEditItem, translatedTexts, onOrderComplete, email, largeMode, }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const calculateItemTotal = (item) => {
  let total = Number(item.drink.base_price);
  
  // Add size extra cost
  if (item.modifications.size_extra_cost) {
    total += Number(item.modifications.size_extra_cost);
  }
  
  if (item.modifications.selected_toppings) {
    total += item.modifications.selected_toppings.reduce((sum, topping) => {
      return sum + Number(topping.extra_cost || 0);
    }, 0);
  }
  
  return (total * item.quantity).toFixed(2);
};

  const calculateCartTotal = () => {
    return ((cart.reduce((sum, item) => sum + parseFloat(calculateItemTotal(item)), 0)) * 1.0825).toFixed(2);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };


  const handleCheckout = async (paymentMethod) => {
    try {
      const orderData = {
        cart,
        employee_id: 1, // Customer kiosk uses default employee ID
        customer_id: Math.floor(Math.random() * 200) + 1,
        payment_method: paymentMethod,
        sale_type: 'Sale',
        tax: 1.0825,
        isCustomerOrder: true,
        customerEmail: email 
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

        if (onOrderComplete) onOrderComplete(); 
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
    
    <div className={`cart-page ${largeMode ? 'cart-page--large' : ''}`}>
      <NavBar
        currentStep={4}
        cartCount={cart.length}
        onCartClick={() => { }}
        onExitClick={onBack}
        onStepClick={onStepClick}
        translatedTexts={translatedTexts}
        largeMode={largeMode}
      />

      <div className={`cart-view ${largeMode ? 'cart-view--large' : ''}`}>
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
                      <strong>{translatedTexts.topping || textKeys.topping}:{" "}</strong> 
                      {(item.modifications.selected_toppings || []).length > 0 
                        ? (item.modifications.selected_toppings || []).map(t => t.topping_name).join(', ')
                        : 'None'
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
              <h3>{translatedTexts.subTotal || textKeys.subTotal}: ${(calculateCartTotal() / 1.0825).toFixed(2)}</h3>
              <h3>{translatedTexts.tax || textKeys.tax}: ${(calculateCartTotal() - calculateCartTotal() / 1.0825).toFixed(2)}</h3>
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
        <div className={`payment-modal-overlay ${largeMode ? 'payment-modal-overlay--large' : ''}`}>
          <div className={`payment-modal ${largeMode ? 'payment-modal--large' : ''}`}>
            <h2>{translatedTexts.choosePayment || textKeys.choosePayment}</h2>
            <p>{translatedTexts.total || textKeys.total}: ${calculateCartTotal()}</p>

            <div className="payment-options">
              <button
                className="payment-btn payment-cash"
                onClick={() => {
                  setSelectedPayment("Cash");
                  setShowCardForm(false);
                  handleCheckout("Cash");
                }}
              >
                {translatedTexts.cash || textKeys.cash}
              </button>

              <button
                className="payment-btn payment-card"
                onClick={() => {
                  setSelectedPayment("Card");
                  setShowCardForm(true);  // show fake card inputs
                }}
              >
                {translatedTexts.card || textKeys.card}
              </button>
            </div>

            {showCardForm && selectedPayment === "Card" && (
              <div className="card-form">
                <h3>Enter Card Details</h3>

                <div className="card-form-field">
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="card-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="card-form-field">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    className="card-input"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Customer Name"
                  />
                </div>

                <div className="card-form-row">
                  <div className="card-form-field">
                    <label>Expiry</label>
                    <input
                      type="text"
                      className="card-input"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="card-form-field">
                    <label>CVV</label>
                    <input
                      type="password"
                      className="card-input"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </div>

                <button
                  className="payment-btn payment-card"
                  onClick={() => {
                    // Optionally add simple fake validation here
                    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                      alert("Please fill in all card fields.");
                      return;
                    }
                    handleCheckout("Card");
                  }}
                >
                  Pay with Card
                </button>
              </div>
            )}


            <button
              className="payment-cancel-btn"
              onClick={() => {setShowPaymentModal(false)}}
            >
              {translatedTexts.cancel || textKeys.cancel}
            </button>
          </div>
        </div>
      )} 

    </div>
  );
}

export default Cart;