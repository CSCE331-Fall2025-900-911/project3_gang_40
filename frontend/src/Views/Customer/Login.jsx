import React, { useState } from 'react';
import './css/Login.css';
import logo from './assets/share_tea.png';
import boba from './assets/boba.jpeg';
import accessibilityIcon from './assets/large_text_accessibility.png';
import LoginModal from './components/LoginModal';
import Customer from './Customer';
import textKeys from './components/text';
import GoogleTranslateWidget from './components/GoogleTranslateWidget';
import QRCodeDisplay from './components/QRCodeDisplay.jsx';

function Login({ onBack }) {
  const [customerEmail, setCustomerEmail] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [largeMode, setLargeMode] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const onLoginSuccess = (userEmail) => {
    setCustomerEmail(userEmail);
    setModalOpen(false);
  };

  return (
    <div className="login-page">
      {/* Google Translate Widget is always mounted */}
      <div className="bottom-left-buttons">
        <GoogleTranslateWidget onLanguageChange={setSelectedLanguage} />

        <button
          onClick={() => setLargeMode(prev => !prev)}
          className={`accessibility-icon-button ${largeMode ? 'active' : ''}`}
          aria-label={largeMode ? 'Switch to normal size' : 'Switch to large size'}
          aria-pressed={largeMode}
          title={largeMode ? 'Normal Size' : 'Large Size'}
        >
          <img
            src={accessibilityIcon}
            alt="Accessibility"
            className="accessibility-icon-img"
          />
        </button>
      </div>

      {/* Show Customer view if logged in */}
      {customerEmail ? (
        <Customer
          email={customerEmail}
          onBack={() => setCustomerEmail(null)} // exit back to login
          onLogout={() => setCustomerEmail(null)}
          onOrderComplete={() => setCustomerEmail(null)}
          largeMode={largeMode}
          language={selectedLanguage}
        />
      ) : (
        // Show Login card if not logged in
        <div className={`login-card ${largeMode ? 'login-card--large' : ''}`}>
          <div className="login-logo-badge">
            <img src={logo} alt="Share Tea Logo" className="logo" />
          </div>

          <div className="login-hero-section">
            <img src={boba} alt="Boba drink" className="boba-image" />
            <h1 className="hero-title">Welcome to Share Tea!</h1>
            <p className="hero-subtitle">Login to start earning rewards.</p>
          </div>

          <div className="primary-action-section">
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-primary btn-login"
            >
              Login
            </button>
          </div>

          <div className="secondary-actions-section">
            <button
              onClick={() => setShowQR(prev => !prev)}
              className="btn btn-secondary btn-qr"
            >
              {showQR ? 'Hide QR' : 'Show QR'}
            </button>

            <button onClick={onBack} className="btn btn-outline btn-exit">
              Exit
            </button>
          </div>

          {showQR && (
            <div className="qr-code-section">
              <QRCodeDisplay />
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <LoginModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onLoginSuccess={onLoginSuccess}
          translatedTexts={textKeys}
          largeMode={largeMode}
        />
      )}
    </div>
  );
}

export default Login;
