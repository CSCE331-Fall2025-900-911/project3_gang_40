import { pool } from '../db.js';

// Get all supplies
export const getAllSupplies = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT supply_id, supply_name, stock FROM supplies ORDER BY supply_id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get single supply by ID
export const getSupplyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT supply_id, supply_name, stock FROM supplies WHERE supply_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supply not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Add new supply
export const addSupply = async (req, res, next) => {
  const { name, stock } = req.body;
  
  if (!name || stock === undefined) {
    return res.status(400).json({ error: 'Name and stock are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO supplies (supply_name, stock) VALUES ($1, $2) RETURNING *',
      [name, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update supply
export const updateSupply = async (req, res, next) => {
  const { id } = req.params;
  const { name, stock } = req.body;

  if (!name || stock === undefined) {
    return res.status(400).json({ error: 'Name and stock are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE supplies SET supply_name = $1, stock = $2 WHERE supply_id = $3 RETURNING *',
      [name, stock, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supply not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete supply
export const deleteSupply = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM supplies WHERE supply_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    res.json({ message: 'Supply deleted successfully', supply: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Update stock only (for restocking)
export const updateSupplyStock = async (req, res, next) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock === undefined) {
    return res.status(400).json({ error: 'Stock is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE supplies SET stock = $1 WHERE supply_id = $2 RETURNING *',
      [stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};