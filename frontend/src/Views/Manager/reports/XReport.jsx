import React, { useState } from 'react';

function XReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchXReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://project3-gang-40-sjzu.onrender.com/api/x-report');
      if (!response.ok) throw new Error('Failed to fetch X-Report');
      const data = await response.json();
      setReportData(data || []);
    } catch (err) {
      setError('Error generating X-Report: ' + err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `$${parseFloat(value || 0).toFixed(2)}`;

  const totals = {
    sales_count: reportData.reduce((sum, row) => sum + parseInt(row.sales_count || 0), 0),
    sales_total: reportData.reduce((sum, row) => sum + parseFloat(row.sales_total || 0), 0),
    returns_count: reportData.reduce((sum, row) => sum + parseInt(row.returns_count || 0), 0),
    returns_total: reportData.reduce((sum, row) => sum + parseFloat(row.returns_total || 0), 0),
    voids_count: reportData.reduce((sum, row) => sum + parseInt(row.voids_count || 0), 0),
    cash_total: reportData.reduce((sum, row) => sum + parseFloat(row.cash_total || 0), 0),
    card_total: reportData.reduce((sum, row) => sum + parseFloat(row.card_total || 0), 0),
  };

  return (
    <div className="widget-card">
      <h3 className="widget-title">X-Report (Today)</h3>
      
       <button 
        className="btn"
        onClick={fetchXReport}
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '1rem 2rem', 
          fontSize: '1.1rem',
          marginBottom: '1.5rem'
        }}
      >
        {loading ? 'Generating...' : 'Generate X-Report'}
      </button>

      {error && <div className="error">{error}</div>}

      {reportData.length > 0 && (
        <div style={{ background: 'var(--bg-dark)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ 
            background: 'var(--blue-800)', 
            color: 'var(--text-white)', 
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            X-REPORT - {new Date().toLocaleDateString()}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 0.8fr 1fr 0.8fr 1fr 0.6fr 1fr 1fr',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
            background: 'var(--blue-900)',
            color: 'var(--text-white)',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            <div>Hour</div><div>Sales</div><div>Sales$</div><div>Returns</div><div>Returns$</div><div>Voids</div><div>Cash$</div><div>Card$</div>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {reportData.map((row, index) => (
              <div key={row.hour_block || index} style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 0.8fr 1fr 0.8fr 1fr 0.6fr 1fr 1fr',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-blue)',
                alignItems: 'center',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                background: index % 2 === 0 ? 'var(--bg-darkest)' : 'transparent'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--text-light)' }}>{row.hour_block}</div>
                <div style={{ textAlign: 'right', color: 'var(--text-light)' }}>{row.sales_count}</div>
                <div style={{ textAlign: 'right', color: 'var(--green-400)', fontWeight: '600' }}>{formatCurrency(row.sales_total)}</div>
                <div style={{ textAlign: 'right', color: 'var(--text-light)' }}>{row.returns_count}</div>
                <div style={{ textAlign: 'right', color: row.returns_total < 0 ? 'var(--red-500)' : 'var(--text-muted)', fontWeight: '600' }}>
                  {formatCurrency(row.returns_total)}{row.returns_total < 0 && ' (R)'}
                </div>
                <div style={{ textAlign: 'right', color: 'var(--red-500)' }}>{row.voids_count}</div>
                <div style={{ textAlign: 'right', color: 'var(--cyan-500)', fontWeight: '600' }}>{formatCurrency(row.cash_total)}</div>
                <div style={{ textAlign: 'right', color: 'var(--blue-400)', fontWeight: '600' }}>{formatCurrency(row.card_total)}</div>
              </div>
            ))}
          </div>

          <div style={{ 
            background: 'var(--blue-900)', 
            padding: '1rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 0.8fr 1fr 0.8fr 1fr 0.6fr 1fr 1fr',
            gap: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            color: 'var(--text-white)',
            borderTop: '2px solid var(--blue-600)'
          }}>
            <div style={{ color: 'var(--text-muted)' }}>TOTAL</div>
            <div style={{ textAlign: 'right' }}>{totals.sales_count}</div>
            <div style={{ textAlign: 'right', color: 'var(--green-400)' }}>{formatCurrency(totals.sales_total)}</div>
            <div style={{ textAlign: 'right' }}>{totals.returns_count}</div>
            <div style={{ textAlign: 'right', color: 'var(--red-500)' }}>{formatCurrency(totals.returns_total)} (R)</div>
            <div style={{ textAlign: 'right', color: 'var(--red-500)' }}>{totals.voids_count}</div>
            <div style={{ textAlign: 'right', color: 'var(--cyan-500)' }}>{formatCurrency(totals.cash_total)}</div>
            <div style={{ textAlign: 'right', color: 'var(--blue-400)' }}>{formatCurrency(totals.card_total)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default XReport;
