import express from 'express';
import { getSalesByHour, getSalesByDay, getSalesByDrinkType, getTopSellingDrinks, getProductUsageReport } from '../controllers/salesChartsController.js';

const router = express.Router();

router.get('/sales-by-hour', getSalesByHour);
router.get('/sales-by-day', getSalesByDay);
router.get('/sales-by-drink-type', getSalesByDrinkType);
router.get('/top-selling-drinks', getTopSellingDrinks);
router.get('/product-usage', getProductUsageReport);

export default router;