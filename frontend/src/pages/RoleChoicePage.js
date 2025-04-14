// src/pages/RoleChoicePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const RoleChoicePage = () => {
  return (
    <div>
      <h2>Выберите роль</h2>
      <p>
        <Link to="/owner/login">Я Владелец</Link> | {' '}
        <Link to="/client/login">Я Клиент</Link>
      </p>
      <p>
        Нет аккаунта? <br />
        <Link to="/owner/register">Регистрация владельца</Link> | {' '}
        <Link to="/client/register">Регистрация клиента</Link>
      </p>
    </div>
  );
};

export default RoleChoicePage;
