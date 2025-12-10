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

  const formatNumber = (value) => parseFloat(value || 0).toFixed(2);

  return (
    <div className="widget-card">
      <h3 className="widget-title">Product Usage Report</h3>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', color: 'var(--text-light)', marginBottom: '0.5rem' }}>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button className="btn" onClick={fetchProductUsage} disabled={loading || !startDate || !endDate}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {ingredients.length > 0 && (
        <div style={{ background: 'var(--bg-dark)', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ 
            background: 'var(--blue-800)', 
            color: 'var(--text-white)', 
            padding: '1.5rem', 
            fontWeight: 'bold'
          }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <div style={{ flex: 3 }}>PRODUCT USAGE REPORT</div>
              <div style={{ flex: 2, textAlign: 'right' }}>Period: {startDate} to {endDate}</div>
            </div>
          </div>

          {/* Table Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '3fr 0.8fr 1fr 1fr', 
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'var(--blue-900)',
            color: 'var(--text-white)',
            fontWeight: '600'
          }}>
            <div>Ingredient Name</div>
            <div>Unit</div>
            <div>Used</div>
            <div>Remaining</div>
          </div>

          {/* Table Rows */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {ingredients.map((ingredient, index) => (
              <div key={ingredient.ingredient_name || index} style={{ 
                display: 'grid',
                gridTemplateColumns: '3fr 0.8fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-blue)',
                alignItems: 'center',
                background: index % 2 === 0 ? 'var(--bg-darkest)' : 'var(--bg-dark)'
              }}>
                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ingredient.ingredient_name}
                </div>
                <div>{ingredient.unit}</div>
                <div style={{ textAlign: 'right', color: 'var(--cyan-500)', fontWeight: '600' }}>
                  {formatNumber(ingredient.total_used)}
                </div>
                <div style={{ textAlign: 'right', color: 'var(--green-400)', fontWeight: '600' }}>
                  {formatNumber(ingredient.current_stock)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            background: 'var(--blue-900)', 
            padding: '1.5rem', 
            textAlign: 'center',
            color: 'var(--text-light)',
            fontStyle: 'italic'
          }}>
            Report generated successfully.
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductUsageReport;
