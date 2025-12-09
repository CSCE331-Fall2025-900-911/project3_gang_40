import { pool } from '../db.js';

export const getXReport = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(sales_time, 'HH24:00') AS hour_block,
        COUNT(CASE WHEN sale_type='Sale' THEN 1 END) AS sales_count,
        SUM(CASE WHEN sale_type='Sale' THEN total_price ELSE 0 END) AS sales_total,
        COUNT(CASE WHEN sale_type='Return' THEN 1 END) AS returns_count,
        SUM(CASE WHEN sale_type='Return' THEN total_price ELSE 0 END) AS returns_total,
        COUNT(CASE WHEN sale_type='Void' THEN 1 END) AS voids_count,
        SUM(CASE WHEN payment_method='Cash' AND sale_type='Sale' THEN total_price ELSE 0 END) AS cash_total,
        SUM(CASE WHEN payment_method='Card' AND sale_type='Sale' THEN total_price ELSE 0 END) AS card_total
      FROM sales_history
      WHERE sales_time::date = CURRENT_DATE
      AND reported = false
      GROUP BY hour_block
      ORDER BY hour_block
    `);

    const data = result.rows.map(row => ({
      ...row,
      returns_total: parseFloat(row.returns_total) * -1
    }));

    res.json(data);
  } catch (err) {
    console.error('X-Report error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const generateZReport = async (req, res, next) => {
  const client = await pool.connect(); // Use transaction
  try {
    await client.query('BEGIN');

    // Get all Z-Report data
    const grossSalesResult = await client.query(`
      SELECT COALESCE(SUM(total_price), 0) as value
      FROM sales_history WHERE sale_type = 'Sale' AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const returnsResult = await client.query(`
      SELECT COALESCE(SUM(total_price), 0) as value
      FROM sales_history WHERE sale_type = 'Return' AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const voidsResult = await client.query(`
      SELECT COALESCE(SUM(total_price), 0) as value
      FROM sales_history WHERE sale_type = 'Void' AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const cashResult = await client.query(`
      SELECT COALESCE(SUM(total_price), 0) as value
      FROM sales_history WHERE payment_method = 'Cash' AND sale_type = 'Sale' 
      AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const cardResult = await client.query(`
      SELECT COALESCE(SUM(total_price), 0) as value
      FROM sales_history WHERE payment_method = 'Card' AND sale_type = 'Sale' 
      AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const saleCountResult = await client.query(`
      SELECT COUNT(*) as value FROM sales_history 
      WHERE sale_type = 'Sale' AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const returnCountResult = await client.query(`
      SELECT COUNT(*) as value FROM sales_history 
      WHERE sale_type = 'Return' AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);
    
    const voidCountResult = await client.query(`
      SELECT COUNT(*) as value FROM sales_history 
      WHERE sale_type = 'Void' AND DATE(sales_time) = CURRENT_DATE AND reported = FALSE
    `);

    const grossSales = parseFloat(grossSalesResult.rows[0].value);
    const returns = parseFloat(returnsResult.rows[0].value);
    const voids = parseFloat(voidsResult.rows[0].value);
    const cash = parseFloat(cashResult.rows[0].value);
    const card = parseFloat(cardResult.rows[0].value);
    const saleCount = parseInt(saleCountResult.rows[0].value);
    const returnCount = parseInt(returnCountResult.rows[0].value);
    const voidCount = parseInt(voidCountResult.rows[0].value);

    const netSales = grossSales + returns;
    const totalWithoutTax = Math.round((netSales / 1.0825) * 20) / 20.0;
    const tax = netSales - totalWithoutTax;
    const startingCash = 150.00;
    const expectedDrawer = startingCash + cash + returns;

    // Mark sales as reported
    const updateResult = await client.query(`
      UPDATE sales_history SET reported = TRUE WHERE reported = FALSE
      RETURNING sales_id
    `);

    await client.query('COMMIT');

    res.json({
      grossSales, returns, voids, cash, card, saleCount, returnCount, voidCount,
      netSales, totalWithoutTax, tax, startingCash, expectedDrawer
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Z-Report error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
