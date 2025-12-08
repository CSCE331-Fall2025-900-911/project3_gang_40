import express from "express";
import { getDrinks, addDrink, updateDrink } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/drinks", getDrinks);
router.post("/drinks", addDrink);
router.put("/drinks/:id", updateDrink);

export default router;
