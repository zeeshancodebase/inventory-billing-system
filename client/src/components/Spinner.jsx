import React from "react";

const Spinner = () => {
    const spinnerContainerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    };

    const spinnerStyle = {
        width: "50px",
        height: "50px",
        border: "5px solid rgb(0, 0, 0)",
        borderTop: "5px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    };

    const keyframesStyle = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    return (
        <div style={spinnerContainerStyle}>
            <style>{keyframesStyle}</style>
            <div style={spinnerStyle}></div>
        </div>
    );
};

export default Spinner;
