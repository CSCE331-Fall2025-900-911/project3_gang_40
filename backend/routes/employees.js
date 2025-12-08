import express from 'express';
import { getAllEmployees, addEmployee, editEmployee, deleteEmployee, getCashiers } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/employeeManagement', getAllEmployees);
router.post("/employeeManagement", addEmployee);
router.put("/employeeManagement/:id", editEmployee);
router.delete("/employeeManagement/:id", deleteEmployee);

router.get('/cashiers', getCashiers);

export default router;
