function PaymentModal({ submitOrder, closeModal }) {
  return (
    <div className='modal-backdrop' onClick={closeModal}>
      <div className='modal-payment' onClick={e => e.stopPropagation()}>
        <h3>Select Payment Method</h3>
        <div className='payment-options'>
          <button className='payment-btn' onClick={() => submitOrder('Cash')}>Cash</button>
          <button className='payment-btn' onClick={() => submitOrder('Card')}>Card</button>
        </div>
        <button className='payment-cancel-btn' onClick={() => submitOrder(null, true)}>Void</button>
      </div>
    </div>
  );
}

export default PaymentModal;
