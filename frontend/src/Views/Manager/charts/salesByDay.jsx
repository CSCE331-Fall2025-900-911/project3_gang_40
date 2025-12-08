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

  if (loading) return <div>Loading chart...</div>;

  return (
    <div style={{ width: '800px', height: '400px' }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'Sales by Hour (Peak at 14:00)'
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: 'Orders' }
            }
          }
        }}
      />
    </div>
  );
};

export default SalesByDayChart;
