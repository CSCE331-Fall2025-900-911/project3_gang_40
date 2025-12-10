import { useState, useEffect } from 'react'
import Employee from './Employee';
import Inventory from './Inventory';
import './css/Manager.css'
import './css/ManagerWidgets.css'
import SalesByHourChart from './charts/salesByHour'
import SalesByDayChart from './charts/salesByDay'
import DrinkTypePieChart from './charts/salesByDrinkType'
import TopSellingDrinks from './charts/topSellingDrinks'
import ProductUsageReport from './reports/productUsageReport'
import XReport from './reports/XReport'
import ZReport from './reports/ZReport'
import Sidebar from '../Cashier/Sidebar'


function Manager({ onBack }) {
  const [currentView, setCurrentView] = useState('manager')

  return (
    <>
      {currentView === 'manager' && (
        <div className='manager-main-page'>
          <Sidebar
            currentEmployee={''}
            buttons={[
              { label: 'Exit', onClick: onBack },
              { label: 'Employee', onClick: () => setCurrentView('employee') },
              { label: 'Inventory', onClick: () => setCurrentView('inventory') },
            ]}
          />

          <div>
            <div className='manager-page-title'>
              Manager Main Page
            </div>

            {/* Charts Section */}
            <div className='charts-section'>
              <h2 className='section-title'>Sales Charts</h2>
              <div className='charts-grid'>
                <SalesByHourChart />
                <SalesByDayChart />
                <DrinkTypePieChart />
                <TopSellingDrinks />
              </div>
            </div>

            {/* Reports Section */}
            <div className='reports-section'>
              <h2 className='section-title'>Reports</h2>
              <div className='reports-grid'>
                <ProductUsageReport />
                <XReport />
                <ZReport />
              </div>
            </div>
          </div>
        </div>

      )}
      
      {currentView === 'employee' && <Employee onBack={() => setCurrentView('manager')}/>}
      {currentView === 'inventory' && <Inventory onBack={() => setCurrentView('manager')}/>}
    </>
  )
}

export default Manager;
