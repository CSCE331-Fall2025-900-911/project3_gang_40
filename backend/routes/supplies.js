// routes/supplies.js
import express from 'express';
import {
  getAllSupplies,
  getSupplyById,
  addSupply,
  updateSupply,
  deleteSupply,
  updateSupplyStock
} from '../controllers/suppliesController.js';

const router = express.Router();

// Get all supplies
router.get('/', getAllSupplies);

// Get single supply by ID
router.get('/:id', getSupplyById);

// Add new supply
router.post('/', addSupply);

// Update supply (full update)
router.put('/:id', updateSupply);

// Update only stock (for restocking)
router.patch('/:id/stock', updateSupplyStock);

// Delete supply
router.delete('/:id', deleteSupply);

export default router;