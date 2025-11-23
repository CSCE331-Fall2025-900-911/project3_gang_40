import { useState } from "react";
import NavBar from "./NavBar";

function Cart({ cart, setCart, onBack, currentStep, onStepClick, onEditItem }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const calculateItemTotal = (item) => {
    let total = Number(item.drink.base_price) * item.quantity;
    if (item.modifications.topping && item.modifications.topping.extra_cost) {
      total += Number(item.modifications.topping.extra_cost) * item.quantity;
    }
    return total.toFixed(2);
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(calculateItemTotal(item)), 0).toFixed(2);
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
        tax: 1.0825
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
        setShowPaymentModal(false);
        setCart([]);
        onBack();
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
        onCartClick={() => {}}
        onExitClick={onBack}
        onStepClick={onStepClick}
      />

      <div className="cart-view">
        <div className="cart-header">
          <button className="cart-back-btn" onClick={onBack}>← Back</button>
          <h2>Your Cart</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <p>Add drinks to get started!</p>
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
                    <p><strong>Sweetness:</strong> {item.modifications.sweetness}</p>
                    <p><strong>Ice:</strong> {item.modifications.ice}</p>
                    <p>
                      <strong>Topping:</strong> {item.modifications.topping ? item.modifications.topping.topping_name : 'None'}
                      {item.modifications.topping && item.modifications.topping.extra_cost > 0 && 
                        ` (+$${Number(item.modifications.topping.extra_cost).toFixed(2)})`
                      }
                    </p>
                  </div>

                  <div className="cart-item-footer">
                    <span className="cart-item-price">${calculateItemTotal(item)}</span>
                    <div className="cart-item-actions">
                      <button className="edit-btn" onClick={() => onEditItem(index)}>Edit</button>
                      <button className="delete-btn" onClick={() => removeFromCart(index)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h3>Total: ${calculateCartTotal()}</h3>
            </div>

            <div className="cart-actions">
              <button className="continue-shopping-btn" onClick={onBack}>Continue Shopping</button>
              <button className="checkout-btn" onClick={() => setShowPaymentModal(true)}>Checkout</button>
            </div>
          </>
        )}

        {cart.length === 0 && (
          <button className="back-btn" onClick={onBack}>Back</button>
        )}
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Choose Payment Method</h2>
            <p>Total: ${calculateCartTotal()}</p>
            
            <div className="payment-options">
              <button 
                className="payment-btn payment-cash"
                onClick={() => handleCheckout('Cash')}
              >
                Cash
              </button>
              <button 
                className="payment-btn payment-card"
                onClick={() => handleCheckout('Card')}
              >
                Card
              </button>
            </div>

            <button 
              className="payment-cancel-btn"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;