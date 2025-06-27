import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDeviceSize } from "../../context/DeviceSizeContext";
import { toast } from "react-toastify";

const Welcome = () => {
  const navigate = useNavigate();
  const { user, isFetching, isLoggedIn } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const { isMobile } = useDeviceSize();

  useEffect(() => {
    // Show the welcome message immediately
    setShowWelcome(true);

    if (!isFetching) {
      // If user is null or not logged in, redirect to login
      if (!user || !isLoggedIn) {
        toast.error("pehle Login karo")
        navigate("/");
        return; // Exit useEffect early
      }

      // with admin route
      const timeout = setTimeout(() => {
        if (!isFetching) {
          if (user.isOwner) {
            navigate("/Admin/Dashboard");
          } else if (user.role === "manager" || user.role === "salesman") {
            navigate(`/Staff/Dashboard`);
          } else {
            toast.error("You are not an authorized person");
          }
        }
      }, 1500);

      // Cleanup function
      return () => clearTimeout(timeout);
    }
  }, [isFetching, navigate, user, isLoggedIn]);

  // Define styles for the spinner container
  const faspinnerContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    color: "#000",
  };

  const headingStyle = {
    fontSize: isMobile ? "1.5rem" : "2rem",
    marginBottom: "0",
    marginLeft: "10px",
    marginRight: "10px",
    color: "#000",
  };

  return (
    <div className="welcomePage">
      {showWelcome && ( // Show loading indicator if fetching is in progress
        <div style={faspinnerContainerStyle}>
          <FontAwesomeIcon
            icon={faSpinner}
            className="fa-spin"
            size="3x"
            style={{ marginLeft: "20px" }}
          />
          <h1 style={headingStyle}>Welcome to Rehmat Textiles</h1>
        </div>
      )}
    </div>
  );
};

export { Welcome };
