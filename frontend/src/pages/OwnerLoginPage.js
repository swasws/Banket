import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerLoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/owner/login/', {
        username,
        password
      });
      // В ответе у нас token, role, message
      const { token, role } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);

      // Допустим, после логина владельца ведём на /owner/dashboard
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
    <div>
      <h2>Авторизация Владельца</h2>
      <form onSubmit={handleOwnerLogin}>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default OwnerLoginPage;
