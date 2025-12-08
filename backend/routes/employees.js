import express from 'express';
import { getAllEmployees, getCashiers } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/getAllEmployees', getAllEmployees);
router.get('/cashiers', getCashiers);

export default router;
