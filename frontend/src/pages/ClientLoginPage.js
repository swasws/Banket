
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
      const { token, role, user_id } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', user_id);
      navigate('/');
    } catch (err) {
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ошибка при авторизации клиента');
      }
    }
  };

  return (
    <div className="login-wrapper-modern">
      <div className="login-illustration-modern">
        <div className="login-illustration-text">
          <h1>С возвращением!</h1>
          </div>
      </div>
      <div className="login-form-side-modern">
        <div className="login-container-modern">
          <h2 className="login-title-modern">Вход для клиента</h2>
          <form className="login-form-modern" onSubmit={handleClientLogin}>
            <label>Имя пользователя</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Пароль</label>
            <div className="password-wrapper-modern">
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
            <button type="submit" className="login-button-modern">Войти</button>
          </form>
          {error && <p className="login-error-modern">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;
