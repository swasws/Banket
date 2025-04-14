import React, { useState } from 'react';
import axios from 'axios';

const ClientRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
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

      // очистим поля
      setUsername('');
      setEmail('');
      setFullName('');
      setPassword('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Ошибка при регистрации клиента');
      }
    }
  };

  return (
    <div>
      <h2>Регистрация Клиента</h2>
      <form onSubmit={handleClientRegister}>
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
          <label>Полное имя: </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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

export default ClientRegisterPage;
