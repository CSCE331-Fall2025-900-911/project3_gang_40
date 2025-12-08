// employeesController.js
import { pool } from '../db.js';

// get all employees from database
export const getAllEmployees = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM employees ORDER BY employee_id");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// get cashiers from database
export const getCashiers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM employees WHERE role='Cashier' ORDER BY employee_id");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, role, email, password } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !role || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert new employee into database
    const result = await pool.query(
      "INSERT INTO employees (first_name, last_name, role, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, role, email, password]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const editEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, role, email } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !role || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Update employee in database
    const result = await pool.query(
      "UPDATE employees SET first_name = $1, last_name = $2, role = $3, email = $4 WHERE employee_id = $5 RETURNING *",
      [first_name, last_name, role, email, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
