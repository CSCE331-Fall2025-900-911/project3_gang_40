import { pool } from '../db.js';
import { sendOrderConfirmationEmailBackend, sendOrderReadyEmailBackend } from '../routes/email.js';

export const checkout = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      cart, employee_id = null, customer_id = null, payment_method = 'Card',
      sale_type = 'Sale', tax = 1.0825, isCustomerOrder = false, customerEmail = null
    } = req.body;

    if (!cart || cart.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    await client.query('BEGIN');

    // Size map + total price
    const sizeRes = await client.query('SELECT size_id, extra_cost FROM drink_sizes');
    const sizeMap = {};
    sizeRes.rows.forEach(row => sizeMap[row.size_id] = Number(row.extra_cost));

    const totalPrice = cart.reduce((sum, item) => {
      const base = Number(item.drink.base_price);
      const sizeExtra = sizeMap[item.modifications.size_id] || 0;
      const quantity = Number(item.modifications.quantity);
      const toppingsExtraCost = (item.modifications.selected_toppings || []).reduce((topSum, topping) => {
        return topSum + Number(topping.extra_cost || 0);
      }, 0);
      return sum + (base + toppingsExtraCost + sizeExtra) * quantity * tax;
    }, 0);

    // Insert sale
    const saleResult = await client.query(
      `INSERT INTO sales_history (customer_id, employee_id, sales_time, total_price, payment_method, sale_type)
       VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING sales_id`,
      [customer_id, employee_id, totalPrice, payment_method, sale_type]
    );
    const salesId = saleResult.rows[0].sales_id;

    // Process each item
    for (const item of cart) {
      const { drink, modifications } = item;
      const size_id = modifications.size_id;
      const selected_topping_ids = (modifications.selected_toppings || []).map(t => t.topping_id);

      // console.log(`Processing: ${drink.drink_name} (id:${drink.drink_id})`);

      // VALIDATE drink_id FIRST
      const drinkCheck = await client.query(`SELECT 1 FROM drinks WHERE drink_id = $1`, [drink.drink_id]);
      if (drinkCheck.rows.length === 0) {
        throw new Error(`Invalid drink_id ${drink.drink_id}: ${drink.drink_name}`);
      }

      // STEP 1: Create/find topping_config_id WITHOUT dummy rows
      let topping_config_id;
      if (selected_topping_ids.length === 0) {
        // No toppings = topping_id 11
        const noToppings = await client.query(
          `SELECT topping_config_id FROM drink_variation_toppings WHERE topping_id = 11 LIMIT 1`
        );
        topping_config_id = noToppings.rows[0]?.topping_config_id || 586; // Reuse 586 if exists
      } else {
        // Find exact topping combo
        const existingConfig = await client.query(
          `SELECT dvt.topping_config_id
          FROM drink_variation_toppings dvt
          WHERE dvt.topping_id = ANY($1::int[])
          GROUP BY dvt.topping_config_id
          HAVING COUNT(dvt.topping_id) = array_length($1::int[], 1)
            AND COUNT(DISTINCT dvt.topping_id) = array_length($1::int[], 1)`,
          [selected_topping_ids]
        );
        topping_config_id = existingConfig.rows[0]?.topping_config_id;
        
        if (!topping_config_id) {
          // NEW config using sequence
          const newId = await client.query(`SELECT nextval('drink_variation_topping_config_id_seq')`);
          topping_config_id = newId.rows[0].nextval;
          for (const toppingId of selected_topping_ids) {
            await client.query(
              `INSERT INTO drink_variation_toppings (topping_config_id, topping_id) VALUES ($1, $2)`,
              [topping_config_id, toppingId]
            );
          }
        }
      }
      // console.log(`  → topping_config_id: ${topping_config_id}`);

      try {
        const variation = await client.query(
          `INSERT INTO drink_variation (drink_id, size_id, sweetness, ice_level, topping_config_id)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (drink_id, size_id, sweetness, ice_level, topping_config_id) 
          DO NOTHING
          RETURNING variation_id`,
          [drink.drink_id, size_id, modifications.sweetness, modifications.ice, topping_config_id]
        );
        
        let variation_id = variation.rows[0]?.variation_id;
        
        // If conflict, get existing
        if (!variation_id) {
          const existing = await client.query(
            `SELECT variation_id FROM drink_variation 
            WHERE drink_id = $1 AND size_id = $2 AND sweetness = $3 AND ice_level = $4 AND topping_config_id = $5`,
            [drink.drink_id, size_id, modifications.sweetness, modifications.ice, topping_config_id]
          );
          variation_id = existing.rows[0].variation_id;
        }
        
        // console.log(`  → variation_id: ${variation_id}`);
        
        const sizeResult = await client.query(`SELECT extra_cost FROM drink_sizes WHERE size_id = $1`, [size_id]);
        const sizeExtra = Number(sizeResult.rows[0]?.extra_cost || 0);
        const toppingsExtraCost = selected_topping_ids.reduce((sum, toppingId) => {
          const topping = modifications.selected_toppings?.find(t => t.topping_id == toppingId);
          return sum + Number(topping?.extra_cost || 0);
        }, 0);

        const price = (Number(drink.base_price) + toppingsExtraCost + sizeExtra) * Number(modifications.quantity) * tax;

        await client.query(
          `INSERT INTO orders (sales_id, variation_id, quantity, price) VALUES ($1, $2, $3, $4)`,
          [salesId, variation_id, modifications.quantity, price]
        );

        // Stock decrement
        const ingredientsResult = await client.query(`SELECT ingredient_id, quantity FROM drink_ingredients WHERE drink_id = $1`, [drink.drink_id]);
        for (const ing of ingredientsResult.rows) {
          const requiredPerCup = Number(ing.quantity);
          const totalUsed = requiredPerCup * Number(modifications.quantity);
          const stockResult = await client.query(`SELECT stock_quantity FROM ingredients WHERE ingredient_id = $1 FOR UPDATE`, [ing.ingredient_id]);
          const currentStock = Number(stockResult.rows[0].stock_quantity);
          if (currentStock < totalUsed) {
            throw new Error(`Out of stock: ingredient ${ing.ingredient_id}`);
          }
          await client.query(`UPDATE ingredients SET stock_quantity = stock_quantity - $1 WHERE ingredient_id = $2`, [totalUsed, ing.ingredient_id]);
        }
        
      } catch (err) {
        console.error(`Variation error for ${drink.drink_name}:`, err.message);
        throw err;
      }
    }

    await client.query('COMMIT');

    // Email logic
    if (isCustomerOrder && customerEmail) {
      try {
        await sendOrderConfirmationEmailBackend(customerEmail, salesId, cart);
        console.log(`Order confirmation email sent to ${customerEmail}`);
        setTimeout(async () => {
          try {
            await sendOrderReadyEmailBackend(customerEmail, salesId);
            console.log(`Order ready email sent to ${customerEmail}`);
          } catch (err) {
            console.error('Failed to send order ready email:', err);
          }
        }, 2 * 60 * 1000);
      } catch (err) {
        console.error('Failed to send confirmation email:', err);
      }
    }

    // console.log(`SUCCESS! Sales ID: ${salesId}`);
    res.status(201).json({ message: 'Order successfully added', salesId, totalPrice });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
