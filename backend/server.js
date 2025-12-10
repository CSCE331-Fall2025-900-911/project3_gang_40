import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Routes
import drinksRoutes from './routes/drinks.js';
import toppingsRoutes from './routes/toppings.js';
import employeesRoutes from './routes/employees.js';
import inventoryRoutes from './routes/inventory.js';
import checkoutRoutes from './routes/checkout.js';
import returnsRoutes from './routes/returns.js';
import translationRouter from './routes/translation.js';
import emailRoutes from "./routes/email.js";
import salesChartsRoutes from './routes/salesCharts.js'
import reportsRoutes from './routes/reports.js';
import suppliesRoutes from './routes/supplies.js';


// Error 
import errorHandler from './errorHandler.js';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


app.use('/api/drinks', drinksRoutes);
app.use('/api/drinks/sizes', drinksRoutes);
app.use('/api/toppings', toppingsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/translation', translationRouter);
app.use('/api/inventory/supplies', suppliesRoutes);


app.use("/api", emailRoutes);
app.use("/api", salesChartsRoutes)
app.use("/api", reportsRoutes);
app.use('/api/inventory/supplies', suppliesRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Centralized error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
