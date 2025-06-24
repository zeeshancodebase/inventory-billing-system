// pages/NewPurchase.jsx
import React, { useState } from 'react';

const NewPurchase = () => {
  const [purchase, setPurchase] = useState({
    supplier: '',
    product: '',
    sku: '',
    quantity: '',
    pricePerUnit: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.values(purchase).every(val => val.trim() !== '');
    if (!isValid) {
      alert('Please fill out all fields.');
      return;
    }

    console.log('Purchase submitted:', purchase);
    setSuccess(true);

    // Reset
    setPurchase({
      supplier: '',
      product: '',
      sku: '',
      quantity: '',
      pricePerUnit: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>📥 Record New Purchase</h2>

      <form onSubmit={handleSubmit}>
        <label>Supplier Name *</label><br />
        <input type="text" name="supplier" value={purchase.supplier} onChange={handleChange} /><br /><br />

        <label>Product Name *</label><br />
        <input type="text" name="product" value={purchase.product} onChange={handleChange} /><br /><br />

        <label>SKU / Code *</label><br />
        <input type="text" name="sku" value={purchase.sku} onChange={handleChange} /><br /><br />

        <label>Quantity *</label><br />
        <input type="number" name="quantity" value={purchase.quantity} onChange={handleChange} /><br /><br />

        <label>Price per Unit (₹) *</label><br />
        <input type="number" name="pricePerUnit" value={purchase.pricePerUnit} onChange={handleChange} /><br /><br />

        <label>Purchase Date *</label><br />
        <input type="date" name="date" value={purchase.date} onChange={handleChange} /><br /><br />

        <label>Notes</label><br />
        <textarea name="notes" value={purchase.notes} onChange={handleChange} rows="3"></textarea><br /><br />

        <button type="submit" style={{
          background: '#2e3a59',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}>Save Purchase</button>

        {success && <p style={{ color: 'green', marginTop: '10px' }}>Purchase recorded successfully ✅</p>}
      </form>
    </div>
  );
};

export default NewPurchase;
