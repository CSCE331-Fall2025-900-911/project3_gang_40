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
    const { name, price, ingredients, drink_type } = req.body;
    if (!name || price === undefined || !drink_type || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: "Invalid drink data" });
        }
    const cleanPrice = Number(price);
    if (!Number.isFinite(cleanPrice) || cleanPrice < 0 || cleanPrice > 99999999.99) {
      return res.status(400).json({ message: "Invalid price value", received: price });
    }
    await client.query("BEGIN");
    const drinkInsert = await client.query(
        "INSERT INTO drinks (drink_name, base_price, drink_type) VALUES ($1, $2, $3) RETURNING drink_id",
        [name.trim(), cleanPrice, drink_type]
        );
    const drinkId = drinkInsert.rows[0].drink_id;
    for (const ing of ingredients) {
      const { name: ingName, quantity, unit } = ing;
      if (!ingName || quantity === undefined || !unit) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Invalid ingredient data" });
      }
      let ingredientId;
      const findIng = await client.query(
        "SELECT ingredient_id FROM ingredients WHERE ingredient_name = $1",
        [ingName.trim()]
      );
      if (findIng.rows.length > 0) {
        ingredientId = findIng.rows[0].ingredient_id;
      } else {
        const insertIng = await client.query(
          "INSERT INTO ingredients (ingredient_name, stock_quantity, unit) VALUES ($1, $2, $3) RETURNING ingredient_id",
          [ingName.trim(), Number(quantity), unit.trim()]
        );
        ingredientId = insertIng.rows[0].ingredient_id;
      }
      await client.query(
        "INSERT INTO drink_ingredients (drink_id, ingredient_id, quantity) VALUES ($1, $2, $3)",
        [drinkId, ingredientId, Number(quantity)]
      );
    }
    await client.query("COMMIT");
    res.status(201).json({ message: "Drink added successfully", drinkId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ADD DRINK ERROR:", err);
    next(err);
  } finally {
    client.release();
  }
};

// update an existing drink in the database
export const updateDrink = async (req, res, next) => {
  const { id } = req.params;
  const { name, price, ingredients, drink_type } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE drinks SET drink_name = $1, base_price = $2, drink_type = $3 WHERE drink_id = $4",
      [name, price, drink_type, id]
    );
    await client.query(
      "DELETE FROM drink_ingredients WHERE drink_id = $1",
      [id]
    );
    for (const ing of ingredients) {
      await client.query(
        `
        INSERT INTO drink_ingredients (drink_id, ingredient_id, quantity)
        VALUES (
          $1,
          (SELECT ingredient_id FROM ingredients WHERE ingredient_name = $2),
          $3
        )
        `,
        [id, ing.name, ing.quantity]
      );
    }
    await client.query("COMMIT");
    res.json({ message: "Drink updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

// delete a drink from the database
export const deleteDrink = async (req, res, next) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM drinks WHERE drink_id = $1",
      [id]
    );
    await client.query("COMMIT");
    res.json({ message: "Drink deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};
