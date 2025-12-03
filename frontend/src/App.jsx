import { useState } from 'react'
import './App.css'
import Display from './Views/MenuBoard/Display'
import Cashier from './Views/Cashier/Cashier'
import Login from './Views/Customer/Login'



function App() {
  const [currentView, setCurrentView] = useState('main')

  return (
    <>
      {currentView === 'cashier' && (
        <Cashier onBack={() => setCurrentView('main')} />
      )}

      {currentView === 'display' && (
        <Display onBack={() => setCurrentView('main')} />
      )}

      {currentView === 'customer' && (
        <Customer onBack={() => setCurrentView('main')} />
      )}

      {currentView === 'login' && (
        <Login onBack={() => setCurrentView('main')} />
      )}


      {currentView === 'main' && (
        <div className="home-container">
          <h1 className="home-title">Boba Shop</h1>
          <div className="home-nav-items">
            <button 
              className="nav-button cashier-button"
              onClick={() => setCurrentView('cashier')}
            >
              Cashier
            </button>
            <button 
              className="nav-button menu-button"
              onClick={() => setCurrentView('display')}
            >
              Menu
            </button>
            <button 
              className="nav-button menu-button"
              onClick={() => setCurrentView('login')}
            >
              Customer
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
