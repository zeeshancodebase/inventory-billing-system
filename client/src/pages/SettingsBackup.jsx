// pages/SettingsBackup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsBackup = () => {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("Rehmat Textile"); // Updated shop name
  const [email, setEmail] = useState("contact@rehmattextile.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [logo, setLogo] = useState(null);
  const [autoBackup, setAutoBackup] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    setLogo(URL.createObjectURL(file)); // Preview uploaded image
  };

  const handleBackup = () => {
    alert("This option is not enabled");
  };

  return (
    <div style={{ padding: "32px" }}>
      <h2>⚙️ Store Settings & Backup</h2>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Store Settings</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Shop Name:</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            style={{ marginLeft: "10px", padding: "8px", width: "250px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: "10px", padding: "8px", width: "250px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginLeft: "10px", padding: "8px", width: "250px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Upload Logo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ marginLeft: "10px" }}
          />
          {logo && (
            <img
              src={logo}
              alt="Logo Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Backup Settings</h3>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={handleBackup}
            style={{
              backgroundColor: "#2e3a59",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Start Manual Backup
          </button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={autoBackup}
              onChange={() => setAutoBackup(!autoBackup)}
              style={{ marginRight: "10px" }}
            />
            Enable Auto Backup
          </label>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Security Settings</h3>
        <div>
          <h4>Change Admin Password:</h4>
          <input
            type="password"
            placeholder="Enter Current Password"
            style={{ marginLeft: "10px", padding: "8px", width: "250px" }}
          />
          <input
            type="password"
            placeholder="Enter New Password"
            style={{ marginLeft: "10px", padding: "8px", width: "250px" }}
          />
          <input
            type="password"
            placeholder="Re-enter New Password"
            style={{ marginLeft: "10px", padding: "8px", width: "250px" }}
          />
          <button
            style={{
              backgroundColor: "#2e3a59",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginLeft: "8px",
              fontSize: "12px",
            }}
            onClick={() => navigate("/resetPassword")}
          >
            Change password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsBackup;
