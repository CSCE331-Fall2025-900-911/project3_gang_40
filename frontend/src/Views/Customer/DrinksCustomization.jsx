import { useState } from "react";
import NavBar from "./components/NavBar";
import textKeys from './components/text';

function DrinksCustomization({ drink, modifications, setModifications, onNext, onBack, cart, onCartClick, currentStep, onStepClick, sizes, translatedTexts }) {
  const handleDictation = () => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.lang = "en-US";
    recog.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().toLowerCase();
      let newMods = {};
      if (sizes && sizes.length > 0) {
        const sizeMatch = sizes.find((s) =>
          spoken.includes(s.size_name.toLowerCase())
        );
        if (sizeMatch) {
          newMods.size_id = sizeMatch.size_id;
        }
      }
      const sweetnessMap = [
        { words: ["no sugar", "unsweet"], value: "No Sugar (0%)" },
        { words: ["light sweetness", "slight", "30"], value: "Light (30%)" },
        { words: ["half", "50"], value: "Half (50%)" },
        { words: ["less sweetness", "80"], value: "Less (80%)" },
        { words: ["normal", "regular sweetness", "100", "full sugar"], value: "Normal (100%)" }
      ];
      sweetnessMap.forEach((entry) => {
        if (entry.words.some((w) => spoken.includes(w))) {
          newMods.sweetness = entry.value;
        }
      });
      if (spoken.includes("no ice")) {
        newMods.ice = "No Ice";
      } else if (
        spoken.includes("less ice") ||
        spoken.includes("light ice")
      ) {
        newMods.ice = "Less";
      } else if (spoken.includes("regular ice")) {
        newMods.ice = "Regular";
      }
      let spokenForQty = spoken;
      spokenForQty = spokenForQty.replace(/0%|30%|50%|80%|100%/g, "");
      const detectedQty = parseInt(spokenForQty.replace(/[^0-9]/g, ""));
      if (!isNaN(detectedQty) && detectedQty > 0) {
        newMods.quantity = detectedQty;
      }
      setModifications((prev) => ({ ...prev, ...newMods }));
      if (Object.keys(newMods).length === 0) {
        alert(`Didn't detect size, sweetness, ice, or quantity from: "${spoken}"`);
      }
    };
    recog.start();
  };

  return (
    <div className="customization-page">
      <div className="customization-container">
        <div className="customization-header">
          <h2>{(translatedTexts.customizeDrink || textKeys.customizeDrink)} {drink.drink_name}</h2>
          <p>{translatedTexts.basePrice || textKeys.basePrice}: ${Number(drink.base_price).toFixed(2)}</p>
        </div>

        <div className="customization-content">
          <button type="button" onClick={handleDictation} className="dictation-btn">
            {translatedTexts.speakOrder || textKeys.speakOrder}
          </button>
          {/* Size Selection */}
          <div className="customization-section">
            <label htmlFor="size">{translatedTexts.size || textKeys.size}:</label>
            <div className="size-options">
              {sizes && sizes.length > 0 ? (
                sizes.map(size => (
                  <button
                    key={size.size_id}
                    className={`size-btn ${modifications.size_id === size.size_id ? 'active' : ''}`}
                    onClick={() => setModifications(prev => ({ ...prev, size_id: size.size_id }))}
                  >
                    {size.size_name}
                  </button>
                ))
              ) : (
                <p>Loading sizes...</p>
              )}
            </div>
          </div>

          {/* Sweetness Level Selection */}
          <div className="customization-section">
            <label htmlFor="sweetness">{translatedTexts.sweetnessLevel || textKeys.sweetnessLevel}:</label>
            <div className="sweetness-options">
              {[
                'No Sugar (0%)',
                'Light (30%)',
                'Half (50%)',
                'Less (80%)',
                'Normal (100%)'
              ].map(level => (
                <button
                  key={level}
                  className={`sweetness-btn ${modifications.sweetness === level ? 'active' : ''}`}
                  onClick={() => setModifications(prev => ({ ...prev, sweetness: level }))}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level Selection */}
          <div className="customization-section">
            <label htmlFor="ice">{translatedTexts.iceLevel || textKeys.iceLevel}:</label>
            <div className="ice-options">
              {['No Ice', 'Less', 'Regular'].map(level => (
                <button
                  key={level}
                  className={`ice-btn ${modifications.ice === level ? 'active' : ''}`}
                  onClick={() => setModifications(prev => ({ ...prev, ice: level }))}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="customization-section">
            <label htmlFor="quantity">{translatedTexts.quantity || textKeys.quantity}:</label>
            <div className="quantity-input">
              <button onClick={() => setModifications(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</button>
              <input
                type="number"
                min="1"
                value={modifications.quantity}
                onChange={e => setModifications(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
              />
              <button onClick={() => setModifications(prev => ({ ...prev, quantity: prev.quantity + 1 }))}>+</button>
            </div>
          </div>
        </div>

        <div className="customization-actions">
          <button className="back-btn" onClick={onBack}>{translatedTexts.back || textKeys.back}</button>
          <button className="next-btn" onClick={onNext}>{translatedTexts.nextToppings || textKeys.nextToppings}</button>
        </div>
      </div>

      <NavBar
        currentStep={2}
        cartCount={cart.length}
        onCartClick={onCartClick}
        onExitClick={onBack}
        onStepClick={onStepClick}
        translatedTexts={translatedTexts}
      />
    </div>
  );
}

export default DrinksCustomization;
