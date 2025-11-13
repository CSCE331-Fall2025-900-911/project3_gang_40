import { useState } from 'react';

function Customer({ onBack }) {
  return (
    <>
      <h2>Customer View</h2>
      <button onClick={onBack}>Exit</button>
      

      <button >Translate</button>
      <button >Text Dictation</button>
    </>
  );
}

export default Customer;
