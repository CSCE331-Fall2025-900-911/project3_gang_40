import { useState } from 'react'

function Employee({ onBack }) {

  return (
    <>
      <div>
        <h1>Employee Page</h1>
        <button onClick={onBack}>Exit</button>
      </div>
    </>
  )
}

export default Employee;