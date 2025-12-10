import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesByDayChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/sales-by-day')
      .then(res => res.json())
      .then(data => {
        // Parse strings to numbers and create labels
        const labels = data.map(item => `${item.day_of_week}`);
        const numOrders = data.map(item => parseFloat(item.num_orders));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Number of Orders',
              data: numOrders,
              backgroundColor: 'rgba(168, 80, 195, 0.6)',
              borderColor: 'rgba(167, 80, 217, 1)',
              borderWidth: 1
            }
          ]
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading chart...</div>;

  return (
    <div className="widget-card">
      <h3 className="widget-title">Sales by Day</h3>
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,  // Allow full height usage
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Sales by Day of Week',
                color: '#e5e5e5'  // Theme text
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(59, 130, 246, 0.2)' },
                ticks: { color: '#a3a3a3' }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Orders', color: '#a3a3a3' },
                grid: { color: 'rgba(59, 130, 246, 0.1)' },
                ticks: { color: '#a3a3a3' }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default SalesByDayChart;
