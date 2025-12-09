import React, { useState } from 'react';
import './css/Login.css';
import logo from './assets/share_tea.png';
import boba from './assets/boba.jpeg';
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
        email={customerEmail}
        language={selectedLanguage}
        largeMode={largeMode}
        onBack={() => {
          setCustomerEmail(null);
          setCurrentView('login');
          setWidgetKey(prev => prev + 1); // Remount widget when returning to login
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
    <div className={`login-page ${largeMode ? 'login-page--large' : ''}`}>
      <div className={`login-card ${largeMode ? 'login-card--large' : ''}`}>
        <header className="login-header">
          <img className="logo" src={logo} alt="Share Tea logo" />
        </header>
        <div className="login-content">
          {/* Left: hero */}
          <div className="login-hero">
            <img className="boba" src={boba} alt="Boba drink" />
            <div className="text">
              <h2 className="text_1">Welcome to Share Tea!</h2>
              <p className="text_2">Login to start earning rewards.</p>
            </div>
          </div>
          {/* Right: actions */}
          <div className="login-actions">
            <button
              className="btn btn-primary login-btn"
              onClick={() => setModalOpen(true)}
            >
              Login
            </button>
            <div className="accessibility">
              <GoogleTranslateWidget
                key={widgetKey} 
                includedLanguages="en,es,fr,zh-CN,vi,ko,ja,pt,de,it,ru,ar,hi,bn,pa,ur,tr,pl,nl,sv,da,no,fi,el,he,th,ms,id"
                className="my-gt-widget"
              />
              <button
                className="btn btn-outline shortcuts"
                onClick={() => setLargeMode(prev => !prev)}
                aria-pressed={largeMode}
              >
                {largeMode ? 'Normal Size' : 'Large Size'}
              </button>
            </div>
            <div className="secondary-actions">
              <button
                className="btn btn-outline qr-toggle-btn"
                onClick={() => setShowQR(prev => !prev)}
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
              <button
                className="btn btn-danger customer-exit-btn"
                onClick={onBack}
              >
                Exit
              </button>
            </div>

            {/* QR Code Display */}
            {showQR && (
              <div className="qr-code-wrapper">
                <QRCodeDisplay 
                  url={window.location.href}
                  size={largeMode ? 250 : 180}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {modalOpen && (
        <LoginModal
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