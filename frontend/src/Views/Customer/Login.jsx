import React, { useState } from 'react';
import './css/Login.css';
import logo from './assets/share_tea.png';
import boba from './assets/boba.jpeg';
import LoginModal from './components/LoginModal';
import Customer from './Customer';
import textKeys from './components/text';

function Login({ onBack }) {
  const [currentView, setCurrentView] = useState('login')
  const [modalOpen, setModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [largeMode, setLargeMode] = useState(false);
  const [customerDiscount, setCustomerDiscount] = useState(false);

  if (customerEmail) {
    return (
      <Customer
        email={customerEmail}
        language={selectedLanguage}
        largeMode={largeMode}
        customerDiscount={customerDiscount}
        onBack={() => {
          setCustomerEmail(null);
          setCurrentView('login')
        }}
        onOrderComplete={() => {
          setCustomerEmail(null);
          setLargeMode(false);             
          setCustomerDiscount(false);
        }}
      />
    );
  }

  function onLoginSuccess(userEmail) {
    console.log('Logged in user:', userEmail);
    setCustomerEmail(userEmail);
    setModalOpen(false);
  }

  function handleLanguageSelect(lang) {
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);
  }

  return (
    <>
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
                <div className="language-wrapper">
                  <button
                    className="btn btn-outline language"
                    onClick={() => setShowLanguageDropdown(prev => !prev)}
                  >
                    Language: {selectedLanguage.toUpperCase()}
                  </button>

                  {showLanguageDropdown && (
                    <div className="language-dropdown">
                      <button onClick={() => handleLanguageSelect('en')}>
                        English
                      </button>
                      <button onClick={() => handleLanguageSelect('es')}>
                        Spanish
                      </button>
                      <button onClick={() => handleLanguageSelect('fr')}>
                        French
                      </button>
                      <button onClick={() => handleLanguageSelect('zh-CN')}>
                        Chinese
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-outline shortcuts"
                  onClick={() => { setLargeMode(prev => { return !prev; }); }}
                  aria-pressed={largeMode}
                >
                  {largeMode ? 'Normal Size' : 'Large Size'}
                </button>
              </div>

              <div className="secondary-actions">
                <button 
                  className="btn btn-secondary points"
                  onClick={setCustomerDiscount}
                >
                  {customerDiscount ? '10% Off!' : 'Earn Points'}
                </button>
                <button
                  className="btn btn-danger customer-exit-btn"
                  onClick={onBack}
                >
                  Exit
                </button>
              </div>
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
    </>
  );
}

export default Login;
