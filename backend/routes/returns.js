import express from 'express';
import { getRecentSales, getSalesDetails, createReturn } from '../controllers/returnsController.js';

const router = express.Router();

router.get('/recent', getRecentSales);
router.get('/:id', getSalesDetails);
router.post('/', createReturn);

export default router;
