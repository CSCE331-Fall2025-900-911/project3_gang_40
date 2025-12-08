function DrinkModal({ drink, modifications, setModifications, toppings, sizes, isEditing, saveEdits, addToCart, closeModal }) {
  const noTopping = toppings.find(t => t.topping_name === 'No Toppings') || null;

  // modal for drink modifications pop up after selecting drink
  return (
    <div className='cashier-modal-backdrop' onClick={closeModal}>
      <div className='cashier-modal' onClick={e => e.stopPropagation()}>
        <h3>{drink.drink_name} Modifications</h3>

        {/* size selection with default as medium */}
        <div className="modal-section">
          <label>Size:</label>
          <select value={modifications.size_id} onChange={e => setModifications(prev => ({ ...prev, size_id: parseInt(e.target.value) }))}>
            {sizes.map(s => <option key={s.size_id} value={s.size_id}>{s.size_name}</option>)}
          </select>
        </div>

        {/* sweetness selection with default as normal */}
        <div className="modal-section">
          <label>Sweetness:</label>
          <select value={modifications.sweetness} onChange={e => setModifications(prev => ({ ...prev, sweetness: e.target.value }))}>
            <option>No Sugar (0%)</option>
            <option>Light (30%)</option>
            <option>Half (50%)</option>
            <option>Less (80%)</option>
            <option>Normal (100%)</option>
          </select>
        </div>

        {/* ice level selection with default as regular */}
        <div className="modal-section">
          <label>Ice:</label>
          <select value={modifications.ice} onChange={e => setModifications(prev => ({ ...prev, ice: e.target.value }))}>
            <option>No Ice</option>
            <option>Less</option>
            <option>Regular</option>
          </select>
        </div>

        {/* toppings button selector with no toppings as default - UPDATED */}
        <div className="modal-section">
          <label>Toppings:</label>
          <div className="option-grid toppings">
            {toppings.map(topping => {
              const isNoToppings = topping.topping_name === 'No Toppings';
              const isCurrentlySelected = modifications.selected_toppings?.some(t => t.topping_id === topping.topping_id) || false;
              
              return (
                <button
                  key={topping.topping_id}
                  className={`option-btn ${isCurrentlySelected ? 'selected' : ''}`}
                  onClick={() => {
                    setModifications(prev => {
                      let newSelectedToppings;
                      
                      if (isNoToppings && !isCurrentlySelected) {
                        // "No Toppings" clicked → clear all others
                        newSelectedToppings = [topping];
                      } else if (isNoToppings && isCurrentlySelected) {
                        // "No Toppings" deselected → empty array
                        newSelectedToppings = [];
                      } else if (!isNoToppings && !isCurrentlySelected) {
                        // Regular topping selected → remove "No Toppings" + add this one
                        newSelectedToppings = [
                          ...(prev.selected_toppings || []).filter(t => t.topping_name !== 'No Toppings'),
                          topping
                        ];
                      } else {
                        // Regular topping deselected → just remove it
                        newSelectedToppings = (prev.selected_toppings || []).filter(t => t.topping_id !== topping.topping_id);
                      }
                      
                      return { 
                        ...prev, 
                        selected_toppings: newSelectedToppings 
                      };
                    });
                  }}
                >
                  <span className="topping-name">{topping.topping_name}</span>
                  <span className="topping-price">${Number(topping.extra_cost).toFixed(2)}</span>
                </button>
              );
            })}
          </div>
          
          {/* Display selected toppings summary */}
          <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <div>Selected: {modifications.selected_toppings?.map(t => t.topping_name).join(', ') || 'None'}</div>
            <div style={{ color: 'var(--blue-400)', fontWeight: '500' }}>
              Total: +${(modifications.selected_toppings?.reduce((sum, t) => sum + Number(t.extra_cost), 0) || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* quantity slider with 1 as default */}
        <div className="modal-section">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={modifications.quantity}
            onChange={e => setModifications(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
            style={{ width: "60px", padding: "5px", borderRadius: "6px", border: "1px solid #ccc", textAlign: "center" }}
          />
        </div>

        {/* save changes or cancel button at bottom */}
        <div className="modal-actions">
          {isEditing ? <button className="confirm" onClick={saveEdits}>Save Changes</button> : <button className="confirm" onClick={addToCart}>Add to Cart</button>}
          <button className="cancel" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DrinkModal;
