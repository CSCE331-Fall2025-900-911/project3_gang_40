import { useState } from 'react';
import './StaffLogin.css';

function StaffLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock user database - Replace with actual API call
  const users = {
    'manager': { password: 'manager', role: 'manager' },
    'employee': { password: 'employee', role: 'employee' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      const user = users[username.toLowerCase()];
      
      if (!user) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Successful login
      onLoginSuccess(user.role);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <button 
        className="login-back-button"
        onClick={onBack}
      >
        Back
      </button>

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Staff Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
