import React, { useState } from 'react';

function ReturnModal({ isOpen, closeModal, onConfirm }) {
  const [salesIdInput, setSalesIdInput] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const id = parseInt(salesIdInput);
    if (isNaN(id)) {
      alert('Please enter a valid Sales ID');
      return;
    }
    onConfirm(id);
    setSalesIdInput('');
    closeModal();
  };

  return (
    <div className='modal-backdrop' onClick={closeModal}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        <h3>Enter Sales ID</h3>
        <div className="modal-section">
          <input
            type="number"
            placeholder="Sales ID"
            value={salesIdInput}
            onChange={e => setSalesIdInput(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              textAlign: "center"
            }}
          />
        </div>
        <div className="modal-actions" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ReturnModal;