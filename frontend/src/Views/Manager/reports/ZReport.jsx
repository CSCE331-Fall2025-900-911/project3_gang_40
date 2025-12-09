import React, { useState } from 'react';

function ZReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [managerName] = useState('Manager Name'); // Replace with actual manager state

  const generateZReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://project3-gang-40-sjzu.onrender.com/api/z-report', {
        method: 'POST' // Use POST since it modifies data (marks as reported)
      });
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

  if (reportData) {
    const {
      grossSales, returns, voids, cash, card, saleCount, returnCount, voidCount,
      totalWithoutTax, tax, netSales, startingCash = 150.00, expectedDrawer
    } = reportData;

    return (
      <div style={{ padding: '20px', maxWidth: '800px', fontFamily: 'monospace' }}>
        <h2>Z-Report (End of Day Summary)</h2>
        
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: '12px', 
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '2px solid #495057'
        }}>
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#495057',
            borderBottom: '3px solid #495057',
            paddingBottom: '15px'
          }}>
            Z-REPORT — END OF DAY SUMMARY
          </div>

          <div style={{ marginBottom: '10px', fontSize: '16px' }}>
            <strong>Date:</strong> {new Date().toLocaleDateString()}&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>Time Closed:</strong> {new Date().toLocaleTimeString()}
          </div>
          <div style={{ marginBottom: '30px', fontSize: '16px' }}>
            <strong>Manager:</strong> {managerName}
          </div>

          {/* Sales Summary */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>
              SALES SUMMARY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', fontSize: '16px' }}>
              <div>Gross Sales:</div><div style={{ textAlign: 'right', fontWeight: '600' }}>${grossSales?.toFixed(2)}</div>
              <div>Returns:</div><div style={{ textAlign: 'right', color: '#dc3545', fontWeight: '600' }}>${Math.abs(returns).toFixed(2)}</div>
              <div>Net Sales:</div><div style={{ textAlign: 'right', fontWeight: '600', color: '#007bff' }}>${netSales?.toFixed(2)}</div>
              <div>Tax (8.25%):</div><div style={{ textAlign: 'right', fontWeight: '600', color: '#ffc107' }}>${tax?.toFixed(2)}</div>
              <div>Net Sales Before Tax:</div><div style={{ textAlign: 'right', fontWeight: '600' }}>${totalWithoutTax?.toFixed(2)}</div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>
              PAYMENT BREAKDOWN
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', fontSize: '16px' }}>
              <div>Cash:</div><div style={{ textAlign: 'right', color: '#ffc107', fontWeight: '600' }}>${cash?.toFixed(2)}</div>
              <div>Card:</div><div style={{ textAlign: 'right', color: '#17a2b8', fontWeight: '600' }}>${card?.toFixed(2)}</div>
              <div><strong>TOTAL:</strong></div><div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>${grossSales?.toFixed(2)}</div>
            </div>
          </div>

          {/* Cash Drawer Summary */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>
              CASH DRAWER SUMMARY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', fontSize: '16px' }}>
              <div>Starting Cash:</div><div style={{ textAlign: 'right', fontWeight: '600' }}>${startingCash.toFixed(2)}</div>
              <div>Cash In (Sales):</div><div style={{ textAlign: 'right', color: '#ffc107', fontWeight: '600' }}>${cash?.toFixed(2)}</div>
              <div>Cash Out (Refunds):</div><div style={{ textAlign: 'right', color: '#dc3545', fontWeight: '600' }}>${Math.abs(returns).toFixed(2)}</div>
              <div><strong>Expected Drawer Total:</strong></div><div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>${expectedDrawer?.toFixed(2)}</div>
            </div>
          </div>

          {/* Other Activity */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>
              OTHER ACTIVITY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr 1fr', gap: '15px', fontSize: '16px', background: '#e9ecef', padding: '15px', borderRadius: '6px' }}>
              <div><strong>Type</strong></div><div><strong>Count</strong></div><div><strong>Total ($)</strong></div>
              <div>Sales</div><div>{saleCount}</div><div>${grossSales?.toFixed(2)}</div>
              <div style={{ color: '#dc3545' }}>Returns</div><div>{returnCount}</div><div style={{ color: '#dc3545' }}>${Math.abs(returns).toFixed(2)}</div>
              <div style={{ color: '#dc3545' }}>Voids</div><div>{voidCount}</div><div>${voids?.toFixed(2)}</div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ 
            borderTop: '3px solid #495057', 
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#495057' }}>
              EMPLOYEE SIGNATURES
            </div>
            <div style={{ fontSize: '16px', lineHeight: '2' }}>
              Cashier &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ___________________<br/>
              Shift Manager &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ___________________
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '12px 30px', 
              fontSize: '16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Generate New Z-Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Z-Report (End of Day Summary)</h2>
      
      <div style={{ textAlign: 'center', margin: '50px 0' }}>
        <button 
          onClick={generateZReport}
          disabled={loading}
          style={{ 
            padding: '15px 40px', 
            fontSize: '20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Generating...' : 'GENERATE Z-REPORT'}
        </button>
        <p style={{ marginTop: '15px', color: '#6c757d', fontSize: '14px' }}>
          This will mark today's sales as reported
        </p>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#fee', 
          padding: '20px', 
          borderRadius: '8px',
          borderLeft: '5px solid #dc3545',
          whiteSpace: 'pre-wrap'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ZReport;
