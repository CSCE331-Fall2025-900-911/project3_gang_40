import express from 'express';
import { getXReport, generateZReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/x-report', getXReport);
router.post('/z-report', generateZReport);

export default router;
