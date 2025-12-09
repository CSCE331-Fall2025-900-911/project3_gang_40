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
  const [currentView, setCurrentView] = useState('login');
  const [modalOpen, setModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [largeMode, setLargeMode] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [showQR, setShowQR] = useState(false);

  if (customerEmail) {
    return (
      <Customer
        customerEmail={customerEmail}
        onLogout={() => {
          setCustomerEmail(null);
          setCurrentView('login');
          setWidgetKey(prev => prev + 1);
        }}
        onOrderComplete={() => {
          setCustomerEmail(null);
          setLargeMode(false);
        }}
      />
    );
  }

  function onLoginSuccess(userEmail) {
    console.log('Logged in user:', userEmail);
    setCustomerEmail(userEmail);
    setModalOpen(false);
  }

  return (
    <div className="login-page">
      <div className={`login-card ${largeMode ? 'login-card--large' : ''}`}>
        {/* Logo Badge */}
        <div className="login-logo-badge">
          <img src={logo} alt="Share Tea Logo" className="logo" />
        </div>

        {/* Hero Section */}
        <div className="login-hero-section">
          <img src={boba} alt="Boba drink" className="boba-image" />
          <h1 className="hero-title">Welcome to Share Tea!</h1>
          <p className="hero-subtitle">Login to start earning rewards.</p>
        </div>

        {/* Primary Action */}
        <div className="primary-action-section">
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-login"
          >
            Login
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="secondary-actions-section">
          <button
            onClick={() => setShowQR(prev => !prev)}
            className="btn btn-secondary btn-qr"
          >
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>

          <button
            onClick={onBack}
            className="btn btn-outline btn-exit"
          >
            Exit
          </button>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <div className="qr-code-section">
            <QRCodeDisplay />
          </div>
        )}
      </div>

      {/* Bottom-Left Buttons Container */}
      <div className="bottom-left-buttons">
        {/* Google Translate Widget Button */}
        <div className="translate-widget-container">
          <GoogleTranslateWidget 
            key={widgetKey}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        {/* Accessibility Icon Button */}
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

      {/* Login Modal */}
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
