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
};
