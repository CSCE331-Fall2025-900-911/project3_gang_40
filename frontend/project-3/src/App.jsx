import { useState } from 'react'
import './App.css'
import Display from './Views/MenuBoard/Display'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
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
