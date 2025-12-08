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

// get top selling drinks by time frame
export const getTopSellingDrinks = async (req, res, next) => {
    try {
        
        const { timeFrame } = req.query;
        if (!timeFrame) {
            return res.status(400).json({ error: 'Missing timeFrame parameter' });
        }
        
        let interval;
        switch (timeFrame) {
            case 'Last Day':
                interval = "INTERVAL '1 day'";
                break;
            case 'Last Week':
                interval = "INTERVAL '7 days'";
                break;
            case 'Last Month':
                interval = "INTERVAL '1 month'";
                break;
            case 'Last Year':
                interval = "INTERVAL '1 year'";
                break;
            default:
                return res.status(400).json({ error: `Invalid timeFrame: ${timeFrame}` });
        }

        // FIXED: Use sales_history.total_price instead of dv.price
        const result = await pool.query(`
            SELECT 
                d.drink_name,
                SUM(o.quantity) AS quantity_sold,
                SUM(sh.total_price) AS total_revenue
            FROM orders o
            JOIN drink_variation dv ON o.variation_id = dv.variation_id
            JOIN drinks d ON dv.drink_id = d.drink_id
            JOIN sales_history sh ON o.sales_id = sh.sales_id
            WHERE sh.sales_time >= NOW() - ${interval}
            GROUP BY d.drink_name
            ORDER BY quantity_sold DESC
            LIMIT 5
        `);

        const totalResult = await pool.query(`
            SELECT 
                SUM(o.quantity) AS total_quantity_sold,
                SUM(sh.total_price) AS total_sales_revenue
            FROM orders o
            JOIN sales_history sh ON o.sales_id = sh.sales_id
            WHERE sh.sales_time >= NOW() - ${interval}
        `);

        res.json({
            topDrinks: result.rows,
            totals: totalResult.rows[0] || { total_quantity_sold: 0, total_sales_revenue: 0 }
        });
    } catch (err) {
        console.error('Database error:', err);
        next(err);
    }
};

export const getProductUsageReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await pool.query(
      `SELECT 
        i.ingredient_name,
        i.unit,
        COALESCE(SUM(di.quantity * o.quantity), 0) AS total_used,
        i.stock_quantity AS current_stock
      FROM ingredients i
      LEFT JOIN drink_ingredients di ON i.ingredient_id = di.ingredient_id
      LEFT JOIN drink_variation dv ON di.drink_id = dv.drink_id
      LEFT JOIN orders o ON dv.variation_id = o.variation_id
      LEFT JOIN sales_history sh ON o.sales_id = sh.sales_id
      WHERE sh.sales_time BETWEEN $1 AND $2
         OR sh.sales_time IS NULL
      GROUP BY i.ingredient_id, i.ingredient_name, i.unit, i.stock_quantity
      ORDER BY i.ingredient_name`,
      [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
    );

    // Return clean JSON data for JSX styling
    res.json({ 
      ingredients: result.rows,
      period: { startDate, endDate }
    });
  } catch (err) {
    console.error('Product usage error:', err);
    res.status(500).json({ error: err.message });
  }
};



