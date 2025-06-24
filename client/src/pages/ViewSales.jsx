// pages/ViewSales.jsx
import React from 'react';

const ViewSales = () => {
  const sales = [
    { product: 'Shirt', quantity: 2, total: 500 },
    { product: 'Pants', quantity: 1, total: 400 },
    { product: 'Sweater', quantity: 3, total: 900 }
  ];

  return (
    <div style={{ padding: '32px' }}>
      <h2>🧾 View Today's Sales</h2>

      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h3>Sales for Today</h3>
        <ul>
          {sales.map((sale, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>{sale.product}</strong> - {sale.quantity} items - ₹{sale.total}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewSales;
