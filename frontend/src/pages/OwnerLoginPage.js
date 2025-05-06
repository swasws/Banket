// src/pages/OwnerLoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './OwnerLoginPage.css';

const OwnerLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/owner/login/', {
        username,
        password
      });
      const { token, role } = response.data;
      localStorage.setItem('userId', response.data.user_id);
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      navigate('/owner/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ошибка при авторизации владельца');
      }
    }
  };

  return (
    <div className="owner-login-container">
      <h2 className="login-title">Вход для Владельца</h2>
      <form onSubmit={handleOwnerLogin} className="login-form">
        <div className="form-group">
          <label>Имя пользователя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group password-group">
          <label>Пароль</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="login-button">Войти</button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default OwnerLoginPage;
