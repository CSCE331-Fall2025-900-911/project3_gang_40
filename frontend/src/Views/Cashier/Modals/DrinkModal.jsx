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

        {/* toppings button selector with no toppings as default */}
        <div className="modal-section">
        <label>Toppings:</label>
        <div className="toppings-options">
          {toppings.map(topping => {
            const isNoToppings = topping.topping_name === 'No Toppings';
            const isCurrentlySelected = modifications.selected_toppings?.some(t => t.topping_id === topping.topping_id) || false;
            
            return (
              <label key={topping.topping_id} className="topping-checkbox">
                <input
                  type="checkbox"
                  checked={isCurrentlySelected}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setModifications(prev => {
                      let newSelectedToppings;
                      
                      if (isNoToppings && isChecked) {
                        // "No Toppings" selected → clear all others
                        newSelectedToppings = [topping];
                      } else if (isNoToppings && !isChecked) {
                        // "No Toppings" deselected → keep others or empty
                        newSelectedToppings = (prev.selected_toppings || []).filter(t => t.topping_id !== 11);
                      } else if (!isNoToppings && isChecked) {
                        // Regular topping selected → remove "No Toppings" + add this one
                        newSelectedToppings = [
                          ...(prev.selected_toppings || []).filter(t => t.topping_id !== 11),
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
                />
                <span>{topping.topping_name} (+${Number(topping.extra_cost).toFixed(2)})</span>
              </label>
            );
          })}
        </div>
        <div>
          <div>Selected: {modifications.selected_toppings?.map(t => t.topping_name).join(', ') || 'None'}</div>
          <div>
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
          {isEditing ? <button onClick={saveEdits}>Save Changes</button> : <button onClick={addToCart}>Add to Cart</button>}
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DrinkModal;
