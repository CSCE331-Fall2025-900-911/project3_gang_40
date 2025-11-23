function PaymentModal({ submitOrder, closeModal }) {
  return (
    <div className='modal-backdrop' onClick={closeModal}>
      <div className='modal-payment' onClick={e => e.stopPropagation()}>
        {/* select cash or card as payment method */}
        <h3>Select Payment Method</h3>
        <div className='payment-options'>
          <button className='payment-btn' onClick={() => submitOrder('Cash')}>Cash</button>
          <button className='payment-btn' onClick={() => submitOrder('Card')}>Card</button>
        </div>
        {/* button to void the order */}
        <button className='payment-cancel-btn' onClick={() => submitOrder(null, true)}>Void</button>
      </div>
    </div>
  );
}

export default PaymentModal;
