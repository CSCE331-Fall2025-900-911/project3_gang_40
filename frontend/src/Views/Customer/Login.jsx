import React, { useState } from 'react';
import './css/Login.css';
import logo from './assets/share_tea.png';
import boba from './assets/boba.jpeg';
import LoginModal from './components/LoginModal';
import Customer from './Customer';
import textKeys from './components/text';


function Login() {
    const [modalOpen, setModalOpen] = useState(false);
    const [customerEmail, setCustomerEmail] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // new

    // If logged in, show Customer page
    if (customerEmail) {
        return <Customer email={customerEmail} language={selectedLanguage} onBack={() => setCustomerEmail(null)} />;
    }

    function onLoginSuccess(userEmail) {
        console.log("Logged in user:", userEmail);
        setCustomerEmail(userEmail);
        setModalOpen(false);
    }

    // handler for language selection
    function handleLanguageSelect(lang) {
        setSelectedLanguage(lang);
        setShowLanguageDropdown(false); // hide dropdown after selection
    }

    return (
        <div className='main'>
            <div className='up'>
                <div className="top-left">
                    <img className='logo' src={logo} alt='logo' />
                </div>
                <div className='left'>
                    <img className='boba' src={boba} alt='boba' />
                    <div className="text">
                        <h2 className='text_1'>Welcome to Share Tea!</h2>
                        <p className='text_2'>Login below for Share Tea Rewards</p>
                    </div>
                </div>
            </div>

            <div className="bottom">
                <div className="left-box">
                    <button className='login-btn' onClick={() => setModalOpen(true)}>Login</button>

                    <div className="accessibility">
                        <button
                            className="language"
                            onClick={() => setShowLanguageDropdown(prev => !prev)}
                        >
                            Language Change
                        </button>

                        {showLanguageDropdown && (
                            <div className="language-dropdown">
                                <button onClick={() => handleLanguageSelect('en')}>English</button>
                                <button onClick={() => handleLanguageSelect('es')}>Spanish</button>
                                <button onClick={() => handleLanguageSelect('fr')}>French</button>
                                <button onClick={() => handleLanguageSelect('zh-CN')}>Chinese</button>
                            </div>
                        )}
                        <button className="shortcuts">Accessibility</button>
                    </div>
                </div>

                <div className='right-box'>
                    <button className='points'>Earn Points</button>
                </div>
            </div>

            {modalOpen && (
                <LoginModal
                    onClose={() => setModalOpen(false)}
                    onLoginSuccess={onLoginSuccess}
                    translatedTexts={textKeys} 
                />
            )}
        </div>
    );
}

export default Login;
