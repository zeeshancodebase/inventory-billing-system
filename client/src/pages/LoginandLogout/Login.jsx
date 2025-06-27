import React, { useState } from "react";
import { MDBBtn, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import "./login.css";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// const BASE_URL = "http://localhost:5000";
const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { BASE_URL, storeTokenInLS } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!phoneNumber || !password) {
        toast.error("Please enter both phone number and password");
        return;
      }

      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      });
      // console.log("Data sent from frontend: ",phoneNumber, password)

      const data = await res.json();
      if (res.ok) {
        storeTokenInLS(data.token);
        toast.success("Login successful!");
        navigate("/welcome");
      } else {
         toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>Rehmat Textiles</h1>
      </div>
      <div className="login-container">
        <div className="login-img-container">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="img-fluid"
            alt="Sample image"
          />
        </div>
        <div className="login-form-container">
          <h2 style={{ marginBottom: "35px" }}>Login</h2>
          <MDBInput
            wrapperClass="mb-4 login-input"
            label="Mobile No."
            id="phoneInput"
            type="tel"
            size="lg"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="mb-4 login-input pin-input-wrapper">
            <div className="pin-input-container">
              <MDBInput
                wrapperClass="p-0.98"
                label="PIN"
                id="pinInput"
                type={showPassword ? "text" : "password"}
                className="form-control"
                maxLength={6}
                value={password}
                onChange={(e) => {
                  const pin = e.target.value;
                  if (/^\d*$/.test(pin) && pin.length <= 6) {
                    setPassword(pin);
                  }
                }}
              />
              <span
                className="toggle-pin-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="remember-forget-links">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
              disabled
            />
            <Link to="/resetPassword">Forgot password?</Link>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn
              className="mb-0 px-5"
              size="lg"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color="#fff" loading={loading} size={20} />
              ) : (
                "Login"
              )}
            </MDBBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
