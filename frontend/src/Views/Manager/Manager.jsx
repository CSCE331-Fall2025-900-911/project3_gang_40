import { useState } from 'react'

function Manager({ onBack }) {
  const [currentView, setCurrentView] = useState('manager')


  return (
    <>
      <div>
        <h1>Manager Main Page</h1>
        <button onClick={onBack}>Exit</button>
      </div>
    </>
  )
}

export default Manager;