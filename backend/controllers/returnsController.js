import { pool } from '../db.js';

// Get last 10 sales
export const getRecentSales = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM sales_history ORDER BY sales_id DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get orders for a specific sales_id
export const getSalesDetails = async (req, res, next) => {
  const sales_id = parseInt(req.params.id);
  if (isNaN(sales_id)) return res.status(400).json({ error: 'Invalid sales ID' });

  try {
    const result = await pool.query(`
      SELECT 
        o.order_id,
        o.sales_id,
        o.quantity,
        o.price,
        d.drink_name,
        ds.size_name AS size,
        dv.sweetness,
        dv.ice_level,
        t.topping_name
      FROM orders o
      JOIN drink_variation dv ON o.variation_id = dv.variation_id
      JOIN drinks d ON dv.drink_id = d.drink_id
      JOIN drink_sizes ds ON dv.size_id = ds.size_id
      LEFT JOIN toppings t ON dv.topping_id = t.topping_id
      WHERE o.sales_id = $1
      ORDER BY o.order_id
    `, [sales_id]);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Create a return
export const createReturn = async (req, res) => {
  const { sales_id, employee_id } = req.body;

  try {
    // 1. Look up original sale
    const originalSaleResult = await pool.query(
      'SELECT customer_id, total_price, payment_method FROM sales_history WHERE sales_id = $1',
      [sales_id]
    );

    if (originalSaleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Original sale not found' });
    }

    const originalSale = originalSaleResult.rows[0];

    // 2. Insert new row as return
    const insertResult = await pool.query(
      `INSERT INTO sales_history 
       (customer_id, employee_id, sales_time, total_price, payment_method, sale_type, original_sales_id)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, 'Return', $5)
       RETURNING *`,
      [
        originalSale.customer_id,
        employee_id,
        -originalSale.total_price, // negative
        originalSale.payment_method,
        sales_id
      ]
    );

    res.status(201).json({ message: 'Return created', return: insertResult.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating return' });
  }
};