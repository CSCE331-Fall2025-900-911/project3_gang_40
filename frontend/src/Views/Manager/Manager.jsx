import { useState } from 'react'
import Employee from './Employee';
import Inventory from './Inventory';
import './Manager.css'

function Manager({ onBack }) {
  const [currentView, setCurrentView] = useState('manager')


  return (
    <>
      {currentView === 'manager' && (
        <div className='manager-main-page'>
          <h1>Manager Main Page</h1>
          <button onClick={onBack}>Exit</button>
          <button onClick={() => setCurrentView('employee')}>Employee</button>
          <button onClick={() => setCurrentView('inventory')}>Inventory</button>
        </div>
      )}
      
      {/* set to employee view */}
      {currentView === 'employee' && (
        <Employee onBack={() => setCurrentView('manager')}/>
      )}

      {/* set to inventory view */}
      {currentView === 'inventory' && (
        <Inventory onBack={() => setCurrentView('manager')}/>
      )}

    </>
  )
}

export default Manager;