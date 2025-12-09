import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DrinkTypePieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://project3-gang-40-sjzu.onrender.com/api/sales-by-drink-type')
      .then(res => res.json())
      .then(data => {
        const labels = data.map(item => item.drink_type);
        const numOrders = data.map(item => parseInt(item.num_orders));

        const colors = [
          'rgba(255, 99, 132, 0.8)',  // Milky
          'rgba(54, 162, 235, 0.8)',  // Fruity  
          'rgba(255, 206, 86, 0.8)',  // Classic
          'rgba(97, 17, 111, 0.8)',  // Special
          'rgba(7, 150, 22, 0.8)',  // Blended
        ];

        setChartData({
          labels: labels,
          datasets: [{
            data: numOrders,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: colors.slice(0, labels.length).map(c => c.replace('0.8', '1')),
            borderWidth: 2
          }]
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching drink type data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading pie chart...</div>;

  return (
    <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Orders by Drink Type'
            }
          }
        }}
      />
    </div>
  );
};

export default DrinkTypePieChart;
