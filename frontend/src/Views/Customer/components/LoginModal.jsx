import React, { useState } from "react";
import "../css/LoginModal.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function LoginModal({ onClose, onLoginSuccess, translatedTexts, largeMode }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [error, setError] = useState("");
  const [googleClicked, setGoogleClicked] = useState(false);

  // If clientId is missing, show error
  if (!clientId) {
    return (
      <div className={`modal-overlay ${largeMode ? "large" : ""}`}>
        <div className={`modal glass-modal ${largeMode ? "modal-large" : ""}`} role="dialog">
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close configuration error dialog"
          >
            ✕
          </button>
          <h2>Configuration Error</h2>
          <p style={{ color: "red" }}>
            Google OAuth Client ID is missing. Add{" "}
            <b>VITE_GOOGLE_CLIENT_ID</b> to your .env file.
          </p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const handleGoogleClick = () => {
    setGoogleClicked(true);
    setError("");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const jwt = credentialResponse.credential;
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      const email = payload?.email;

      if (!email) {
        setError("Could not read Google account email.");
        return;
      }

      onLoginSuccess(email);
    } catch (err) {
      console.error(err);
      setError("Failed to process Google login.");
    } finally {
      setGoogleClicked(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={`modal-overlay ${largeMode ? "large" : ""}`}>
        <div className={`modal glass-modal ${largeMode ? "modal-large" : ""}`} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="login-modal-title"
        >
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close login dialog"
          >
            ✕
          </button>

          <h2 id="login-modal-title" className="modal-title">
            {translatedTexts?.loginTitle || "Login"}
          </h2>

          <p className="modal-subtitle">Sign in to earn Share Tea rewards.</p>

          <div className="google-login-wrapper">
            <GoogleLogin
              onClick={handleGoogleClick}
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login was cancelled or failed.")}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginModal;
