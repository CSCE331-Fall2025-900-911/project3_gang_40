import express from 'express';
import { getSalesByHour, getSalesByDay, getSalesByDrinkType } from '../controllers/salesChartsController.js';

const router = express.Router();

router.get('/sales-by-hour', getSalesByHour);
router.get('/sales-by-day', getSalesByDay);
router.get('/sales-by-drink-type', getSalesByDrinkType);

export default router;