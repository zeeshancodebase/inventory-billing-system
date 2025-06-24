import React from "react";

const spinnerBackdropStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const spinnerStyle = {
  width: "60px",
  height: "60px",
  border: "6px solid #e0e0e0",
  borderTop: "6px solid #007BFF",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  transition: "all 0.3s ease-in-out",
};

const Spinner = () => {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={spinnerBackdropStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default Spinner;
