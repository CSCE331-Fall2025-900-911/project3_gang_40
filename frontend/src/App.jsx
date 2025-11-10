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
        <div>
          <h1>Main</h1>
          <button onClick={() => setCurrentView('cashier')}>Go to Cashier</button>
          <button onClick={() => setCurrentView('display')}>Go to Menu</button>
        </div>
      )}
    </>
  )
}

export default App
