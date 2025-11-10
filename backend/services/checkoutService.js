export const calculateTotalPrice = (cart, tax = 1.0835) => {
  return cart.reduce((sum, item) => {
    const base = Number(item.drink.base_price);
    const toppingPrice = Number(item.modifications.topping?.extra_cost || 0);
    const quantity = Number(item.modifications.quantity);
    return sum + (base + toppingPrice) * quantity * tax;
  }, 0);
};
