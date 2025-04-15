import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ClientLoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ClientLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClientLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/client/login/', {
        username,
        password
      });
      const { token, role } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ошибка при авторизации клиента');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Авторизация Клиента</h2>
      <form className="login-form" onSubmit={handleClientLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="login-btn">Войти</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default ClientLoginPage;
