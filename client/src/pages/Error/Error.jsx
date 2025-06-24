import { Link } from "react-router-dom";
import "./Error.css";

import { FaSignInAlt } from "react-icons/fa";

export const Error = () => {
  return (
    <>
      <section id="error-page">
        <div className="err-content">
          <h2>404</h2>
          <h4>Sorry! Page not found</h4>
          <p style={{ margin: "20px" }}>
            Oops! It seems like the page you were trying to access doesn't
            exist. If you believe there is an issue, feel free to report it, and
            we'll look into it
          </p>
        </div>
        <Link to="/" className="combined-btn">
          Back to Login
          <div className="btn-icon">
            <FaSignInAlt />
          </div>
        </Link>
        <span style={{marginTop:'8px', fontSize:'20px'}}>or</span>
        
         <div className="lgt-footer" style={{marginTop:'0'}}> 
        <p> Report  <a href="https://wa.me/7829589843">Contact support</a> on Whats App
          </p></div>
      </section>
    </>
  );
};
