import { useState } from 'react'

function Inventory({ onBack }) {

  return (
    <>
      <div>
        <h1>Inventory Page</h1>
        <button onClick={onBack}>Exit</button>
      </div>
    </>
  )
}

export default Inventory;