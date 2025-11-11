import { useState } from 'react'
import './App.css'
import Display from './Views/MenuBoard/Display'
import Cashier from './Views/Cashier/Cashier'

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

      {currentView === 'main' && (
        <div className="home-container">
          <h1 className="menu-title">Boba Shop</h1>
          <div className="menu-items">
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
          </div>
        </div>
      )}
    </>
  )
}

export default App
