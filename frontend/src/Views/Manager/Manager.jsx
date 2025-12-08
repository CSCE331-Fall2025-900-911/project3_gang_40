import { useState, useEffect } from 'react'
import Employee from './Employee';
import Inventory from './Inventory';
import './Manager.css'
import SalesByHourChart from './charts/salesByHour'
import SalesByDayChart from './charts/salesByDay'
import DrinkTypePieChart from './charts/salesByDrinkType'
import TopSellingDrinks from './charts/topSellingDrinks'
import ProductUsageReport from './charts/productUsageReport'


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

          <SalesByHourChart/>
          <SalesByDayChart/>
          <DrinkTypePieChart/>
          <TopSellingDrinks/>
          <ProductUsageReport/>

        </div>
      )}
      
      {currentView === 'employee' && <Employee onBack={() => setCurrentView('manager')}/>}
      {currentView === 'inventory' && <Inventory onBack={() => setCurrentView('manager')}/>}
    </>
  )
}

export default Manager;
