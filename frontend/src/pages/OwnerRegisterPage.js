import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const OwnerRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleOwnerRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/owner/register/', {
        username,
        email,
        organization_name: organizationName,
        password
      });
      setMessage(response.data.message);
      setUsername('');
      setEmail('');
      setOrganizationName('');
      setPassword('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ошибка при регистрации владельца');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <div className="auth-illustration-text">
          <h1>Новый способ сдавать залы</h1>
          <p>Создайте аккаунт и начните получать бронирования</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <h2 className="auth-title">Регистрация Владельца</h2>
          <form className="auth-form" onSubmit={handleOwnerRegister}>
            <label>Имя</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />

            <label>Почта</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Имя заведения</label>
            <input value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />

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

export default OwnerRegisterPage;
