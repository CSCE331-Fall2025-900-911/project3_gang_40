import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// gets api for drinks
app.get('/api/drinks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drinks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// gets api for toppings
app.get('/api/toppings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM toppings');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// gets api for drink sizes
app.get('/api/drink-sizes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drink_sizes ORDER BY size_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// gets api for employees
app.get('/api/employees/cashiers', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees WHERE role = 'Cashier' ORDER BY employee_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// sends order to database
app.post('/api/checkout', async (req, res) => {
  const { cart, employee_id = null, customer_id = null, payment_method = 'Card', sale_type = 'Sale', tax = 1.0835 }= req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // get total price
    const totalPrice = cart.reduce((sum, item) => {
      const base = Number(item.drink.base_price);
      const toppingPrice = Number(item.modifications.topping.extra_cost);
      const quantity = Number(item.modifications.quantity);
      return (sum + (base + toppingPrice) * quantity * tax);
    }, 0);

    // insert into sales history
    const saleResult = await client.query(
      `INSERT INTO sales_history (customer_id, employee_id, sales_time, total_price, payment_method, sale_type)
       VALUES ($1, $2, NOW(), $3, $4, $5)
       RETURNING sales_id`,
       [customer_id, employee_id, totalPrice, payment_method, sale_type]
    );
    const salesId = saleResult.rows[0].sales_id;
    const sizeMap = { Small: 1, Medium: 2, Large: 3 };

    // insert each drink into orders
    for (const item of cart) {
      const { drink, modifications } = item;
      const toppingId = modifications.topping?.topping_id || null;
      const sizeId = modifications.size_id;

      // get variation id
      let variationId;
      const variationResult = await client.query(
        `SELECT variation_id FROM drink_variation
        WHERE drink_id = $1 AND size_id = $2 AND sweetness = $3 AND ice_level = $4 AND topping_id IS NOT DISTINCT FROM $5`,
        [drink.drink_id, sizeId, modifications.sweetness, modifications.ice, toppingId]
      );

      if (variationResult.rows.length > 0) {
        variationId = variationResult.rows[0].variation_id;
      } else {
        // create variation id for unknown or new drink
        const insertVar = await client.query(
          `INSERT INTO drink_variation (drink_id, size_id, sweetness, ice_level, topping_id)
          VALUES ($1, $2, $3, $4, $5) RETURNING variation_id`,
          [drink.drink_id, sizeId, modifications.sweetness, modifications.ice, toppingId]
        );
        variationId = insertVar.rows[0].variation_id;
      }

      // get size extra cost from drink_sizes table
      const sizeResult = await client.query(
        `SELECT extra_cost FROM drink_sizes WHERE size_id = $1`,
        [sizeId]
      );
      const sizeExtra = Number(sizeResult.rows[0]?.extra_cost || 0);

      // calculate price
      const toppingCost = Number(modifications.topping?.extra_cost || 0);
      const price = (Number(drink.base_price) + toppingCost + sizeExtra) * Number(modifications.quantity) * tax;

      await client.query(
        `INSERT INTO orders (sales_id, variation_id, quantity, price)
        VALUES ($1, $2, $3, $4)`,
        [salesId, variationId, modifications.quantity, price]
      );

      // TODO: decrement stock

    }
    await client.query('COMMIT');
    res.status(201).json({ message: 'Order successfully added', salesId});
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Error processing checkout' });
  } finally {
    client.release();
  }
});

// shows on site that it is running
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
