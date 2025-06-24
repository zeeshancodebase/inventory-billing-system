// pages/Charts.jsx
import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [salesData, setSalesData] = useState(null);
  const [productMovementData, setProductMovementData] = useState(null);

  // Simulate API call for dynamic data fetching
  useEffect(() => {
    setTimeout(() => {
      // Mock sales data (this would be fetched from an API in a real-world scenario)
      setSalesData({
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
      });

      // Mock product movement data (this too would come from an API in a real-world case)
      setProductMovementData({
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
      });
    }, 1500);  // Simulate delay in fetching data
  }, []);

  // Loading state while data is being fetched
  if (!salesData || !productMovementData) {
    return (
      <div style={styles.loadingContainer}>
        <div>Loading charts...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>📊 Sales & Product Movement Overview</h2>

      {/* Chart Section with Two-Column Layout */}
      <div style={styles.chartWrapper}>
        {/* Sales Trend Chart */}
        <div style={styles.chartCard}>
          <h3>Sales Trend This Week</h3>
          <Line data={salesData} options={chartOptions} />
        </div>

        {/* Product Movement Chart */}
        <div style={styles.chartCard}>
          <h3>Product Movement</h3>
          <Bar data={productMovementData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Basic chart options for responsiveness and appearance
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      grid: { display: true }
    }
  },
};

// Styles for the updated UI/UX
const styles = {
  container: {
    padding: '32px',
    fontFamily: 'Arial, sans-serif',
  },
  loadingContainer: {
    padding: '32px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00bcd4',
  },
  chartWrapper: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  chartCard: {
    flex: '1 1 45%', // Makes it responsive, with a max of two columns
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    height: '400px', // Fixed height for charts to prevent long scrolling
    minWidth: '300px', // Prevents it from becoming too narrow on small screens
  },
};

export default Charts;
