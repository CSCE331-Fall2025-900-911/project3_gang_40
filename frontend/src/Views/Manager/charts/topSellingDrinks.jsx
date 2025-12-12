import React, { useState, useEffect } from 'react';

function TopSellingDrinks() {
  const [timeFrame, setTimeFrame] = useState('Last Day');
  const [topSellers, setTopSellers] = useState([]);
  const [totals, setTotals] = useState({ total_quantity_sold: 0, total_sales_revenue: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllDrinks, setShowAllDrinks] = useState(false);


  const fetchTopSellers = async (selectedTimeFrame, expand = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://project3-gang-40-sjzu.onrender.com/api/top-selling-drinks?timeFrame=${encodeURIComponent(selectedTimeFrame)}${showAllDrinks ? '&showAll=true' : ''}`;
      const response = await fetch(url);
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
    setShowAllDrinks(false);
    setShowAllDrinks(false);
  };

  useEffect(() => {
    fetchTopSellers(timeFrame, showAllDrinks);
  }, [timeFrame, showAllDrinks]);

  const formatCurrency = (value) => {
    const num = Number(value || 0);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  const formatQuantity = (value) => {
    return Number(value || 0).toLocaleString();
  };

  return (
    <div className="widget-card">
      <h3 className="widget-title">
        {showAllDrinks ? 'All Drinks Sales Data' : 'Top 5 Best Selling Drinks'}
      </h3>
      
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
        <button 
          className="btn" 
          onClick={() => setShowAllDrinks(!showAllDrinks)}
          style={{ 
            background: showAllDrinks ? 'var(--green-600)' : 'var(--blue-600)',
            color: 'white'
          }}
        >
          {showAllDrinks ? 'Show Top 5 Only' : 'Expand to All Drinks'}
        </button>
      </div>


      {loading && <div className="loading">Loading sales data...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && topSellers.length === 0 && (
        <div className="error">No sales data available for this period.</div>
      )}

      {!loading && !error && topSellers.length > 0 && (
        <div>
          <div className="scrollable-table-container">
            <div className="scrollable-table-header">
              <div>Drink</div>
              <div>Quantity Sold</div>
              <div>Revenue</div>
            </div>
            {topSellers.map((drink, index) => {
              const revenue = Number(drink.total_revenue || 0);
              const quantity = Number(drink.quantity_sold || 0);
              
              return (
                <div key={drink.drink_name || index} className="scrollable-table-row">
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

          {/* Summary stays outside scrollable area */}
          <div style={{ 
            background: 'var(--blue-900)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            textAlign: 'center',
            color: 'var(--text-white)',
            marginTop: '1rem'
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
