// controllers/checkoutController.js
import { pool } from '../db.js';

export const checkout = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      cart,
      employeeId = null,
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
    const sizeRes = await client.query('SELECT sizeId, extra_cost FROM drink_sizes');
    const sizeMap = {};
    sizeRes.rows.forEach(row => sizeMap[row.sizeId] = Number(row.extra_cost));

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => {
      const base = Number(item.drink.base_price);
      const toppingPrice = Number(item.modifications.topping?.extra_cost || 0);
      const sizeExtra = sizeMap[item.modifications.sizeId] || 0;
      const quantity = Number(item.modifications.quantity);
      return sum + (base + toppingPrice + sizeExtra) * quantity * tax;
    }, 0);

    // Insert into sales_history
    const saleResult = await client.query(
      `INSERT INTO sales_history
        (customer_id, employeeId, sales_time, total_price, payment_method, sale_type)
       VALUES ($1, $2, NOW(), $3, $4, $5)
       RETURNING sales_id`,
      [customer_id, employeeId, totalPrice, payment_method, sale_type]
    );
    const salesId = saleResult.rows[0].sales_id;

    // Insert each drink into orders
    for (const item of cart) {
      const { drink, modifications } = item;
      const toppingId = modifications.topping?.toppingId || null;
      const sizeId = modifications.sizeId;

      // Get or create variation_id
      let variationId;
      const variationResult = await client.query(
        `SELECT variation_id FROM drinkVariation
         WHERE drinkId = $1 AND sizeId = $2 AND sweetness = $3 AND iceLevel = $4 AND toppingId IS NOT DISTINCT FROM $5`,
        [drink.drinkId, sizeId, modifications.sweetness, modifications.ice, toppingId]
      );

      if (variationResult.rows.length > 0) {
        variationId = variationResult.rows[0].variation_id;
      } else {
        const insertVar = await client.query(
          `INSERT INTO drinkVariation (drinkId, sizeId, sweetness, iceLevel, toppingId)
           VALUES ($1, $2, $3, $4, $5) RETURNING variation_id`,
          [drink.drinkId, sizeId, modifications.sweetness, modifications.ice, toppingId]
        );
        variationId = insertVar.rows[0].variation_id;
      }

      // Get size extra cost
      const sizeResult = await client.query(
        `SELECT extra_cost FROM drink_sizes WHERE sizeId = $1`,
        [sizeId]
      );
      const sizeExtra = Number(sizeResult.rows[0]?.extra_cost || 0);

      // Calculate final price for this item
      const toppingCost = Number(modifications.topping?.extra_cost || 0);
      const price = (Number(drink.base_price) + toppingCost + sizeExtra) * Number(modifications.quantity) * tax;

      await client.query(
        `INSERT INTO orders (sales_id, variation_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [salesId, variationId, modifications.quantity, price]
      );
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
