import React, { useState } from 'react';

function ZReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateZReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://project3-gang-40-sjzu.onrender.com/api/z-report', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to generate Z-Report');
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError('Error generating Z-Report: ' + err.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `$${parseFloat(value || 0).toFixed(2)}`;

  if (reportData) {
    const { grossSales, returns, voids, cash, card, saleCount, returnCount, voidCount, totalWithoutTax, tax, netSales, startingCash = 150.00, expectedDrawer } = reportData;

    return (
      <div className="widget-card">
        <h3 className="widget-title">Z-Report (End of Day Summary)</h3>
        <div style={{ background: 'var(--bg-dark)', borderRadius: '12px', padding: '2rem', border: '2px solid var(--border-blue)' }}>
          <div style={{ 
            textAlign: 'center', marginBottom: '2rem',
            fontSize: '1.8rem', fontWeight: 'bold',
            color: 'var(--blue-400)',
            borderBottom: '3px solid var(--blue-600)',
            paddingBottom: '1rem'
          }}>Z-REPORT — END OF DAY SUMMARY</div>

          <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-light)' }}>
            <strong>Date:</strong> {new Date().toLocaleDateString()} | <strong>Time Closed:</strong> {new Date().toLocaleTimeString()}
          </div>
        
          {/* Sales Summary */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--green-400)', marginBottom: '1rem' }}>SALES SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', fontSize: '1.1rem' }}>
              <div>Gross Sales:</div><div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--text-light)' }}>{formatCurrency(grossSales)}</div>
              <div>Returns:</div><div style={{ textAlign: 'right', color: 'var(--red-500)', fontWeight: '600' }}>{formatCurrency(returns)}</div>
              <div>Net Sales:</div><div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--blue-400)' }}>{formatCurrency(netSales)}</div>
              <div>Tax (8.25%):</div><div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--cyan-500)' }}>{formatCurrency(tax)}</div>
              <div>Net Sales Before Tax:</div><div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--text-light)' }}>{formatCurrency(totalWithoutTax)}</div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--green-400)', marginBottom: '1rem' }}>PAYMENT BREAKDOWN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', fontSize: '1.1rem' }}>
              <div>Cash:</div><div style={{ textAlign: 'right', color: 'var(--cyan-500)', fontWeight: '600' }}>{formatCurrency(cash)}</div>
              <div>Card:</div><div style={{ textAlign: 'right', color: 'var(--blue-400)', fontWeight: '600' }}>{formatCurrency(card)}</div>
              <div><strong>TOTAL:</strong></div><div style={{ textAlign: 'right', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--green-400)' }}>{formatCurrency(grossSales)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-card">
      <h3 className="widget-title">Z-Report (End of Day Summary)</h3>
      <div style={{ textAlign: 'center' }}>
        <button className="btn" onClick={generateZReport} disabled={loading} style={{ 
          padding: '1.2rem 3rem', fontSize: '1.3rem', fontWeight: 'bold',
          background: 'var(--red-500)', minWidth: '250px'
        }}>
          {loading ? 'Generating...' : 'GENERATE Z-REPORT'}
        </button>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          This will mark today's sales as reported
        </p>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default ZReport;
