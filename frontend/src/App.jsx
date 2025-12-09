import { useState } from 'react'
import './App.css'
import Display from './Views/MenuBoard/Display'
import Cashier from './Views/Cashier/Cashier'
import Login from './Views/Customer/Login'
import Manager from './Views/Manager/Manager'

function App() {
  const [currentView, setCurrentView] = useState('main')

  return (
    <>
      {currentView === 'cashier' && (
        <Cashier onBack={() => setCurrentView('staffMenu')} />
      )}
      {currentView === 'display' && (
        <Display onBack={() => setCurrentView('customerMenu')} />
      )}
      {currentView === 'login' && (
        <Login onBack={() => setCurrentView('customerMenu')} />
      )}
      {currentView === 'manager' && (
        <Manager onBack={() => setCurrentView('staffMenu')} />
      )}

      {/* Main Landing - Choose Customer or Staff */}
      {currentView === 'main' && (
        <div className="home-container">
          <h1 className="home-title">Welcome to Boba Shop</h1>
          <div className="home-nav-items main-choice">
            <button 
              className="home-nav-button main-choice-button customer-main-button"
              onClick={() => setCurrentView('customerMenu')}
            >
              Customer View
            </button>
            <button 
              className="home-nav-button main-choice-button staff-main-button"
              onClick={() => setCurrentView('staffMenu')}
            >
              Manager/Staff View
            </button>
          </div>
        </div>
      )}

      {/* Customer Sub-Menu */}
      {currentView === 'customerMenu' && (
        <div className="home-container customer-menu-bg">
          <button 
            className="back-button customer-back"
            onClick={() => setCurrentView('main')}
          >
            ← Back
          </button>
          <h1 className="home-title">Customer Options</h1>
          <div className="home-nav-items sub-menu">
            <button 
              className="home-nav-button sub-button customer-button"
              onClick={() => setCurrentView('login')}
            >
              Order Now
            </button>
            <button 
              className="home-nav-button sub-button menu-button"
              onClick={() => setCurrentView('display')}
            >
              View Menu
            </button>
          </div>
        </div>
      )}

      {/* Staff Sub-Menu */}
      {currentView === 'staffMenu' && (
        <div className="home-container staff-menu-bg">
          <button 
            className="back-button staff-back"
            onClick={() => setCurrentView('main')}
          >
            ← Back
          </button>
          <h1 className="home-title">Manager/Staff Options</h1>
          <div className="home-nav-items sub-menu">
            <button 
              className="home-nav-button sub-button cashier-button"
              onClick={() => setCurrentView('cashier')}
            >
              Cashier
            </button>
            <button 
              className="home-nav-button sub-button manager-button"
              onClick={() => setCurrentView('manager')}
            >
              Manager Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
