// inventoryController.js
import { pool } from "../db.js";

// get drinks from database
export const getDrinks = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.drink_id,
        d.drink_name,
        d.base_price,
        d.drink_type,
        di.ingredient_id,
        di.quantity,
        i.ingredient_name,
        i.unit
      FROM drinks d
      LEFT JOIN drink_ingredients di 
        ON d.drink_id = di.drink_id
      LEFT JOIN ingredients i 
        ON di.ingredient_id = i.ingredient_id
      ORDER BY d.drink_id
    `);
    const drinkMap = {};
    for (const row of result.rows) {
      if (!drinkMap[row.drink_id]) {
        drinkMap[row.drink_id] = {
          drink_id: row.drink_id,
          drink_name: row.drink_name,
          base_price: row.base_price,
          drink_type: row.drink_type,
          ingredients: [],
        };
      }
      if (row.ingredient_id !== null) {
        drinkMap[row.drink_id].ingredients.push({
          ingredient_id: row.ingredient_id,
          name: row.ingredient_name,
          quantity: row.quantity,
          unit: row.unit,
        });
      }
    }
    res.json(Object.values(drinkMap));
  } catch (err) {
    console.error("getDrinks error:", err);
    next(err);
  }
};

// add a new drink to database
export const addDrink = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { name, price, ingredients } = req.body;
    if (!name || price === undefined || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Invalid drink data" });
    }
    await client.query("BEGIN");
    const drinkResult = await client.query(
      "INSERT INTO drinks (drink_name, base_price) VALUES ($1, $2) RETURNING drink_id",
      [name, price]
    );
    const drinkId = drinkResult.rows[0].drink_id;
    for (const ing of ingredients) {
      const { name, quantity, unit } = ing;
      const findResult = await client.query(
        "SELECT ingredient_id FROM ingredients WHERE ingredient_name = $1",
        [name]
      );
      let ingredientId;
      if (findResult.rows.length > 0) {
        ingredientId = findResult.rows[0].ingredient_id;
      } else {
        const insertIngredientResult = await client.query(
          "INSERT INTO ingredients (ingredient_name, stock_quantity, unit) VALUES ($1, $2, $3) RETURNING ingredient_id",
          [name, quantity, unit]
        );
        ingredientId = insertIngredientResult.rows[0].ingredient_id;
      }
      await client.query(
        "INSERT INTO drink_ingredients (drink_id, ingredient_id, quantity) VALUES ($1, $2, $3)",
        [drinkId, ingredientId, quantity]
      );
    }
    await client.query("COMMIT");
    res.status(201).json({
      message: "Drink added successfully",
      drinkId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};
