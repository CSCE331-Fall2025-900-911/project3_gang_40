// helpers.js

// opens drink modal for modifications
export const openModalHelper = (
  drink,
  cartItem,
  index,
  setSelectedDrink,
  setModifications,
  setIsEditing,
  setEditingIndex
) => {
  setSelectedDrink(drink);

  if (cartItem) {
    setModifications(cartItem.modifications);
    setIsEditing(true);
    setEditingIndex(index);
  } else {
    setModifications({
      size_id: 2,
      sweetness: 'Normal (100%)',
      ice: 'Regular',
      topping: null,
      quantity: '1'
    });
    setIsEditing(false);
    setEditingIndex(null);
  }
};

// adds a drink to the cart
export const addToCartHelper = (selectedDrink, modifications, setCart, closeModal) => {
  if (!selectedDrink) return;
  setCart(prev => [
    ...prev,
    { drink: selectedDrink, modifications, quantity: modifications.quantity }
  ]);
  closeModal();
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
      modifications: { ...item.modifications, quantity: item.modifications.quantity + 1 }
    };
    return newCart;
  });
};

// saves edits done to existing drink
export const saveEditsHelper = (editingIndex, modifications, setCart, closeModal) => {
  setCart(prev => {
    const updated = [...prev];
    updated[editingIndex] = {
      ...updated[editingIndex],
      modifications: modifications
    };
    return updated;
  });
  closeModal();
};

// clears the cart
export const clearCartHelper = (setCart) => setCart([]);

// calculates total price
export const calculateTotalPrice = (cart, sizes) => {
  return cart.reduce((sum, item) => {
    const base = Number(item.drink.base_price);
    const toppingPrice = Number(item.modifications.topping?.extra_cost || 0);
    const sizeExtra = Number(sizes.find(s => s.size_id === item.modifications.size_id)?.extra_cost || 0);
    const quantity = Number(item.modifications.quantity);
    return sum + (base + toppingPrice + sizeExtra) * quantity;
  }, 0);
};
