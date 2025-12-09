// main container for the drink selection section
function DrinkSection({ drinks, openModal, activeCategory, setActiveCategory }) {

  const allCategories = Array.from(
    new Set(drinks.map(d => d.drink_type || 'Other'))
  );

  // Define category order for consistent display
  const categoryOrder = ['Classic', 'Fruity', 'Milky', 'Blended', 'Special'];

  const sortedCategories = categoryOrder
    .filter(c => allCategories.includes(c))
    .concat(allCategories.filter(c => !categoryOrder.includes(c)));

  const visibleDrinks = activeCategory === 'All'
  ? drinks
  : drinks.filter(d => (d.drink_type || 'Other') === activeCategory);

  // Group drinks by their drink_type
  const groupedDrinks = visibleDrinks.reduce((acc, drink) => {
    const category = drink.drink_type || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(drink);
    return acc;
  }, {});

  return (
    <div className='drink-section'>

      {/* category filter bar */}
      <div className="category-bar">
        <button
          className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {sortedCategories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

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
