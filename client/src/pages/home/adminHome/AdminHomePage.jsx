// AdminHomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import ClockWidget from "../../../components/ClockWidget/ClockWidget";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };
  return (
    <>
      <Header />

      <Navbar />

      <main className="dashboard">
        <h2>Dashboard Overview</h2>
        <div className="card-grid">
          <div className="card">
            <h2>Today's Sales</h2>
            <p>₹23,500</p>
          </div>
          <div className="card">
            <h2>Inventory Value</h2>
            <p>₹1,20,000</p>
          </div>
          <div className="card">
            <h2>Low Stock</h2>
            <p>7 Items</p>
          </div>
          <div className="card">
            <h2>Pending Payments</h2>
            <p>₹8,000</p>
          </div>
          <div className="card">
            <h2>Top Product</h2>
            <p>Blue Cotton Saree</p>
          </div>
        </div>

        <h2 style={{ marginTop: "40px" }}>Quick Actions</h2>
        <div className="shortcut-grid">
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/add-product")}
          >
            ➕ Add Product
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/new-purchase")}
          >
            📥 New Purchase
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/new-sale")}
          >
            💰 New Sale
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/sales-report")}
          >
            🧾 Sales Report
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/inventory")}
          >
            📦 Inventory
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/manage-staff")}
          >
            🧍‍♂️ Manage Staff
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/invoice-history")}
          >
            🧾 Invoice History
          </button>
          <button
            className="shortcut-btn"
            onClick={() => handleNavigate("/settings-backup")}
          >
            🛠 Settings / Backup
          </button>
          <ClockWidget />
        </div>
      </main>
    </>
  );
};

export default AdminHomePage;
