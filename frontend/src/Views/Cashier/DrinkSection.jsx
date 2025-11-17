function DrinkSection({ drinks, openModal }) {
  return (
    <div className='drink-section'>
      <h2>Choose a Drink</h2>
      <div className='drink-group'>
        {drinks.length > 0 ? drinks.map(drink => (
          <button key={drink.drink_id} className='drink-btn' onClick={() => openModal(drink)}>
            {drink.drink_name}<br />${Number(drink.basePrice).toFixed(2)}
          </button>
        )) : <p>Loading drinks...</p>}
      </div>
    </div>
  );
}

export default DrinkSection;
