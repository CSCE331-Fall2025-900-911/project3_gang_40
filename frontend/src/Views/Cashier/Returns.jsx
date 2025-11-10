import { useState, useEffect } from 'react';
import './Returns.css';
import ReturnModal from './Modals/ReturnModal';
import Sidebar from './Sidebar';

function Returns({ onBack, currentEmployee }) {
  const [salesList, setSalesList] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetch last 10 sales
  const fetchRecentSales = async () => {
    const res = await fetch('http://localhost:5001/api/returns/recent');
    const data = await res.json();
    setSalesList(data);
  };

  useEffect(() => {
    fetchRecentSales();
  }, []);

  // fetch details for a specific sale
  const fetchSaleDetails = async (id) => {
    const res = await fetch(`http://localhost:5001/api/returns/${id}`);
    const data = await res.json();
    setOrderDetails(data);
  };

  const handleModalConfirm = (salesId) => {
    fetchSaleDetails(salesId);
  };

  // confirm a return for a sale
  const confirmReturn = async (salesId) => {
    if (!currentEmployee) {
      alert('No employee selected');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sales_id: salesId, 
          employee_id: currentEmployee.employee_id 
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Return confirmed! Sales ID: ${data.return.sales_id}`);
        fetchRecentSales();      // refresh the sales list
        setOrderDetails([]);     // clear the order details
      } else {
        alert(`Failed to confirm return: ${data.message || data.error || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error confirming return');
    }
  };

  return (
    <div className='returns-container'>
      <Sidebar
        currentEmployee={currentEmployee}
        buttons={[{ label: 'Cashier', onClick: onBack }]}
      />

      {/* Previous Orders */}
      <div className='returns-section'>
        <h2>Previous Orders</h2>
        <button className='find-btn' onClick={() => setIsModalOpen(true)}>Find Sales ID</button>
        <ul className='returns-list'>
          {salesList.map(sale => (
            <li key={sale.sales_id}>
              <button className='li-btn'onClick={() => fetchSaleDetails(sale.sales_id)}>
                Sales ID {sale.sales_id}: ${Number(sale.total_price).toFixed(2)} | {sale.payment_method} | {sale.sale_type}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Details */}
      <div className='order-section'>
        <h2>Order Details</h2>
        {orderDetails.length === 0 && <p>Select a sale to see details</p>}
        {orderDetails.map(order => (
          <div key={order.order_id} style={{ marginBottom: '10px' }}>
            <p>Order {order.order_id}:<br/> {order.quantity} x {order.drink_name} - ${order.price}</p>
            <p style={{ marginLeft: '10px' }}>
              ({order.size}, {order.sweetness}, {order.ice_level}, {order.topping_name || 'No topping'})
            </p>
          </div>
        ))}
        {orderDetails.length > 0 && currentEmployee && (
          <button 
            className='make-return-btn'
            onClick={() => confirmReturn(orderDetails[0].sales_id)}
          >
            Confirm Return
          </button>
        )}
      </div>

      <ReturnModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default Returns;
