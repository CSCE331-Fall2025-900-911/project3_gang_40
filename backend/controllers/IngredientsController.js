import { pool } from '../db.js';

// Get all ingredients
export const getAllIngredients = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT ingredient_id, ingredient_name, unit, stock_quantity FROM ingredients ORDER BY ingredient_id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get single ingredient by ID
export const getIngredientById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT ingredient_id, ingredient_name, unit, stock_quantity FROM ingredients WHERE ingredient_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Add new ingredient
export const addIngredient = async (req, res, next) => {
  const { name, unit, stock_quantity } = req.body;
  
  if (!name || !unit || stock_quantity === undefined) {
    return res.status(400).json({ error: 'Name, unit, and stock_quantity are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO ingredients (ingredient_name, unit, stock_quantity) VALUES ($1, $2, $3) RETURNING *',
      [name, unit, stock_quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update ingredient
export const updateIngredient = async (req, res, next) => {
  const { id } = req.params;
  const { name, unit, stock_quantity } = req.body;

  if (!name || !unit || stock_quantity === undefined) {
    return res.status(400).json({ error: 'Name, unit, and stock_quantity are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE ingredients SET ingredient_name = $1, unit = $2, stock_quantity = $3 WHERE ingredient_id = $4 RETURNING *',
      [name, unit, stock_quantity, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete ingredient
export const deleteIngredient = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if ingredient is used in any drinks
    const drinkCheck = await pool.query(
      'SELECT COUNT(*) FROM drink_ingredients WHERE ingredient_id = $1',
      [id]
    );

    if (parseInt(drinkCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete ingredient. It is used in one or more drinks.' 
      });
    }

    const result = await pool.query(
      'DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ message: 'Ingredient deleted successfully', ingredient: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Update stock quantity (for restocking)
export const updateStockQuantity = async (req, res, next) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;

  if (stock_quantity === undefined) {
    return res.status(400).json({ error: 'stock_quantity is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE ingredients SET stock_quantity = $1 WHERE ingredient_id = $2 RETURNING *',
      [stock_quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};