import { useState } from "react";

function Modifications({ drink, onBack }) {
  const [currentView, setCurrentView] = useState('modifications')
  const handleBack = () => setCurrentView('customer');

  return (
    <>
    
      <div>
        <h2>Modify {drink.drink_name}</h2>
        <p>Base Price: ${drink.base_price}</p>
        {/* Show toppings, sizes, etc */}
        <button onClick={onBack}>Back</button>
      </div>

    
    </>
  );
}

export default Modifications;