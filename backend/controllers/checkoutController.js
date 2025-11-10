// controllers/checkoutController.js
import { pool } from '../db.js';
import { calculateTotalPrice } from '../services/checkoutService.js';

export const checkout = async (req, res, next) => {
  try {
    const { cart } = req.body;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Example: total price calculation
    const tax = 1.0835;
    const totalPrice = calculateTotalPrice(cart, tax);

    res.status(201).json({ message: 'Checkout logic placeholder', totalPrice });
  } catch (err) {
    next(err);
  }
};
