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
  );
}

export default CartSection;
