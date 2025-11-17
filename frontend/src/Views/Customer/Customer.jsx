import { useState } from 'react';
import './Customer.css'

function Customer({ onBack }) {
  return (
    <>
      <div className='customer-container'>

        <div className='sidebar'>
          <p>sidebar</p>
        </div>

        <div className='drink-container'>
          <h2>Customer View</h2>
          <button onClick={onBack}>Exit</button>
          
          <button >Translate</button>
          <button >Text Dictation</button>
        </div>

        <div className='cart-container'>
          <p>cart</p>
        </div>
      </div>

      
      
    </>
  );
}

export default Customer;
