// pages/CheckStock.jsx
import React, { useState } from 'react';

const CheckStock = () => {
  const [search, setSearch] = useState('');
  const [products] = useState([
    { name: 'Shirt', category: 'Clothing', stock: 120 },
    { name: 'Pants', category: 'Clothing', stock: 80 },
    { name: 'Jacket', category: 'Outerwear', stock: 50 },
    { name: 'Sweater', category: 'Clothing', stock: 200 },
    { name: 'Scarf', category: 'Accessories', stock: 150 }
  ]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }}>
      <h2>📦 Check Stock Availability</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a product..."
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h3>Product Stock</h3>
        {filteredProducts.length > 0 ? (
          <ul>
            {filteredProducts.map((product, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{product.name}</strong> - {product.category} - Stock: {product.stock}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CheckStock;
