import { pool } from '../db.js';

// get drinks from database
export const getDrinks = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM drinks');
    res.json(result.rows);
  } catch (err) {
    next(err); // forward to errorHandler
  }
};

// get drink sizes from database
export const getDrinkSizes = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM drink_sizes ORDER BY size_id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
