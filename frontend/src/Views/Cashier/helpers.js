// helpers.js

// opens drink modal for modifications
export const openModalHelper = (drink, cartItem, index, setSelectedDrink, setModifications, setIsEditing, setEditingIndex) => {
  console.log('openModalHelper:', { drink, cartItem, index });
  
  setSelectedDrink(drink || null);
  
  if (cartItem && cartItem.modifications) {
    setModifications({
      ...cartItem.modifications,
      quantity: cartItem.modifications.quantity?.toString() || '1'
    });
    setIsEditing(true);
    setEditingIndex(index);
  } else {
    setModifications({
      size_id: 2, 
      sweetness: 'Normal (100%)', 
      ice: 'Regular', 
      quantity: '1',
      selected_toppings: []
    });
    setIsEditing(false);
    setEditingIndex(null);
  }
};

// adds a drink to the cart
export const addToCartHelper = (drink, modifications, setCart, closeModal) => {
  const cartItem = {
    drink,
    modifications: {
      ...modifications,
      selected_toppings: modifications.selected_toppings || []
    }
  };
  
  setCart(prevCart => [...prevCart, cartItem]);
  closeModal();
  console.log('Added to cart:', cartItem);
};

// removes one drink from cart
export const removeFromCartHelper = (index, setCart) => {
  setCart(prev => {
    const newCart = [...prev];
    const item = newCart[index];

    if (item.modifications.quantity > 1) {
      newCart[index] = {
        ...item,
        modifications: { ...item.modifications, quantity: item.modifications.quantity - 1 }
      };
    } else {
      newCart.splice(index, 1);
    }
    return newCart;
  });
};

// adds one extra of drink in cart
export const addAnotherDrinkHelper = (index, setCart) => {
  setCart(prev => {
    const newCart = [...prev];
    const item = newCart[index];

    newCart[index] = {
    ...item,
    modifications: {
      ...item.modifications,
      quantity: Number(item.modifications.quantity) + 1
    }
  };
    return newCart;
  });
};

// saves edits done to existing drink
export const saveEditsHelper = (editingIndex, modifications, setCart, closeModal) => {
  if (editingIndex === null || editingIndex === undefined) {
    console.error('saveEditsHelper called with invalid editingIndex:', editingIndex);
    return;
  }

  setCart(prev => {
    if (!prev || prev.length === 0 || !prev[editingIndex]) {
      console.error('Invalid cart state or index:', { prevLength: prev?.length, editingIndex });
      return prev;
    }

    const updated = [...prev];
    updated[editingIndex] = {
      ...updated[editingIndex],
      modifications: {
        ...updated[editingIndex].modifications,
        ...modifications,
        selected_toppings: modifications.selected_toppings || []
      }
    };
    
    console.log('Cart updated successfully:', updated[editingIndex].modifications.selected_toppings);
    return updated;
  });
  
  closeModal();
};


// clears the cart
export const clearCartHelper = (setCart) => setCart([]);

// calculates total price
export const calculateTotalPrice = (cart, sizes) => {
  return cart.reduce((total, item) => {
    const size = sizes.find(s => s.size_id === item.modifications.size_id) || { extra_cost: 0 };
    
    // Sum ALL toppings extra_cost
    const toppingsExtra = (item.modifications.selected_toppings || []).reduce(
      (sum, topping) => sum + Number(topping.extra_cost || 0), 
      0
    );
    
    const itemTotal = (
      Number(item.drink.base_price) + 
      toppingsExtra + 
      Number(size.extra_cost)
    ) * Number(item.modifications.quantity);
    
    return total + itemTotal;
  }, 0);
};
