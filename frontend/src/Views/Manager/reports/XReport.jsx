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
      setReportData(data);
    } catch (err) {
      setError('Error generating X-Report: ' + err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px' }}>
      <h2>X-Report (Today)</h2>
      
      <button 
        onClick={fetchXReport}
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Generating...' : 'Generate X-Report'}
      </button>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#fee', 
          padding: '15px', 
          borderRadius: '8px',
          borderLeft: '4px solid #dc3545',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {reportData.length > 0 && (
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <div style={{ 
            background: '#495057', 
            color: 'white', 
            padding: '20px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            X-REPORT - {new Date().toLocaleDateString()}
          </div>

          {/* Table Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 0.8fr 1fr 0.8fr 1fr 0.6fr 1fr 1fr',
            gap: '8px',
            padding: '15px 20px',
            background: '#e9ecef',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            <div>Hour</div>
            <div>Sales</div>
            <div>Sales$</div>
            <div>Returns</div>
            <div>Returns$</div>
            <div>Voids</div>
            <div>Cash$</div>
            <div>Card$</div>
          </div>

          {/* Table Rows */}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {reportData.map((row, index) => (
              <div 
                key={row.hour_block || index}
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 0.8fr 1fr 0.8fr 1fr 0.6fr 1fr 1fr',
                  gap: '8px',
                  padding: '12px 20px',
                  borderBottom: '1px solid #dee2e6',
                  alignItems: 'center',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              >
                <div style={{ fontWeight: '600' }}>{row.hour_block}</div>
                <div style={{ textAlign: 'right' }}>{row.sales_count}</div>
                <div style={{ textAlign: 'right', color: '#28a745', fontWeight: '600' }}>
                  ${parseFloat(row.sales_total || 0).toFixed(2)}
                </div>
                <div style={{ textAlign: 'right' }}>{row.returns_count}</div>
                <div style={{ 
                  textAlign: 'right', 
                  color: row.returns_total < 0 ? '#dc3545' : '#6c757d',
                  fontWeight: '600'
                }}>
                  ${parseFloat(Math.abs(row.returns_total || 0)).toFixed(2)}
                  {row.returns_total < 0 && ' (R)'}
                </div>
                <div style={{ textAlign: 'right', color: '#dc3545' }}>
                  {row.voids_count}
                </div>
                <div style={{ textAlign: 'right', color: '#ffc107', fontWeight: '600' }}>
                  ${parseFloat(row.cash_total || 0).toFixed(2)}
                </div>
                <div style={{ textAlign: 'right', color: '#17a2b8', fontWeight: '600' }}>
                  ${parseFloat(row.card_total || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          {reportData.length > 0 && (
            <div style={{ 
              background: '#f1f3f4', 
              padding: '15px 20px',
              display: 'grid',
              gridTemplateColumns: '1fr 0.8fr 1fr 0.8fr 1fr 0.6fr 1fr 1fr',
              gap: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              borderTop: '3px solid #495057'
            }}>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>TOTAL</div>
              <div style={{ textAlign: 'right' }}>
                {reportData.reduce((sum, row) => sum + parseInt(row.sales_count || 0), 0)}
              </div>
              <div style={{ textAlign: 'right', color: '#28a745' }}>
                ${reportData.reduce((sum, row) => sum + parseFloat(row.sales_total || 0), 0).toFixed(2)}
              </div>
              <div style={{ textAlign: 'right' }}>
                {reportData.reduce((sum, row) => sum + parseInt(row.returns_count || 0), 0)}
              </div>
              <div style={{ textAlign: 'right', color: '#dc3545' }}>
                ${Math.abs(reportData.reduce((sum, row) => sum + parseFloat(row.returns_total || 0), 0)).toFixed(2)} (R)
              </div>
              <div style={{ textAlign: 'right', color: '#dc3545' }}>
                {reportData.reduce((sum, row) => sum + parseInt(row.voids_count || 0), 0)}
              </div>
              <div style={{ textAlign: 'right', color: '#ffc107' }}>
                ${reportData.reduce((sum, row) => sum + parseFloat(row.cash_total || 0), 0).toFixed(2)}
              </div>
              <div style={{ textAlign: 'right', color: '#17a2b8' }}>
                ${reportData.reduce((sum, row) => sum + parseFloat(row.card_total || 0), 0).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default XReport;
