import express from 'express';
import { getDrinks, getDrinkSizes } from '../controllers/drinksController.js';

const router = express.Router();

router.get('/', getDrinks);
router.get('/sizes', getDrinkSizes);

export default router;
 we 