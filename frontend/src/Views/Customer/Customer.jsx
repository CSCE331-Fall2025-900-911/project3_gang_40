import { useState } from 'react';

function Customer({ onBack }) {
  return (
    <>
      <button onClick={onBack}>Exit</button>
      <h2>Customer View</h2>

      <button >Translate</button>
      <button >Text Dictation</button>
    </>
  );
}

export default Customer;
