// pages/SalesReport.jsx
import React, { useState, useEffect } from 'react';

const mockSalesData = [
  { id: 'INV001', date: '2025-04-20', customer: 'Amit', product: 'Cotton Kurti', quantity: 3, total: 1200 },
  { id: 'INV002', date: '2025-04-21', customer: 'Neha', product: 'Silk Saree', quantity: 1, total: 2000 },
  { id: 'INV003', date: '2025-04-22', customer: 'Ravi', product: 'Linen Shirt', quantity: 2, total: 1800 },
  // Add more mock data if needed
];

const SalesReport = () => {
  const [filteredSales, setFilteredSales] = useState(mockSalesData);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    let filtered = mockSalesData;

    if (fromDate) {
      filtered = filtered.filter(sale => new Date(sale.date) >= new Date(fromDate));
    }

    if (toDate) {
      filtered = filtered.filter(sale => new Date(sale.date) <= new Date(toDate));
    }

    setFilteredSales(filtered);
  }, [fromDate, toDate]);

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div style={{ padding: '32px' }}>
      <h2>🧾 Sales Report</h2>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label>From: </label>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ marginRight: '20px' }} />
        <label>To: </label>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
      </div>

      <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Invoice</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.date}</td>
              <td>{sale.customer}</td>
              <td>{sale.product}</td>
              <td>{sale.quantity}</td>
              <td>{sale.total}</td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>No sales in selected range</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 style={{ marginTop: '24px' }}>📊 Total Revenue: ₹{totalRevenue}</h3>
    </div>
  );
};

export default SalesReport;
