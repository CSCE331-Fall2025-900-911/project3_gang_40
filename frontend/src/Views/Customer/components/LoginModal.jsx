import React, { useState } from "react";
import "../css/LoginModal.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function LoginModal({ onClose, onLoginSuccess, translatedTexts }) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("Google Client ID:", clientId);


    const [error, setError] = useState("");
    const [googleClicked, setGoogleClicked] = useState(false);

    // If clientId is missing, stop everything.
    if (!clientId) {
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Configuration Error</h2>
                    <p style={{ color: "red" }}>
                        Google OAuth Client ID is missing.
                        Add <b>VITE_GOOGLE_CLIENT_ID</b> to your .env file.
                    </p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    // Called when Google button is clicked (even before popup opens)
    const handleGoogleClick = () => {
        setError("");
        setGoogleClicked(true);

        // If no response after 4 seconds → silent failure
        setTimeout(() => {
            if (googleClicked) {
                setError("Google login failed — no response received.");
            }
        }, 4000);
    };

    const handleGoogleSuccess = (credentialResponse) => {
        setGoogleClicked(false); // stop silent-failure timer
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
                <div className="modal">
                    <button className="close-btn" onClick={onClose}>✕</button>
                    <h2>{translatedTexts?.loginTitle || "Login"}</h2>

                    {/* Google Login Button */}
                    <GoogleLogin
                        onClick={handleGoogleClick}
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google login was cancelled or failed.")}
                    />

                    {error && (
                        <p className="error-message" style={{ color: "red", marginTop: "10px" }}>
                            {error}
                        </p>
                    )}

                    <p className="divider">or</p>

                    {/* Disabled email login */}
                    <input type="email" placeholder="Email" className="input-field" disabled />
                    <input type="password" placeholder="Password" className="input-field" disabled />

                    <button
                        className="submit-btn disabled"
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
