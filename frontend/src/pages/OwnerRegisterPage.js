// Предположим, у нас есть OwnerRegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';

const OwnerRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [password, setPassword] = useState('');
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
      // response.data.message = "Owner registered successfully."

      // очистим поля
      setUsername('');
      setEmail('');
      setOrganizationName('');
      setPassword('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data)); // покажем ошибки
      } else {
        setError('Ошибка при регистрации владельца');
      }
    }
  };

  return (
    <div>
      <h2>Регистрация Владельца</h2>
      <form onSubmit={handleOwnerRegister}>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Почта (email): </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Имя заведения: </label>
          <input
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
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

        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <p style={{color:"green"}}>{message}</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default OwnerRegisterPage;
