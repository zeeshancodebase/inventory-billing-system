// pages/Charts.jsx
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Charts = () => {
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales This Week',
        data: [500, 700, 400, 600, 800, 900, 1000],
        fill: false,
        borderColor: '#00bcd4',
        tension: 0.1
      }
    ]
  };

  const productMovementData = {
    labels: ['Shirt', 'Pants', 'Jacket', 'Sweater', 'Scarf'],
    datasets: [
      {
        label: 'Product Movement',
        data: [150, 200, 120, 180, 90],
        backgroundColor: '#2e3a59',
        borderColor: '#2e3a59',
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{ padding: '32px' }}>
      <h2>📊 Sales & Product Movement</h2>

      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h3>Sales Trend This Week</h3>
        <Line data={salesData} options={{ responsive: true }} />
      </div>

      <div style={{ marginTop: '30px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h3>Product Movement</h3>
        <Bar data={productMovementData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Charts;
