import express from 'express';
import { getCashiers } from '../controllers/employeeController.js';

const router = express.Router();
router.get('/cashiers', getCashiers);

export default router;
