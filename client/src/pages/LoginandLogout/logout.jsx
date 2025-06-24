import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from "../../context/auth";
import { useEffect } from "react";

const Logout = () => {
  const navigate = useNavigate();
  const { LogoutUser } = useAuth();

  useEffect(() => {
    LogoutUser();
  }, [LogoutUser]);

  const handleLoginAgain = () => {
    navigate('/login');
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.logoutBox}>
        <FaSignOutAlt size={50} style={styles.icon} />
        <h2 style={styles.heading}>You have been logged out</h2>
        <p style={styles.subtext}>Let's proceed with our tasks!</p>

        <button style={styles.loginButton} onClick={handleLoginAgain}>
          Login Again
          <FaSignInAlt style={{ marginLeft: 8 , fontSize:'20px'}} />
        </button>

        <div style={styles.footer}>
          <p>
            Need help?{' '}
            <a href="mailto:support@znotes.in" style={styles.link}>
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  logoutBox: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  icon: {
    color: '#d9534f',
    marginBottom: '20px',
    transform: 'scaleX(-1)',
  },
  heading: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '10px',
  },
  subtext: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '25px',
  },
  loginButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    padding: '10px 18px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    marginTop: '30px',
    fontSize: '14px',
    color: '#777',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Logout;
