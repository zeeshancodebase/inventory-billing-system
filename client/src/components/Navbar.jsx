import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/"><IoMenu /></Link>
        <Link to="/">
          <FaHome size={22} />
        </Link>
        <Link to="/products">Products</Link>
        <Link to="/purchases">Purchases</Link>
        <Link to="/sales">Sales</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings-backup">Settings</Link>
      </div>
    </nav>
  );
};

export default Navbar;
