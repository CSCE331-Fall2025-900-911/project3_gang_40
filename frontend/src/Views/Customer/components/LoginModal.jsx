import React, { useState } from "react";
import '../css/LoginModal.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginModal({ onClose, onLoginSuccess, translatedTexts }) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const [error, setError] = useState("");

    const handleGoogleSuccess = (credentialResponse) => {
        setError("");

        if (!credentialResponse?.credential) {
            setError("Google login failed — please try again.");
            return;
        }

        try {
            const jwt = credentialResponse.credential;
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            const email = payload?.email || null;

            if (!email) {
                setError("Could not read Google account email.");
                return;
            }

            onLoginSuccess(email);
        } catch (e) {
            setError("Failed to process Google login.");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="modal-overlay">
                <div className="modal">
                    <button className="close-btn" onClick={onClose}>✕</button>
                    <h2>{translatedTexts?.loginTitle || 'Login'}</h2>

                    {/* Google Login */}
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google login failed.")}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <p className="divider">or</p>

                    {/* Disabled email login */}
                    <input type="email" placeholder="Email" className="input-field" disabled />
                    <input type="password" placeholder="Password" className="input-field" disabled />

                    <button
                        className="submit-btn disabled"
                        disabled
                        onClick={() => setError("Only Google login is supported.")}
                    >
                        {translatedTexts?.loginButton || 'Login'}
                    </button>

                    <p className="info-text">Email login coming soon.</p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginModal;
