import express from 'express';
import { getAllEmployees, addEmployee, getCashiers } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/employeeManagement', getAllEmployees);
router.post("/employeeManagement", addEmployee);

router.get('/cashiers', getCashiers);

export default router;
