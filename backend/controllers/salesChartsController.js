import { pool } from '../db.js';

// get sales by hour from database (for chart)
export const getSalesByHour = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT 
                TO_CHAR(sales_time, 'HH24') AS hour_of_day, 
                COUNT(sales_id) AS num_orders, 
                SUM(total_price) AS total_sales 
            FROM sales_history 
            GROUP BY TO_CHAR(sales_time, 'HH24') 
            ORDER BY hour_of_day
        `);
        res.json(result.rows);
    } catch (err) {
        next(err); 
    }
};

// get sales by day from database
export const getSalesByDay = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT 
                TRIM(TO_CHAR(sales_time, 'Day')) AS day_of_week, 
                COUNT(sales_id) AS num_orders,
                SUM(total_price) AS total_sales
            FROM sales_history 
            GROUP BY TRIM(TO_CHAR(sales_time, 'Day')) 
            ORDER BY num_orders DESC
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

// get orders by drink type for pie chart
export const getSalesByDrinkType = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT
                d.drink_type,
                COUNT(o.order_id) AS num_orders
            FROM sales_history sh
            JOIN orders o
                ON o.sales_id = sh.sales_id
            JOIN drink_variation dv
                ON dv.variation_id = o.variation_id
            JOIN drinks d
                ON d.drink_id = dv.drink_id
            GROUP BY d.drink_type
            ORDER BY num_orders DESC
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};