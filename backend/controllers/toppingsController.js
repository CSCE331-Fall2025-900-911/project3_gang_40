import { pool } from '../db.js';

// Controller to get all toppings
export const getToppings = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM toppings ORDER BY topping_id');
    res.json(result.rows);
  } catch (err) {
    // Pass error to centralized error handler
    next(err);
  }
};
