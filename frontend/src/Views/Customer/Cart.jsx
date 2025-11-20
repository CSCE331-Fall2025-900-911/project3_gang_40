import { useState } from "react";

function Cart({ onBack }) {
  const [currentView, setCurrentView] = useState('cart')

  const handleBack = () => setCurrentView('customer');

  return (
    <>
    
      <div>
        <button onClick={onBack}>Exit</button>

        <div>
          <p>CART</p>
        </div>

      </div>



    
    </>
  );
}

export default Cart;