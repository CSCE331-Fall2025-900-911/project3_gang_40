import React, { useState } from "react";
import "../css/LoginModal.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function LoginModal({ onClose, onLoginSuccess, translatedTexts }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [error, setError] = useState("");
  const [googleClicked, setGoogleClicked] = useState(false);

  if (!clientId) {
    return (
      <div className="modal-overlay">
        <div className="modal glass-modal">
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close configuration error dialog"
          >
            ✕
          </button>
          <h2>Configuration Error</h2>
          <p className="config-error-text">
            Google OAuth Client ID is missing. Add
            <b> VITE_GOOGLE_CLIENT_ID </b>
            to your .env file.
          </p>
          <button className="btn btn-secondary full-width" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleClick = () => {
    setError("");
    setGoogleClicked(true);

    setTimeout(() => {
      if (googleClicked) {
        setError("Google login failed — no response received.");
      }
    }, 4000);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setGoogleClicked(false);
    setError("");

    if (!credentialResponse?.credential) {
      setError("Google login failed — no credentials received.");
      return;
    }

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
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="modal-overlay">
        <div
          className="modal glass-modal"
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

          <p className="modal-subtitle">
            Sign in to earn Share Tea rewards.
          </p>

          <div className="google-login-wrapper">
            <GoogleLogin
              onClick={handleGoogleClick}
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setError("Google login was cancelled or failed.")
              }
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <p className="divider">or</p>

          <input
            type="email"
            placeholder="Email (coming soon)"
            className="input-field"
            disabled
          />
          <input
            type="password"
            placeholder="Password (coming soon)"
            className="input-field"
            disabled
          />

          <button
            className="btn btn-secondary submit-btn disabled full-width"
            disabled
            onClick={() => setError("Only Google login is supported.")}
          >
            {translatedTexts?.loginButton || "Login"}
          </button>

          <p className="info-text">Email login coming soon.</p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginModal;
