import React from "react";

const FullPageSpinner = () => {
  const spinnerContainerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Light background to allow content behind to be seen
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    animation: "fadeIn 1s ease-in-out", // Fade-in effect for smoother UX
  };

  const spinnerStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "10px solid #f3f3f3", // Light gray outer border
    position: "relative", // Required for inner elements to be positioned properly
    animation: "spin 1.5s linear infinite, pulse 1.5s ease-in-out infinite", // Spinning and pulsing animation
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Soft shadow for better depth perception
  };

  const greenThreadStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "50%",
    height: "10px",
    borderRadius: "5px",
    background: "linear-gradient(90deg, #4CAF50 50%, rgba(0, 0, 0, 0) 100%)", // Gradient effect from thick to thin
    transformOrigin: "left",
    animation: "spinThread 1.5s linear infinite",
  };

  const keyframes = `
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
    
        @keyframes spinThread {
          0% {
            transform: rotate(0deg);
            width: 50%;
          }
          100% {
            transform: rotate(360deg);
            width: 20%;
          }
        }
    
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.7;
          }
        }
    
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `;

  return (
    <div style={spinnerContainerStyle}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}>
        {/* Spinning Green Thread */}
        <div style={greenThreadStyle}></div>
      </div>
    </div>
  );
};

export default FullPageSpinner;
