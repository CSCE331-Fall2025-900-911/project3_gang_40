import express from 'express';
import { getToppings } from '../controllers/toppingsController.js';

const router = express.Router();
router.get('/', getToppings);

export default router;
