// StaffHomePage.jsx
import React from 'react';
import {FaUsers, FaSignOutAlt , FaUserAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StaffHomePage = () => {
  const navigate = useNavigate();
   const handleLogout = () => {
      navigate("/logout");
      toast.success("Logout Successful");
    };
  return (
    <>
      <header className="header" style={{ backgroundColor: '#3b4a6b' }}>
        <h1>Textile Shop – Sales Portal</h1>
        <div>
          Welcome, Staff <FaUsers size={40} color="blue" /> | <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}onClick={handleLogout}
                    >
                      <FaSignOutAlt size={20} />
                    </button>
        </div>
      </header>

      <main className="sales-container">
        <button className="sales-btn">💰 Create New Sale</button>
        <button className="sales-btn">📦 Check Product Availability</button>
        <button className="sales-btn">🧾 View Today’s Sales</button>
        <button className="sales-btn">👁️ Search Product</button>
      </main>
    </>
  );
};

export default StaffHomePage;
