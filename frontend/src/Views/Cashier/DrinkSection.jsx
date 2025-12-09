// main container for the drink selection section
function DrinkSection({ drinks, openModal }) {
  // Group drinks by their drink_type
  const groupedDrinks = drinks.reduce((acc, drink) => {
    const category = drink.drink_type || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(drink);
    return acc;
  }, {});

  // Define category order for consistent display
  const categoryOrder = ['Classic', 'Fruity', 'Milky', 'Special', 'Blended'];

  return (
    <div className='drink-section'>
      {/* If drinks array is empty, show loading message */}
      {drinks.length === 0 ? (
        <p>Loading drinks...</p>
      ) : (
        // Loop through each category and display drinks grouped by category
        categoryOrder.map(category => {
          const categoryDrinks = groupedDrinks[category];
          // Skip category if it has no drinks
          if (!categoryDrinks || categoryDrinks.length === 0) return null;

          return (
            <div key={category} className="drink-container">
              {/* Category heading */}
              <h2>{category} Drinks</h2>
              {/* Container that holds all drink buttons for this category */}
              <div className='drink-group'>
                {categoryDrinks.map(drink => (
                  <button 
                    key={drink.drink_id} 
                    className='drink-btn' 
                    onClick={() => openModal(drink)}
                  >
                    <span>{drink.drink_name}</span>
                    <span className="price">${Number(drink.base_price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default DrinkSection;
