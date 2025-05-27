// src/pages/ClientRegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthForm.css';

const ClientRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleClientRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/client/register/', {
        username,
        email,
        full_name: fullName,
        password
      });
      setMessage(response.data.message);
      setUsername('');
      setEmail('');
      setFullName('');
      setPassword('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ошибка при регистрации клиента');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <div className="auth-illustration-text">
          <h1>С нами — легко находить залы</h1>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <h2 className="auth-title">Регистрация Клиента</h2>
          <form className="auth-form" onSubmit={handleClientRegister}>
            <label>Имя пользователя</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Почта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Полное имя</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Пароль</label>
            <div className="password-wrapper-regis">
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

            <button className="button-go" type="submit">Зарегистрироваться</button>
          </form>

          {message && <p className="auth-success">{message}</p>}
          {error && <p className="auth-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClientRegisterPage;
