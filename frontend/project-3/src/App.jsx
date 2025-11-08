import { useState } from 'react'
import './App.css'
import Display from './Views/MenuBoard/Display'
import Cashier from './Views/Cashier/Cashier'

function App() {
  const [count, setCount] = useState(0)
  const [showCashier, setShowCashier] = useState(false)

  return (
    <>
      {showCashier ? (
          <div>
            <Cashier onBack={() => setShowCashier(false)} />
          </div>
        ) : (
          <div>
            <button onClick={() => setShowCashier(true)}>
              Go to Cashier
            </button>
          </div>
        )}
        
      <div>
         <h1>
           Hello World!!!
         </h1>

         <Display/>
      </div>
      
    </>
  )
}

export default App
