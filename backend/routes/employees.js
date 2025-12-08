import express from 'express';
import { getAllEmployees, addEmployee, editEmployee, getCashiers } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/employeeManagement', getAllEmployees);
router.post("/employeeManagement", addEmployee);
router.put("/employeeManagement/:id", editEmployee);

router.get('/cashiers', getCashiers);

export default router;
