// src/components/FancySpinner/FancySpinner.jsx
import React from "react";
import "./FancySpinner.css";

const FancySpinner = () => {
  return (
    <div className="gooey-spinner-container">
      <div className="gooey-loader">
        <span></span><span></span><span></span><span></span>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default FancySpinner;
