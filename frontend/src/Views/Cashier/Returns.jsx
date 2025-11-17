import { useState, useEffect } from 'react';
import './Returns.css';
import ReturnModal from './Modals/ReturnModal';
import Sidebar from './Sidebar';

function Returns({ onBack, currentEmployee }) {
  // states to store sales details
  const [salesList, setSalesList] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetch last 10 sales
  const fetchRecentSales = async () => {
    const res = await fetch('https://project3-gang-40-sjzu.onrender.com/api/returns/recent');
    const data = await res.json();
    setSalesList(data);
  };

  useEffect(() => {
    fetchRecentSales();
  }, []);

  // fetch details for a specific sale
  const fetchSaleDetails = async (id) => {
    const res = await fetch(`https://project3-gang-40-sjzu.onrender.com/api/returns/${id}`);
    const data = await res.json();
    setOrderDetails(data);
  };

  // Triggered from modal when a user confirms a Sales ID
  const handleModalConfirm = (salesId) => {
    fetchSaleDetails(salesId);
  };

  // confirm a return for a sale with the backend
  const confirmReturn = async (salesId) => {
    if (!currentEmployee) {
      alert('No employee selected');
      return;
    }

    try {
      const res = await fetch('https://project3-gang-40-sjzu.onrender.com/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sales_id: salesId, 
          employeeId: currentEmployee.employeeId 
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
      {/* Sidebar Navigation */}
      <Sidebar
        currentEmployee={currentEmployee}
        buttons={[{ label: 'Cashier', onClick: onBack }]}
      />


      {/* Previous Orders */}
      {/* List of previous sales */}
      {/* Previous Sales Section: displays list of last 10 sales + find sales ID option */}
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
      {/* Display details of the selected sale */}
      {/* Order Details Section: shows items for the selected sale and allows confirming a return */} 
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
        {/* Only show confirm button if order details exist and an employee is logged in */}
        {orderDetails.length > 0 && currentEmployee && (
          <button 
            className='make-return-btn'
            onClick={() => confirmReturn(orderDetails[0].sales_id)}
          >
            Confirm Return
          </button>
        )}
      </div>


      {/* Modal for entering a sales ID manually */}
      <ReturnModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default Returns;
