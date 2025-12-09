import React, { useState, useEffect } from 'react';

function ProductUsageReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductUsage = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://project3-gang-40-sjzu.onrender.com/api/product-usage?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
      );
      if (!response.ok) throw new Error('Failed to fetch report');
      const data = await response.json();
      setIngredients(data.ingredients || []);
    } catch (err) {
      setError('Error generating Product Usage Report: ' + err.message);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h2>Product Usage Report</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'end' }}>
        <div>
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '5px', fontSize: '16px' }}
          />
        </div>
        <div>
          <label>End Date: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '5px', fontSize: '16px' }}
          />
        </div>
        <button 
          onClick={fetchProductUsage}
          disabled={loading || !startDate || !endDate}
          style={{ 
            padding: '8px 16px', 
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#fee', 
          padding: '15px', 
          borderRadius: '8px',
          borderLeft: '4px solid #dc3545'
        }}>
          {error}
        </div>
      )}

      {ingredients.length > 0 && (
        <div style={{ background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ 
            background: '#343a40', 
            color: 'white', 
            padding: '15px 20px',
            fontWeight: 'bold'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 3 }}>PRODUCT USAGE REPORT</div>
              <div style={{ flex: 2, textAlign: 'right' }}>
                Period: {startDate} to {endDate}
              </div>
            </div>
          </div>

          {/* Table Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '3fr 0.8fr 1fr 1fr', 
            gap: '10px',
            padding: '15px 20px',
            background: '#e9ecef',
            fontWeight: '600',
            borderBottom: '2px solid #dee2e6'
          }}>
            <div>Ingredient Name</div>
            <div>Unit</div>
            <div>Used</div>
            <div>Remaining</div>
          </div>

          {/* Table Rows */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {ingredients.map((ingredient, index) => (
              <div 
                key={ingredient.ingredient_name || index}
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: '3fr 0.8fr 1fr 1fr',
                  gap: '10px',
                  padding: '12px 20px',
                  borderBottom: '1px solid #dee2e6',
                  alignItems: 'center'
                }}
              >
                <div style={{ 
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {ingredient.ingredient_name}
                </div>
                <div>{ingredient.unit}</div>
                <div style={{ textAlign: 'right', fontWeight: '600' }}>
                  {parseFloat(ingredient.total_used || 0).toFixed(2)}
                </div>
                <div style={{ textAlign: 'right', color: '#28a745', fontWeight: '600' }}>
                  {parseFloat(ingredient.current_stock || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ 
            background: '#f1f3f4', 
            padding: '15px 20px',
            textAlign: 'center',
            fontStyle: 'italic',
            borderTop: '2px solid #dee2e6'
          }}>
            Report generated successfully.
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductUsageReport
