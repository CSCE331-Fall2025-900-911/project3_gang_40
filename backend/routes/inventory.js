// routes/inventory.js
import express from "express";
import { getDrinks, addDrink, updateDrink, deleteDrink } from "../controllers/inventoryController.js";
import {
  getAllIngredients,
  getIngredientById,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  updateStockQuantity
} from '../controllers/IngredientsController.js';

const router = express.Router();

// Drinks routes
router.get("/drinks", getDrinks);
router.post("/drinks", addDrink);
router.put("/drinks/:id", updateDrink);
router.delete("/drinks/:id", deleteDrink);

// Ingredients routes
router.get('/ingredients', getAllIngredients);
router.get('/ingredients/:id', getIngredientById);
router.post('/ingredients', addIngredient);
router.put('/ingredients/:id', updateIngredient);
router.patch('/ingredients/:id/stock', updateStockQuantity);
router.delete('/ingredients/:id', deleteIngredient);

export default router;