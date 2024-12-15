import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const response = await fetch('http://localhost:5000/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoggedIn(true); // Valid token
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsLoggedIn(false);
      }
    };

    validateToken();
  }, []); // Run once on mount

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <CartProvider>
      <Router>
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <SignupPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/cart"
            element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

