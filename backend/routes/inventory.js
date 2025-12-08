import express from "express";
import { getDrinks, addDrink, updateDrink, deleteDrink } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/drinks", getDrinks);
router.post("/drinks", addDrink);
router.put("/drinks/:id", updateDrink);
router.delete("/drinks/:id", deleteDrink);

export default router;
