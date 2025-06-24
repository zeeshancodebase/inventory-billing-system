import React from "react";
import { Link } from "react-router-dom";
import { FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
    toast.success("Logout Successful");
  };
  return (
    <header className="header">
      {/* <h1>Textile Merchant Admin Panel</h1> */}
      <Link to="/">
        <h1 style={{ color: "white", cursor: "pointer" }}>Rehmat Textile</h1>
      </Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaUserShield size={25} />
        <div style={{ marginLeft: "4px" }}>
          Admin |{" "}
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            aria-label="Logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
