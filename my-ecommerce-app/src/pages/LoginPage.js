import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { Link } from 'react-router-dom'; 

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Token received after login:', data.token);
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        setIsLoggedIn(true); // Use the prop here
        setTimeout(() => navigate('/'), 0); // Navigate to homepage
      } else {
        console.error('Login failed:', data.message);
        alert(data.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong! Please try again.');
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginPage-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

