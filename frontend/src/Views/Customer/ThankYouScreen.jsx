import React from "react";
import "./css/Customer.css"; 

function ThankYouScreen({ onBackToLogin, userEmail, userPhone }) {
  const contact = userPhone && userPhone.trim() !== "" ? userPhone : userEmail;

  const contactLabel =
    userPhone && userPhone.trim() !== "" ? "phone number" : "email";

  
  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <h1>Thank You!</h1>
        <p>Your order has been successfully submitted!</p>
        <p> We sent an order confirmation to your {contactLabel}:</p>
        <p><strong>{contact}</strong></p>
        <button className="back-to-login-btn" onClick={onBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ThankYouScreen;