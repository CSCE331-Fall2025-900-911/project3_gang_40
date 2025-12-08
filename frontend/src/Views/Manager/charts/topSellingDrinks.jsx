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
      setTopSellers(data.topDrinks);
      setTotals(data.totals);
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

  // Fetch data when timeFrame changes
  useEffect(() => {
    fetchTopSellers(timeFrame);
  }, [timeFrame]);

  const formatCurrency = (value) => {
    const num = Number(value || 0);
    return isNaN(num) ? '$0.00' : num.toFixed(2);
  };

  const formatQuantity = (value) => {
    return Number(value || 0).toLocaleString();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Top 5 Best Selling Drinks</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="timeFrame">Select Time Period: </label>
        <select 
          id="timeFrame"
          value={timeFrame} 
          onChange={onPickTimeFrame}
          style={{ padding: '5px 10px', fontSize: '16px' }}
        >
          <option>Last Day</option>
          <option>Last Week</option>
          <option>Last Month</option>
          <option>Last Year</option>
        </select>
      </div>

      {loading && <p>Loading sales data...</p>}
      
      {error && (
        <div style={{ color: 'red', background: '#fee', padding: '10px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {!loading && !error && topSellers.length > 0 && (
        <div>
          <div style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {topSellers.map((drink, index) => {
              const revenue = Number(drink.total_revenue || 0);
              const quantity = Number(drink.quantity_sold || 0);
              
              return (
                <div key={drink.drink_name || index} style={{ 
                padding: '8px 0', 
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between'
                }}>
                <span><strong>{index + 1}.</strong> {drink.drink_name}</span>
                <span>
                  {formatQuantity(drink.quantity_sold)} sold 
                  <br />
                  <small style={{ color: '#666' }}>${formatCurrency(drink.total_revenue)}</small>
                </span>
                </div>
              );
            })}
          </div>

          <div style={{ 
            background: '#e8f4f8', 
            padding: '15px', 
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <div>Total Period Summary:</div>
            <div>{formatQuantity(totals.total_quantity_sold)} drinks sold for ${formatCurrency(totals.total_sales_revenue)}</div>
          </div>
        </div>
      )}

      {!loading && !error && topSellers.length === 0 && (
        <p>No sales data available for this period.</p>
      )}
    </div>
  );
}

export default TopSellingDrinks;
