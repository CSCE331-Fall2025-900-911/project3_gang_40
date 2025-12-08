function CartSection({ cart, sizes, removeFromCart, addAnotherDrink, openModal, totalPrice, clearCart, setShowPaymentModal }) {
  return (
    <div className='cart-section'>
      <h2>Cart</h2>
      <div className='cart-items-wrapper'>
        {cart.length === 0 ? (
          <p>No Drinks Yet</p>
        ) : (
          <ul className='cart-list'>
            {cart.map((item, idx) => {
              // Get size info
              const size = sizes.find(s => s.size_id === item.modifications.size_id) || { size_name: 'Medium', extra_cost: 0.50 };
              const sizeName = size.size_name;

              // Calculate item price (handles multiple toppings)
              const basePrice = Number(item.drink.base_price);
              const sizeExtra = Number(size.extra_cost);
              const toppingsExtra = (item.modifications.selected_toppings || []).reduce((sum, t) => sum + Number(t.extra_cost), 0);
              const itemPrice = (basePrice + toppingsExtra + sizeExtra) * Number(item.modifications.quantity);

              return (
                <li key={idx}>
                  <span className="cart-item-info">
                    <strong className="cart-item-name">
                      {item.modifications.quantity} x {item.drink.drink_name}
                    </strong>
                    <br />
                    <span className="cart-item-details">
                      ({sizeName}, {item.modifications.sweetness}, {item.modifications.ice}
                      {item.modifications.selected_toppings && item.modifications.selected_toppings.length > 0 ? (
                        ` + ${item.modifications.selected_toppings.map(t => t.topping_name).join(', ')}`
                      ) : ' + No Toppings'})
                    </span>
                    <br />
                    <span className="cashier-cart-item-price">${itemPrice.toFixed(2)}</span>
                  </span>
                  <div className="cart-item-buttons">
                    <button className='cart-remove-btn' onClick={() => removeFromCart(idx)}>-</button>
                    <button className='cart-add-btn' onClick={() => addAnotherDrink(idx)}>+</button>
                    <button className='cart-edit-btn' onClick={() => openModal(item.drink, item, idx)}>Edit</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className='cart-totals'>
        <h3 className="subttotal">Subtotal: ${totalPrice.toFixed(2)}</h3>
        <h3>Tax: ${(totalPrice * 0.0825).toFixed(2)}</h3>
        <h3>Total: ${(totalPrice * 1.0825).toFixed(2)}</h3>
        <div className='cart-controls'>
          <button className='clear-btn' onClick={clearCart}>Clear Cart</button>
          <button className='cashier-submit-btn' onClick={() => setShowPaymentModal(true)}>Submit Order</button>
        </div>
      </div>
    </div>
  );
}

export default CartSection;
