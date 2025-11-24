import React from "react";
import '../css/LoginModal.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginModal({ onClose, onLoginSuccess }) {
    const clientId = "142302983778-l1qf18imj4tbc2e57r696uab88gbsdb4.apps.googleusercontent.com";

    const handleGoogleSuccess = (credentialResponse) => {
        console.log("Google login success:", credentialResponse);

        // decode the JWT from Google
        const jwt = credentialResponse.credential;
        const payload = JSON.parse(atob(jwt.split('.')[1]));  

        console.log("Decoded user:", payload);

        // Pass user info (like email) to parent
        onLoginSuccess(payload);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="modal-overlay">
                <div className="modal">
                    <button className="close-btn" onClick={onClose}>✕</button>
                    <h2>Login</h2>

                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Google login failed")}
                    />

                    <p className="divider">or login with email</p>

                    <input type="email" placeholder="Email" className="input-field" />
                    <input type="password" placeholder="Password" className="input-field" />

                    <button 
                        className="submit-btn"
                        onClick={() => onLoginSuccess({ method: "email" })}
                    >
                        Login
                    </button>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginModal;
