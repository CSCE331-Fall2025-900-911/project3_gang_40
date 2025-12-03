import React from "react";
import "./css/Customer.css"; 

function ThankYouScreen({ onBackToLogin }) {
  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <h1>Thank You!</h1>
        <p>Your order has been successfully submitted.</p>
        <button className="back-to-login-btn" onClick={onBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ThankYouScreen;