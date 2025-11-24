import { useState } from "react";
import textKeys from './components/text';

function Modifications({ drink, onBack, translatedTexts }) {
  const [currentView, setCurrentView] = useState('modifications')
  const handleBack = () => setCurrentView('customer');

  return (
    <>

      <div>
        <h2> {translatedTexts?.customizeDrink || textKeys.customizeDrink} {drink.drink_name}</h2>
        <p>  {translatedTexts?.basePrice || textKeys.basePrice}: ${drink.base_price}</p>
        {/* Show toppings, sizes, etc */}
        <button onClick={onBack}> {translatedTexts?.back || textKeys.back}</button>
      </div>


    </>
  );
}

export default Modifications;