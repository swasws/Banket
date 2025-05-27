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

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/owner/login/', {
        username,
        password
      });
      const { token, role, user_id } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', user_id);
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Ошибка при авторизации владельца');
    }
  };

  return (
    <div className="owner-login-wrapper">
      <div className="owner-login-illustration">
        <div className="owner-login-text">
          <h1>С возвращением!</h1>
        </div>
      </div>
      <div className="owner-login-form-side">
        <div className="owner-login-container">
          <h2 className="owner-login-title">Вход для владельца</h2>
          <form className="owner-login-form" onSubmit={handleOwnerLogin}>
            <label>Имя пользователя</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Пароль</label>
            <div className="owner-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="owner-login-button">Войти</button>
          </form>
          {error && <p className="owner-login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
