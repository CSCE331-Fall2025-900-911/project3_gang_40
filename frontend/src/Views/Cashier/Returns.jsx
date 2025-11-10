import { useState } from 'react';
import './Returns.css'

function Returns({ onBack }) {


  return (

    <div className='returns-container'>
      <nav className='sidebar'>
        <div>
          <h2>Menu</h2>
          <ul>
            <li><button onClick={onBack}>Exit</button></li>
            {/* to add more nav spots later */}
          </ul>
        </div>
      </nav>

      {/* show previous returns */}
      <div className='returns-section'>
        <h2>Previous Orders</h2>
        <button className='find-btn'>Find</button>
        <ul className='returns-list'>
          <li>example 1</li>
          <li>example 2</li>
        </ul>
      </div>   

      {/* make return */}
      <div className='order-section'>
        <h2>Make Return</h2>
        <p style={{marginTop: '10px'}}>example order detail</p>
        <button className='make-return-btn'>Confirm</button>
      </div>

    </div>
  )
}

export default Returns