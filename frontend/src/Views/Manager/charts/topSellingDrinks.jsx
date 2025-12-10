import React, { useState, useEffect } from 'react';

function TopSellingDrinks() {
  const [timeFrame, setTimeFrame] = useState('Last Day');
  const [topSellers, setTopSellers] = useState([]);
  const [totals, setTotals] = useState({ total_quantity_sold: 0, total_sales_revenue: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopSellers = async (selectedTimeFrame) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://project3-gang-40-sjzu.onrender.com/api/top-selling-drinks?timeFrame=${encodeURIComponent(selectedTimeFrame)}`);
      if (!response.ok) throw new Error('Failed to fetch sales data');
      const data = await response.json();
      setTopSellers(data.topDrinks || []);
      setTotals(data.totals || { total_quantity_sold: 0, total_sales_revenue: 0 });
    } catch (err) {
      setError('Failed to load sales data: ' + err.message);
      setTopSellers([]);
      setTotals({ total_quantity_sold: 0, total_sales_revenue: 0 });
    } finally {
      setLoading(false);
    }
  };

  const onPickTimeFrame = (event) => {
    const selected = event.target.value;
    setTimeFrame(selected);
  };

  useEffect(() => {
    fetchTopSellers(timeFrame);
  }, [timeFrame]);

  // ✅ FIXED: Safe number parsing functions
  const formatCurrency = (value) => {
    const num = Number(value || 0);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  const formatQuantity = (value) => {
    return Number(value || 0).toLocaleString();
  };

  return (
    <div className="widget-card">
      <h3 className="widget-title">Top 5 Best Selling Drinks</h3>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label htmlFor="timeFrame" style={{ color: 'var(--text-light)' }}>Time Period: </label>
        <select 
          id="timeFrame"
          value={timeFrame} 
          onChange={onPickTimeFrame}
          style={{ flex: 1, maxWidth: '200px' }}
        >
          <option>Last Day</option>
          <option>Last Week</option>
          <option>Last Month</option>
          <option>Last Year</option>
        </select>
        <button className="btn" onClick={() => fetchTopSellers(timeFrame)}>
          Refresh
        </button>
      </div>

      {loading && <div className="loading">Loading sales data...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && topSellers.length === 0 && (
        <div className="error">No sales data available for this period.</div>
      )}

      {!loading && !error && topSellers.length > 0 && (
        <div>
          {/* Top Sellers List */}
          <div className="report-table" style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr', 
              gap: '1rem',
              padding: '1rem',
              background: 'var(--blue-800)',
              color: 'var(--text-white)',
              fontWeight: '600'
            }}>
              <div>Drink</div>
              <div>Quantity Sold</div>
              <div>Revenue</div>
            </div>
            {topSellers.map((drink, index) => {
              const revenue = Number(drink.total_revenue || 0);  // ✅ SAFE PARSE
              const quantity = Number(drink.quantity_sold || 0);  // ✅ SAFE PARSE
              
              return (
                <div key={drink.drink_name || index} style={{ 
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-blue)',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: '500' }}>
                    <span style={{ color: 'var(--blue-400)' }}>{index + 1}.</span> {drink.drink_name}
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--cyan-500)' }}>
                    {formatQuantity(quantity)}
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--green-400)' }}>
                    {formatCurrency(revenue)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ 
            background: 'var(--blue-900)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            textAlign: 'center',
            color: 'var(--text-white)'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Total Period Summary:
            </div>
            <div>
              {formatQuantity(totals.total_quantity_sold)} drinks sold for {formatCurrency(totals.total_sales_revenue)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopSellingDrinks;
