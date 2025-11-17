// controllers/checkoutController.js
import { pool } from '../db.js';

export const checkout = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      cart,
      employee_id = null,
      customer_id = null,
      payment_method = 'Card',
      sale_type = 'Sale',
      tax = 1.0835
    } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    await client.query('BEGIN');

    // Get size extra cost
    const sizeRes = await client.query('SELECT size_id, extra_cost FROM drink_sizes');
    const sizeMap = {};
    sizeRes.rows.forEach(row => sizeMap[row.size_id] = Number(row.extra_cost));

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => {
      const base = Number(item.drink.base_price);
      const toppingPrice = Number(item.modifications.topping?.extra_cost || 0);
      const sizeExtra = sizeMap[item.modifications.size_id] || 0;
      const quantity = Number(item.modifications.quantity);
      return sum + (base + toppingPrice + sizeExtra) * quantity * tax;
    }, 0);

    // Insert into sales_history
    const saleResult = await client.query(
      `INSERT INTO sales_history
        (customer_id, employee_id, sales_time, total_price, payment_method, sale_type)
       VALUES ($1, $2, NOW(), $3, $4, $5)
       RETURNING sales_id`,
      [customer_id, employee_id, totalPrice, payment_method, sale_type]
    );
    const salesId = saleResult.rows[0].sales_id;

    // Insert each drink into orders
    for (const item of cart) {
      const { drink, modifications } = item;
      const toppingId = modifications.topping?.topping_id || null;
      const size_id = modifications.size_id;

      // Get or create variation_id
      let variation_id;
      const variationResult = await client.query(
        `SELECT variation_id FROM drink_variation
         WHERE drink_id = $1 AND size_id = $2 AND sweetness = $3 AND ice_level = $4 AND toppingId IS NOT DISTINCT FROM $5`,
        [drink.drink_id, size_id, modifications.sweetness, modifications.ice, toppingId]
      );

      if (variationResult.rows.length > 0) {
        variation_id = variationResult.rows[0].variation_id;
      } else {
        const insertVar = await client.query(
          `INSERT INTO drink_variation (drink_id, size_id, sweetness, ice_level, toppingId)
           VALUES ($1, $2, $3, $4, $5) RETURNING variation_id`,
          [drink.drink_id, size_id, modifications.sweetness, modifications.ice, toppingId]
        );
        variation_id = insertVar.rows[0].variation_id;
      }

      // Get size extra cost
      const sizeResult = await client.query(
        `SELECT extra_cost FROM drink_sizes WHERE size_id = $1`,
        [size_id]
      );
      const sizeExtra = Number(sizeResult.rows[0]?.extra_cost || 0);

      // Calculate final price for this item
      const toppingCost = Number(modifications.topping?.extra_cost || 0);
      const price = (Number(drink.base_price) + toppingCost + sizeExtra) * Number(modifications.quantity) * tax;

      await client.query(
        `INSERT INTO orders (sales_id, variation_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [salesId, variation_id, modifications.quantity, price]
      );


      // After inserting into orders, decrement stock
      // 1. Look up required ingredients for this drink
      const ingredientsResult = await client.query(
        `SELECT ingredient_id, quantity
        FROM drink_ingredients
        WHERE drink_id = $1`,
        [drink.drink_id]
      );

      // 2. For each ingredient, calculate total used and update inventory
      for (const ing of ingredientsResult.rows) {
        const requiredPerCup = Number(ing.quantity);  // amount per drink
        const totalUsed = requiredPerCup * Number(modifications.quantity);

        // Check current stock
        const stockResult = await client.query(
          `SELECT stock_quantity
          FROM ingredients
          WHERE ingredient_id = $1
          FOR UPDATE`,
          [ing.ingredient_id]
        );

        const currentStock = Number(stockResult.rows[0].stock_quantity);

        if (currentStock < totalUsed) {
          throw new Error(
            `Insufficient stock for ingredient ${ing.ingredient_id}. Needed ${totalUsed}, but only ${currentStock} available.`
          );
        }

        // Decrement stock
        await client.query(
          `UPDATE ingredients
          SET stock_quantity = stock_quantity - $1
          WHERE ingredient_id = $2`,
          [totalUsed, ing.ingredient_id]
        );
      }


    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order successfully added',
      salesId,
      totalPrice
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err);
    next(err);
  } finally {
    client.release();
  }
};
